import {
	ActionIcon,
	Box,
	Center,
	Group,
	Indicator,
	Menu,
	Paper,
	Tooltip,
	Transition,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconX, TablerIconsProps } from '@tabler/icons-react'
import { ForwardedRef, Fragment, ReactNode, createElement, forwardRef, useMemo } from 'react'
import { useManifests } from '../../hooks/use-manifests'
import { useTasks } from '../../hooks/use-tasks'
import { usePerformanceSettings } from '../../hooks/use-effects'

export interface TypeAppManifest {
	appId: string
	name: string
	icon: (props: TablerIconsProps) => JSX.Element
	alwaysOpened?: boolean
	alwaysInTaskbar?: boolean
	canMinimize?: boolean
	canMaximize?: boolean
	hiddenInLauncher?: boolean
	soon?: boolean
	dev?: boolean
	defaultSize?: {
		width?: number
		height?: number
	}
	minSize?: {
		width?: number
		height?: number
	}
	onCloseClearParams?: {
		key: string
	}[]
	menuContent?: JSX.Element
}

export const IconItem = forwardRef(function IconItem(
	manifest: TypeAppManifest,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars -- No se usa
	_ref: ForwardedRef<HTMLDivElement>,
) {
	const {
		taskIsOpen,
		taskIsMinimized,
		taskIsMaximized,
		taskGetZIndex,
		tasks,
		toggleAppIsVisible,
		closeTask,
	} = useTasks()

	const label: ReactNode = useMemo(() => {
		if (manifest.alwaysOpened) return undefined
		if (taskIsMinimized(manifest.appId)) return undefined
		if (taskIsMaximized(manifest.appId)) return <Box w={18} />
		if (!taskIsMaximized(manifest.appId)) return <Box w={6} />
		return undefined
	}, [manifest.alwaysOpened, manifest.appId, taskIsMaximized, taskIsMinimized])

	const [opened, handlers] = useDisclosure(false)

	const indicatorVisible = useMemo(() => {
		if (taskIsOpen(manifest.appId)) return true
		if (manifest.alwaysOpened) {
			return true
		}
		return undefined
	}, [manifest.alwaysOpened, manifest.appId, taskIsOpen])

	return (
		<Menu
			position={'top'}
			opened={opened}
			onClose={handlers.close}>
			<Menu.Target>
				<Tooltip
					opened={opened ? false : undefined}
					label={`${manifest.name}${manifest.soon === true ? ' - Próximamente' : ''}`}
					color={'dark.7'}>
					<Indicator
						size={6}
						disabled={!indicatorVisible}
						color={
							taskGetZIndex(manifest.appId) === tasks.length || manifest.alwaysOpened
								? undefined
								: 'dark.5'
						}
						label={label}
						position={'bottom-center'}>
						<ActionIcon
							disabled={manifest.soon === true}
							onClick={() => {
								toggleAppIsVisible(manifest.appId)
								if (manifest.appId !== 'launcher' && taskIsOpen('launcher'))
									closeTask('launcher')
							}}
							onContextMenu={(e) => {
								e.preventDefault()
								handlers.open()
							}}
							aria-label={manifest.name}
							color={'dark.7'}
							variant={'filled'}
							mb={6}
							size={'xl'}
							radius={'md'}
							style={{ lineHeight: 0 }}>
							{createElement(manifest.icon, {
								width: 24,
								height: 24,
							})}
						</ActionIcon>
					</Indicator>
				</Tooltip>
			</Menu.Target>
			<Menu.Dropdown>
				{manifest.menuContent}
				<Menu.Item
					disabled={!taskIsOpen(manifest.appId)}
					leftSection={
						<IconX
							width={16}
							height={16}
						/>
					}
					onClick={() => closeTask(manifest.appId)}
					color={'red'}>
					Cerrar
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	)
})

export default function Taskbar() {
	const { taskIsOpen } = useTasks()

	const manifests = useManifests()

	/* const icons: TypeAppManifest[] = [
		{
			appId: 'applications-opener',
			name: 'Aplicaciones',
			icon: IconApps,
			onClick: () => {
				toggleAppIsVisible('applications')
			},
			onRightClickContent: (
				<>
					<Menu.Item
						disabled={!taskIsOpen('applications')}
						leftSection={
							<IconX
								width={16}
								height={16}
							/>
						}
						onClick={() => closeTask('applications')}
						color={'red'}>
						Cerrar
					</Menu.Item>
				</>
			),
			alwaysInTaskbar: true,
		},
		{
			appId: 'cv',
			name: 'Mi CV',
			icon: IconFileCv,
			onClick: () => {
				toggleAppIsVisible('cv')
			},
			onRightClickContent: (
				<>
					<Menu.Item
						disabled={!taskIsOpen('cv')}
						leftSection={
							<IconX
								width={16}
								height={16}
							/>
						}
						onClick={() => closeTask('cv')}
						color={'red'}>
						Cerrar
					</Menu.Item>
				</>
			),
			alwaysInTaskbar: true,
		},
		{
			appId: 'portfolio',
			name: 'Proyectos',
			icon: IconBriefcase,
			onClick: () => {
				toggleAppIsVisible('portfolio')
			},
			onRightClickContent: (
				<>
					<Menu.Item
						disabled={!taskIsOpen('portfolio')}
						leftSection={
							<IconX
								width={16}
								height={16}
							/>
						}
						onClick={() => closeTask('portfolio')}
						color={'red'}>
						Cerrar
					</Menu.Item>
				</>
			),
			alwaysInTaskbar: true,
		},
	] */

	const performance = usePerformanceSettings()

	return (
		<Center
			p={'md'}
			pos={'absolute'}
			bottom={0}
			left={0}
			right={0}
			style={{
				zIndex: 2,
				pointerEvents: 'none',
			}}>
			<Transition
				mounted={!taskIsOpen('launcher')}
				transition={'slide-up'}
				duration={performance.animations ? undefined : 0}>
				{(styles) => (
					<Box style={styles}>
						<Paper
							style={{
								pointerEvents: 'auto',
							}}
							radius={8}
							bg={'dark.9'}
							p={'xs'}>
							<Group gap={10}>
								{/* appId "launcher" goes first, then, the rest of apps, sorted by appId */}
								{manifests
									.sort((a, b) => {
										if (a.appId === 'launcher') return -1
										if (b.appId === 'launcher') return 1
										return 0
									})
									.map((props) => (
										<Fragment key={`taskbar-item-${props.appId}`}>
											<Transition
												transition={'pop'}
												duration={performance.animations ? undefined : 0}
												mounted={
													props.alwaysInTaskbar || taskIsOpen(props.appId)
												}>
												{(styles) => (
													<Box style={styles}>
														<IconItem
															key={`taskbar-item-${props.appId}`}
															{...props}
														/>
													</Box>
												)}
											</Transition>
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
