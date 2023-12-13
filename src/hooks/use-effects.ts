import { useLocalStorage } from '@mantine/hooks'

export function usePerformanceSettings() {
	const [transparency, setTransparency] = useLocalStorage({
		key: 'transparency',
		defaultValue: true,
		getInitialValueInEffect: false,
	})
	const [animations, setAnimations] = useLocalStorage({
		key: 'animations',
		defaultValue: true,
		getInitialValueInEffect: false,
	})

	return {
		transparency,
		setTransparency,
		animations,
		setAnimations,
	}
}
