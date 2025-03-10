import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Link from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import React, { useEffect, useState } from 'react'
import { CopyButton } from '../../CopyButton'
import { ColorRegexText } from './ColorRegexText'
import { ColorResultText } from './ColorResultText'
import { Delimiter, Flag, isRegExpExecArray, regexFlags } from './utils'

export const RegexTool = () => {
	const [regexString, setRegexString] = useState('^.*$')
	const [text, setText] = useState('Text to be matched')
	const [delimiter, setDelimiter] = useState<Delimiter>('/')
	const [result, setResult] = useState<RegExpExecArray | RegExpExecArray[] | null>(null)
	const [currentFlags, setCurrentFlags] = useState<Flag[]>([
		{ value: 'g', name: 'global', description: "Don't return after first match" },
		{ value: 'm', name: 'multi line', description: '^ and $ match start/end of line' },
	])
	const [error, setError] = useState<Error | null>(null)
	const theme = useTheme()
	const matches = useMediaQuery(theme.breakpoints.up('md'))

	useEffect(() => {
		// d flag is needed in order to color correct part of the text. But only added manually here in order to not sully the regular expression the user wants to create
		const timeOutId = setTimeout(() => {
			try {
				const stringOfFlags = currentFlags
					.map(f => {
						return f.value
					})
					.join('')
					.concat('d')
				const newRegex = new RegExp(regexString, stringOfFlags)
				let match: RegExpExecArray | RegExpExecArray[] | null = null
				if (stringOfFlags.includes('g')) {
					match = [...text.matchAll(newRegex)]
					if (match.length < 1) {
						match = null
					}
				} else {
					match = newRegex.exec(text)
				}
				setResult(match)
				setError(null)
			} catch (err) {
				setError(err as Error)
			}
		}, 500)
		return () => clearTimeout(timeOutId)
	}, [currentFlags, regexString, text])

	const stringFlags = currentFlags.map(cf => cf.value).join('')
	return (
		<Box sx={{ width: '100%' }}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					flexDirection: matches ? 'row' : 'column',
					rowGap: 1,
				}}
			>
				<TextField
					sx={{ flex: 1, mr: matches ? 1 : 0 }}
					label="Regex"
					placeholder="^.*$ will match everything "
					helperText={error ? error.message : 'Enter your regular expression here'}
					variant="filled"
					value={regexString}
					onChange={e => {
						setRegexString(e.target.value)
					}}
					error={!!error}
				/>
				<Tooltip
					title="More info about flags can be found here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags"
					placement="right-start"
				>
					<Autocomplete
						multiple
						options={regexFlags}
						getOptionLabel={option => option.value}
						value={currentFlags}
						onChange={(_event, newValue) => {
							setCurrentFlags(newValue)
						}}
						isOptionEqualToValue={(o, v) => o.value === v.value}
						renderInput={params => <TextField {...params} helperText="Add flags to the regex expression" />}
						renderOption={(props, option, { selected }) => {
							const { key, ...optionProps } = props
							return (
								<li key={key} {...optionProps}>
									<Box
										component={DoneIcon}
										sx={{ width: 17, height: 17, mr: '5px', ml: '-2px' }}
										style={{
											visibility: selected ? 'visible' : 'hidden',
										}}
									/>

									<Box
										sx={t => ({
											flexGrow: 1,
											'& span': {
												color: '#8b949e',
												...t.applyStyles('light', {
													color: '#586069',
												}),
											},
										})}
									>
										{option.name} - {option.value}
										<br />
										<span>{option.description}</span>
									</Box>
									<Box
										component={CloseIcon}
										sx={{ opacity: 0.6, width: 18, height: 18 }}
										style={{
											visibility: selected ? 'visible' : 'hidden',
										}}
									/>
								</li>
							)
						}}
					/>
				</Tooltip>
			</Box>
			<Box sx={{ mt: 1, display: 'flex', flexDirection: matches ? 'row' : 'column', gap: 1 }}>
				<FormControl sx={{ minWidth: '80px' }} variant="filled" margin="normal">
					<Select
						value={delimiter}
						onChange={e => {
							setDelimiter(e.target.value as Delimiter)
						}}
					>
						<MenuItem value="/">/</MenuItem>
						<MenuItem value="~">~</MenuItem>
						<MenuItem value="@">@</MenuItem>
						<MenuItem value=";">;</MenuItem>
						<MenuItem value="%">%</MenuItem>
						<MenuItem value="`">`</MenuItem>
						<MenuItem value="#">#</MenuItem>
					</Select>
					<FormHelperText>Change delimiter</FormHelperText>
				</FormControl>
				<ColorRegexText regexString={regexString} flags={stringFlags} delimiter={delimiter} />
				<CopyButton textToCopy={`${delimiter}${regexString}${delimiter}${stringFlags}`} />
			</Box>

			<TextField
				sx={{ mt: 1 }}
				fullWidth
				label="Text"
				multiline
				placeholder="Put text that you want to match in this field"
				minRows={5}
				variant="filled"
				value={text}
				helperText="Enter your text to match against your regular expression here"
				onChange={e => {
					setText(e.target.value)
				}}
			/>
			<Typography variant="h3" component="h3" sx={{ mt: 1 }}>
				Result
			</Typography>
			<Box sx={{ backgroundColor: theme.palette.background.paper }}>
				{result ? (
					<ColorResultText text={text} regexResults={isRegExpExecArray(result, stringFlags) ? [result] : result} />
				) : (
					<Typography sx={{ whiteSpace: 'pre' }} component="span">
						{' '}
					</Typography>
				)}
			</Box>
			<Box sx={{ mt: 2, borderTop: '1px solid ' }}>
				<Typography component="p">
					Note that this page is using the native javascript regex engine. There are different flavours of the regex
					engine, if you have very specific use cases you can compare the different engines here:{' '}
					<Link href="https://rbuckton.github.io/regexp-features/">https://rbuckton.github.io/regexp-features/</Link>
				</Typography>
			</Box>
		</Box>
	)
}
