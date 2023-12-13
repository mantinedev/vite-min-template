import { Box, Menu, Transition, rgba, useMantineTheme } from '@mantine/core'
import { useDisclosure, useWindowEvent } from '@mantine/hooks'
import { IconApps, IconPhoto } from '@tabler/icons-react'
import { useState } from 'react'
import { useTasks } from '../../hooks/use-tasks'
import { usePerformanceSettings } from '../../hooks/use-effects'

export default function Desktop() {
	const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | undefined>(
		undefined,
	)
	const [selection, setSelection] = useState<{ x: number; y: number } | undefined>(undefined)

	const theme = useMantineTheme()

	const { taskIsOpen, toggleAppIsVisible } = useTasks()

	useWindowEvent('mouseup', () => {
		setSelectionStart(undefined)
		setSelection(undefined)
	})

	const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
	const [menuOpened, menuHandlers] = useDisclosure(false)

	const performance = usePerformanceSettings()

	return (
		<Transition
			mounted={!taskIsOpen('launcher')}
			transition={'pop'}
			duration={performance.animations ? undefined : 0}>
			{(styles) => (
				<Box
					onContextMenu={(e) => {
						e.preventDefault()
						menuHandlers.open()
					}}
					onMouseMove={(e) => {
						const target = e.target as HTMLElement
						const size = target.getBoundingClientRect()

						const mousePositionRaw = {
							x: e.clientX,
							y: e.clientY,
						}

						if (!menuOpened) setMousePos(mousePositionRaw)

						if (e.buttons === 1) {
							const mousePosition = {
								x: e.clientX / size.width,
								y: e.clientY / size.height,
							}
							if (!selectionStart) {
								setSelectionStart(mousePosition)
							}
							setSelection(mousePosition)
						} else {
							setSelectionStart(undefined)
							setSelection(undefined)
						}
					}}
					onMouseUp={() => {
						setSelectionStart(undefined)
						setSelection(undefined)
					}}
					pos={'absolute'}
					left={0}
					top={0}
					right={0}
					bottom={0}
					style={{
						...styles,
						zIndex: 1,
						userSelect: 'none',
					}}>
					{selection && selectionStart ? (
						<Box
							bg={rgba(theme.colors.dark[4], 0.5)}
							pos={'absolute'}
							style={{
								userSelect: 'none',
								zIndex: 0,
								pointerEvents: 'none',
								borderRadius: '0.25em',
								borderWidth: '0.05em',
								borderColor: rgba(theme.colors.dark[4], 0.5),
								borderStyle: 'solid',
							}}
							left={`${Math.min(selectionStart.x, selection.x) * 100}%`}
							top={`${Math.min(selectionStart.y, selection.y) * 100}%`}
							w={`${Math.abs(selection.x - selectionStart.x) * 100}%`}
							h={`${Math.abs(selection.y - selectionStart.y) * 100}%`}
						/>
					) : null}
					<Menu
						onClose={() => menuHandlers.close()}
						opened={menuOpened}
						transitionProps={{
							duration: performance.animations ? undefined : 0,
						}}
						position={'bottom-start'}>
						<Menu.Target>
							<Box
								pos={'absolute'}
								left={mousePos.x}
								top={mousePos.y}
								w={1}
								h={1}
							/>
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Item
								onClick={() => {
									toggleAppIsVisible('launcher')
								}}
								leftSection={
									<IconApps
										width={16}
										height={16}
									/>
								}>
								Aplicaciones
							</Menu.Item>
							<Menu.Item
								onClick={() => {
									toggleAppIsVisible('settings', {
										force: true,
										params: [{ key: 'settings-tab', value: 'theme' }],
									})
								}}
								leftSection={
									<IconPhoto
										width={16}
										height={16}
									/>
								}>
								Cambiar fondo
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</Box>
			)}
		</Transition>
	)
}
