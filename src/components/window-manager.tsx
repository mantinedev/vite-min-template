import { Box, Transition } from '@mantine/core'
import { ReactNode, useMemo } from 'react'
import { TypeAppManifest } from '../apps/taskbar'
import { useTasks } from '../hooks/use-tasks'
import useIsMobile from '../hooks/use-is-mobile'
import { usePerformanceSettings } from '../hooks/use-effects'

export function WindowManager({
	children,
	manifest,
}: {
	children?: ReactNode
	manifest: TypeAppManifest
}) {
	const { taskGetZIndex, taskIsOpen, taskIsMinimized, taskIsFocused } = useTasks()
	const isMobile = useIsMobile()

	const isMounted = useMemo(() => {
		if (taskIsOpen('launcher')) return false
		if (taskIsMinimized(manifest.appId)) return false
		if (isMobile && !taskIsFocused(manifest.appId)) return false
		if (!taskIsOpen(manifest.appId)) return false

		return true
	}, [isMobile, manifest.appId, taskIsFocused, taskIsMinimized, taskIsOpen])

	const performance = usePerformanceSettings()

	return (
		<Transition
			mounted={isMounted}
			keepMounted={taskIsOpen(manifest.appId)}
			transition={
				!taskIsOpen(manifest.appId)
					? 'fade'
					: {
							in: { opacity: 1, transform: 'scale(1)' },
							out: { opacity: 0, transform: 'scale(0)' },
							common: { transformOrigin: 'bottom' },
							transitionProperty: 'transform, opacity',
					  }
			}
			duration={performance.animations ? undefined : 0}>
			{(styles) => (
				<Box
					pos={'absolute'}
					top={`0.5em`}
					bottom={`7em`}
					left={`0.5em`}
					right={`0.5em`}
					style={{
						...styles,
						zIndex: 3 + taskGetZIndex(manifest.appId),
						pointerEvents: 'none',
						userSelect: 'none',
					}}>
					{children}
				</Box>
			)}
		</Transition>
	)
}
