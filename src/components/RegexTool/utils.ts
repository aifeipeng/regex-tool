export type Flag = {
	value: string
	name: string
	description: string
}

export type Delimiter = '/' | '~' | '@' | ';' | '%' | '`' | '#'

export const highlightColors = ['#ADC4CC', '#9B539C', '#92B06A', '#E19D29', '#EB65A0', '#DD5F32']
export const matchColor = '#4298B5'

export const regexFlags: Flag[] = [
	{ value: 'g', name: 'global', description: "Don't return after first match" },
	{ value: 'i', name: 'insensitive', description: 'Case insensitive match' },
	{ value: 'm', name: 'multi line', description: '^ and $ match start/end of line' },
	{ value: 's', name: 'single line', description: 'Dot matches newline' },
	{ value: 'u', name: 'unicode', description: 'Match with full unicode' },
	{ value: 'v', name: 'vnicode', description: 'Enable all unicode and character set features' },
	{ value: 'y', name: 'sticky', description: 'Anchor to start of pattern, or at the end of the most recent match' },
	// In the current implementation We akways use the d flag in order to be able to colorize the groups correctly. This could of course be turned off if we choose that the user should be able to choose the d flag or not
	// { value: 'd', name: 'indices', description: 'The regex engine return match indices' },
]

export const isRegExpExecArray = (
	data: RegExpExecArray | RegExpExecArray[] | null,
	flags: string
): data is RegExpExecArray => {
	if (!flags.includes('g') && data !== null) {
		return true
	}
	return false
}
