import { Box, Center, Group, Paper, Transition } from '@mantine/core'
import { useWindowEvent } from '@mantine/hooks'
import { Fragment } from 'react'
import { usePerformanceSettings } from '../../hooks/use-effects'
import { useManifests } from '../../hooks/use-manifests'
import { useTasks } from '../../hooks/use-tasks'
import { IconItem } from '../taskbar'

export default function Launcher() {
	const { taskIsOpen, tasks, closeTask } = useTasks()

	const manifests = useManifests()

	useWindowEvent('keydown', (e) => {
		if (taskIsOpen('launcher') && e.key === 'Escape') {
			closeTask('launcher')
		}
	})

	const performance = usePerformanceSettings()

	return (
		<Center
			onClick={() => {
				closeTask('launcher')
			}}
			p={'md'}
			pos={'absolute'}
			top={0}
			bottom={0}
			left={0}
			right={0}
			style={{
				zIndex: 3 + tasks.length + 1,
				pointerEvents: taskIsOpen('launcher') ? 'auto' : 'none',
			}}>
			<Transition
				mounted={taskIsOpen('launcher')}
				transition={'slide-down'}
				duration={performance.animations ? undefined : 0}>
				{(styles) => (
					<Box style={styles}>
						<Paper
							onClick={(e) => {
								e.stopPropagation()
							}}
							radius={8}
							bg={'dark.9'}
							p={'xs'}>
							<Group
								maw={'16.25em'}
								gap={10}
								justify={'center'}>
								{manifests
									.filter((manifest) => manifest.appId !== 'launcher')
									.map((props) => (
										<Fragment key={`taskbar-item-${props.appId}`}>
											{/* render all apps! */}

											{/* {props.alwaysInTaskbar || taskIsOpen(props.appId) ? ( */}
											<IconItem
												key={`taskbar-item-${props.appId}`}
												{...props}
											/>
											{/* ) : null} */}
										</Fragment>
									))}
							</Group>
						</Paper>
					</Box>
				)}
			</Transition>
		</Center>
	)
}
