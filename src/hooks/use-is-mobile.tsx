import { useMediaQuery } from '@mantine/hooks'

export default function useIsMobile() {
	const isMobile = useMediaQuery('(pointer: coarse)')

	return isMobile
}
