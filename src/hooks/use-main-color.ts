import { useLocalStorage } from '@mantine/hooks'

export function useMainColor() {
	const [mainColorTheme, setMainColorTheme] = useLocalStorage({
		key: 'main-color-theme',
		defaultValue: 'blue',
		getInitialValueInEffect: false,
	})

	return {
		mainColorTheme,
		setMainColorTheme,
	}
}
