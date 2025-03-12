import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useMemo } from 'react'
import { darkerHighlightColors } from './utils'
import { useTheme } from '@mui/material/styles';

export function ColorRegexText({
	regexString,
	flags,
	delimiter = '/',
}: {
	regexString: string
	flags: string
	delimiter?: string
}) {
    const theme = useTheme()
	const colorRegex = useMemo(() => {
		const arrayOfRegex = Array.from(regexString)
		const arrayOfParts: Array<{ string: string; color: number | undefined }> = []
		let colorCounter = 0
		let parenthesisCounter = 0
		let arrayOfPartsIndex = 0
		let maxDepthOfNestedGroups = 0
		arrayOfRegex.forEach(char => {
			if (char !== '(' && char !== ')') {
				arrayOfParts[arrayOfPartsIndex] = {
					string: arrayOfParts[arrayOfPartsIndex]?.string ? arrayOfParts[arrayOfPartsIndex].string.concat(char) : char,
					color: undefined,
				}
			} else if (char === '(') {
				arrayOfPartsIndex++
				arrayOfParts[arrayOfPartsIndex] = { string: '(', color: colorCounter + parenthesisCounter }
				parenthesisCounter++
				arrayOfPartsIndex++
			} else if (char === ')') {
				arrayOfPartsIndex++
				parenthesisCounter--
				arrayOfParts[arrayOfPartsIndex] = { string: ')', color: colorCounter + parenthesisCounter }
				if (parenthesisCounter !== 0) {
					maxDepthOfNestedGroups++
				}
				if (parenthesisCounter === 0) {
					colorCounter = colorCounter + maxDepthOfNestedGroups + 1
					maxDepthOfNestedGroups = 0
				}
				arrayOfPartsIndex++
			}
		})
		return arrayOfParts.map((word, i) => {
			return (
				<Typography
					component="span"
					sx={{ bgcolor: word.color !== undefined ? darkerHighlightColors[word.color % darkerHighlightColors.length] : 'initial' }}
					key={`color-regex-${i}`}
				>
					{word.string}
				</Typography>
			)
		})
	}, [regexString])

	return (
		<Box sx={{ m: 'auto' }}>
			<Typography color={theme.palette.text.secondary} component="span">
				{delimiter}
			</Typography>
			{colorRegex}
			<Typography color={theme.palette.text.secondary} component="span">
				{delimiter}
			</Typography>
			<Typography color={theme.palette.info.main} component="span">
				{flags}
			</Typography>
		</Box>
	)
}
