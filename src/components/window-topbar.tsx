import {
	ActionIcon,
	Badge,
	Box,
	DefaultMantineColor,
	Flex,
	Group,
	Menu,
	Title,
	Tooltip,
	Transition,
	useMantineTheme,
} from '@mantine/core'
import {
	IconArrowDown,
	IconMenu2,
	IconWindowMaximize,
	IconWindowMinimize,
	IconX,
	TablerIconsProps,
} from '@tabler/icons-react'
import { createElement, useState } from 'react'
import { TypeAppManifest } from '../apps/taskbar'
import { usePerformanceSettings } from '../hooks/use-effects'
import useIsMobile from '../hooks/use-is-mobile'
import { useTasks } from '../hooks/use-tasks'

function ButtonWindowControl({
	onClick,
	iconVisible,
	icon,
	color,
	tooltipLabel,
	disabled = false,
}: {
	onClick: () => void
	iconVisible: boolean
	icon: (props: TablerIconsProps) => JSX.Element
	color: DefaultMantineColor
	tooltipLabel: string
	disabled?: boolean
}) {
	const theme = useMantineTheme()

	const performance = usePerformanceSettings()

	return (
		<Tooltip
			color={'dark.6'}
			label={tooltipLabel}>
			<ActionIcon
				disabled={disabled}
				onClick={(e) => {
					e.preventDefault()
					onClick()
				}}
				size={'xs'}
				radius={'100%'}
				style={{
					borderColor: theme.colors[disabled ? 'dark' : color][7],
					borderWidth: '0.1em',
				}}
				color={color}>
				<Transition
					mounted={iconVisible}
					transition={{
						in: { opacity: 1, transform: 'scale(1)' },
						out: { opacity: 0, transform: 'scale(0)' },
						common: { transformOrigin: 'center' },
						transitionProperty: 'transform, opacity',
					}}
					duration={performance.animations ? undefined : 0}>
					{(styles) => (
						<Box
							style={{ ...styles, lineHeight: 0 }}
							w={12}
							h={12}>
							{createElement(icon, {
								width: '100%',
								height: '100%',
							})}
						</Box>
					)}
				</Transition>
			</ActionIcon>
		</Tooltip>
	)
}

export function WindowTopbar({ manifest }: { manifest: TypeAppManifest }) {
	const { taskIsMaximized, toggleAppMaximized, toggleAppMinimized, closeTask } = useTasks()

	const [isHoverWindowControls, setIsHoverWindowControls] = useState(false)

	const isMobile = useIsMobile()

	return (
		<Group
			w={'100%'}
			gap={10}
			wrap={'nowrap'}
			justify={'space-between'}
			style={{ pointerEvents: 'none', overflow: 'hidden' }}>
			<Group
				wrap={'nowrap'}
				w={'100%'}
				align={'center'}
				style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
				gap={'xs'}>
				{manifest.menuContent ? (
					<Menu>
						<Menu.Target>
							<ActionIcon
								style={{ pointerEvents: 'auto' }}
								color={'dark.6'}
								variant={'filled'}>
								{createElement(IconMenu2, {
									width: 16,
									height: 16,
								})}
							</ActionIcon>
						</Menu.Target>
						<Menu.Dropdown>{manifest.menuContent}</Menu.Dropdown>
					</Menu>
				) : null}
				<ActionIcon
					component={'div'}
					color={'dark.6'}
					variant={'filled'}>
					{createElement(manifest.icon, {
						width: 16,
						height: 16,
					})}
				</ActionIcon>
				<Flex w={'100%'}>
					<Title
						order={6}
						w={'auto'}
						style={{
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							lineHeight: 1,
						}}>
						{manifest.name}
					</Title>
					{manifest.dev ? (
						<Badge
							ml={'xs'}
							variant={'light'}
							color={'yellow'}
							size={'xs'}>
							DEV
						</Badge>
					) : null}
				</Flex>
			</Group>
			<Group
				wrap={'nowrap'}
				onMouseEnter={() => {
					setIsHoverWindowControls(true)
				}}
				onMouseLeave={() => {
					setIsHoverWindowControls(false)
				}}
				style={{ pointerEvents: 'auto' }}
				p={isMobile ? 'xs' : undefined}
				gap={isMobile ? 'md' : 'xs'}>
				<ButtonWindowControl
					tooltipLabel={'Minimizar'}
					color={'yellow'}
					onClick={() => {
						toggleAppMinimized(manifest.appId)
					}}
					iconVisible={isHoverWindowControls}
					icon={IconArrowDown}
				/>
				{!isMobile ? (
					<ButtonWindowControl
						disabled={manifest.canMaximize === false}
						tooltipLabel={
							taskIsMaximized(manifest.appId) ? 'Restaurar tamaño' : 'Maximizar'
						}
						color={'green'}
						onClick={() => {
							toggleAppMaximized(manifest.appId)
						}}
						iconVisible={isHoverWindowControls}
						icon={
							taskIsMaximized(manifest.appId)
								? IconWindowMinimize
								: IconWindowMaximize
						}
					/>
				) : null}

				<ButtonWindowControl
					tooltipLabel={'Cerrar'}
					color={'red'}
					onClick={() => {
						closeTask(manifest.appId)
					}}
					iconVisible={isHoverWindowControls}
					icon={IconX}
				/>
			</Group>
		</Group>
	)
}
