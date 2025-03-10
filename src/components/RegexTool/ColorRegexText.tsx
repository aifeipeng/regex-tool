import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useMemo } from 'react'
import { highlightColors } from './utils'

export function ColorRegexText({
	regexString,
	flags,
	delimiter = '/',
}: {
	regexString: string
	flags: string
	delimiter?: string
}) {
	const coloureRegex = useMemo(() => {
		const arrayOfRegex = Array.from(regexString)
		const arryOfParts: Array<{ string: string; color: number | undefined }> = []
		let colorCounter = 0
		let parenthesisCounter = 0
		let arryOfPartsIndex = 0
		let maxDepthOfNestedGroups = 0
		arrayOfRegex.forEach(char => {
			if (char !== '(' && char !== ')') {
				arryOfParts[arryOfPartsIndex] = {
					string: arryOfParts[arryOfPartsIndex]?.string ? arryOfParts[arryOfPartsIndex].string.concat(char) : char,
					color: undefined,
				}
			} else if (char === '(') {
				arryOfPartsIndex++
				arryOfParts[arryOfPartsIndex] = { string: '(', color: colorCounter + parenthesisCounter }
				parenthesisCounter++
				arryOfPartsIndex++
			} else if (char === ')') {
				arryOfPartsIndex++
				parenthesisCounter--
				arryOfParts[arryOfPartsIndex] = { string: ')', color: colorCounter + parenthesisCounter }
				if (parenthesisCounter !== 0) {
					maxDepthOfNestedGroups++
				}
				if (parenthesisCounter === 0) {
					colorCounter = colorCounter + maxDepthOfNestedGroups + 1
					maxDepthOfNestedGroups = 0
				}
				arryOfPartsIndex++
			}
		})
		return arryOfParts.map((word, i) => {
			return (
				<Typography
					component="span"
					sx={{ bgcolor: word.color !== undefined ? highlightColors[word.color % highlightColors.length] : 'initial' }}
					key={`color-regex-${i}`}
				>
					{word.string}
				</Typography>
			)
		})
	}, [regexString])

	return (
		<Box sx={{ m: 'auto' }}>
			<Typography color="text.secondary" component="span">
				{delimiter}
			</Typography>
			{coloureRegex}
			<Typography color="text.secondary" component="span">
				{delimiter}
			</Typography>
			<Typography color="text.hint" component="span">
				{flags}
			</Typography>
		</Box>
	)
}
