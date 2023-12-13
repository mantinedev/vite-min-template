import { createTheme } from '@mantine/core'
import { useMemo } from 'react'
import { useMainColor } from '../hooks/use-main-color'

export function useTheme() {
	const { mainColorTheme } = useMainColor()

	return useMemo(() => {
		return createTheme({
			/* Put your mantine theme override here */
			primaryColor: mainColorTheme,
		})
	}, [mainColorTheme])
}
