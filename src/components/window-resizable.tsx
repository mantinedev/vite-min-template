import { Box, Paper, Transition, rgba, useMantineTheme } from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import { ReactNode, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { TypeAppManifest } from '../apps/taskbar'
import { usePerformanceSettings } from '../hooks/use-effects'
import useIsMobile from '../hooks/use-is-mobile'
import { useTasks } from '../hooks/use-tasks'
import { BackgroundNoise } from './noise'

const minWindowSizeWidthDefault = 300
const minWindowSizeHeightDefault = 300

export function WindowResizable({
	children,
	childrenTopbar,
	manifest,
}: {
	children?: ReactNode
	childrenTopbar?: ReactNode
	manifest: TypeAppManifest
}) {
	const isMobile = useIsMobile()

	const { taskIsMaximized, toggleAppMaximized, taskIsFocused, toggleAppIsVisible } = useTasks()

	const minWindowSizeWidth = useMemo(() => {
		return manifest.minSize?.width || minWindowSizeWidthDefault
	}, [manifest.minSize?.width])
	const minWindowSizeHeight = useMemo(() => {
		return manifest.minSize?.height || minWindowSizeHeightDefault
	}, [manifest.minSize?.height])

	const defaultSizeWidth = useMemo(() => {
		return manifest.defaultSize?.width || minWindowSizeWidth
	}, [manifest.defaultSize?.width, minWindowSizeWidth])
	const defaultSizeHeight = useMemo(() => {
		return manifest.defaultSize?.height || minWindowSizeHeight
	}, [manifest.defaultSize?.height, minWindowSizeHeight])

	const { ref: parentRef, width, height } = useElementSize()

	const [rect, setRect] = useState<{
		left: number
		top: number
		width: number
		height: number
	} | null>(null)

	useEffect(() => {
		if (width && height && !rect) {
			setRect({
				left: width / 2 - defaultSizeWidth / 2,
				top: height / 2 - defaultSizeHeight / 2,
				width: defaultSizeWidth,
				height: defaultSizeHeight,
			})
		}
	}, [defaultSizeHeight, defaultSizeWidth, height, rect, width])

	const [mouse, setMouse] = useState({
		x: 0,
		y: 0,
	})

	type TypeDragging =
		| 'topbar'
		| 'left'
		| 'leftTop'
		| 'top'
		| 'topRight'
		| 'right'
		| 'rightBottom'
		| 'bottom'
		| 'bottomLeft'

	const [dragging, setDragging] = useState({
		topbar: false,
		left: false,
		leftTop: false,
		top: false,
		topRight: false,
		right: false,
		rightBottom: false,
		bottom: false,
		bottomLeft: false,
	})

	const handleMouseAction = (type: TypeDragging, action: 'down' | 'up') => {
		const result = {
			...(type === 'topbar' && { topbar: action === 'down' }),
			...(type === 'left' && { left: action === 'down' }),
			...(type === 'top' && { top: action === 'down' }),
			...(type === 'right' && { right: action === 'down' }),
			...(type === 'bottom' && { bottom: action === 'down' }),
			...(type === 'leftTop' && { leftTop: action === 'down' }),
			...(type === 'topRight' && { topRight: action === 'down' }),
			...(type === 'rightBottom' && { rightBottom: action === 'down' }),
			...(type === 'bottomLeft' && { bottomLeft: action === 'down' }),
		}
		return result
	}

	const onPointerDown = (type: TypeDragging, event: React.PointerEvent) => {
		//
		const target = event.target as HTMLDivElement
		target.setPointerCapture(event.pointerId)
		setMouse({ x: event.clientX, y: event.clientY })
		setDragging({ ...dragging, ...handleMouseAction(type, 'down') })
	}

	const updateMouse = (event: React.PointerEvent) => {
		setMouse({ x: event.clientX, y: event.clientY })
	}

	const isMaximized = useMemo(() => {
		return isMobile || taskIsMaximized(manifest.appId)
	}, [isMobile, manifest.appId, taskIsMaximized])

	const onPointerMove = (event: React.PointerEvent) => {
		//
		const target = event.target as HTMLDivElement
		target.setPointerCapture(event.pointerId)

		if (Object.values(dragging).every((value) => value === false)) return

		const dx = event.clientX - mouse.x
		const dy = event.clientY - mouse.y

		let toUpdate = {}

		if (rect) {
			if (dragging.topbar) {
				toUpdate = { ...toUpdate, left: rect.left + dx, top: rect.top + dy }
			}
			if (dragging.left || dragging.leftTop || dragging.bottomLeft) {
				toUpdate = { ...toUpdate, left: rect.left + dx, width: rect.width - dx }
			}
			if (dragging.top || dragging.leftTop || dragging.topRight) {
				toUpdate = { ...toUpdate, top: rect.top + dy, height: rect.height - dy }
			}
			if (dragging.right || dragging.topRight || dragging.rightBottom) {
				toUpdate = { ...toUpdate, width: rect.width + dx }
			}
			if (dragging.bottom || dragging.rightBottom || dragging.bottomLeft) {
				toUpdate = { ...toUpdate, height: rect.height + dy }
			}
		}

		if (Object.keys(toUpdate).length > 0) {
			const parentRect = {
				width: width,
				height: height,
			} as DOMRect

			if (isMaximized) return

			if (rect) {
				if (dragging.topbar) {
					if ('left' in toUpdate) {
						if ((toUpdate.left as number) < 0) {
							toUpdate.left = 0
						}
						if ((toUpdate.left as number) + rect.width > 0 + parentRect.width) {
							toUpdate.left = parentRect.width - rect.width
						}
					}
					if ('top' in toUpdate) {
						if ((toUpdate.top as number) < 0) {
							toUpdate.top = 0
						}
						if ((toUpdate.top as number) + rect.height > 0 + parentRect.height) {
							toUpdate.top = parentRect.height - rect.height
						}
					}
				} else {
					if ('left' in toUpdate) {
						if ((toUpdate.left as number) < 0) {
							toUpdate.left = 0
							if ('width' in toUpdate) {
								delete toUpdate.width
							}
						}
						if ((toUpdate.left as number) + rect.width > 0 + parentRect.width) {
							toUpdate.left = parentRect.width - rect.width
						}
					}
					if ('top' in toUpdate) {
						if ((toUpdate.top as number) < 0) {
							toUpdate.top = 0
							if ('height' in toUpdate) {
								delete toUpdate.height
							}
						}
						if ((toUpdate.top as number) + rect.height > 0 + parentRect.height) {
							toUpdate.top = parentRect.height - rect.height
						}
					}
					if ('width' in toUpdate) {
						if ((toUpdate.width as number) + rect.left > parentRect.width) {
							delete toUpdate.width
						}
						if ((toUpdate.width as number) < minWindowSizeWidth) {
							delete toUpdate.width
							if ('left' in toUpdate) delete toUpdate.left
						}
					}
					if ('height' in toUpdate) {
						if ((toUpdate.height as number) + rect.top > parentRect.height) {
							delete toUpdate.height
						}
						if ((toUpdate.height as number) < minWindowSizeHeight) {
							delete toUpdate.height
							if ('top' in toUpdate) delete toUpdate.top
						}
					}
				}

				setRect({ ...rect, ...toUpdate })
			}

			updateMouse(event)
		}
	}

	const onPointerUp = (type: TypeDragging, event: React.PointerEvent) => {
		//
		const target = event.target as HTMLDivElement
		target.releasePointerCapture(event.pointerId)
		setDragging({ ...dragging, ...handleMouseAction(type, 'up') })
	}

	const [enableTransition, setEnableTransition] = useState(false)

	useLayoutEffect(() => {
		setEnableTransition(true)

		const timer = setTimeout(() => {
			setEnableTransition(false)
		}, 300)

		return () => {
			clearTimeout(timer)
		}
	}, [isMaximized])

	const theme = useMantineTheme()

	const performance = usePerformanceSettings()

	return (
		<Box
			pos={'relative'}
			w={'100%'}
			h={'100%'}
			ref={parentRef}>
			{rect ? (
				<Box
					pos={'relative'}
					style={{
						...(isMaximized
							? { left: '0', top: '0', width: '100%', height: '100%' }
							: {
									left: rect.left,
									top: rect.top,
									width: rect.width,
									height: rect.height,
							  }),
						pointerEvents: 'none',
						transition:
							performance.animations && enableTransition
								? 'left 0.2s ease, top 0.2s ease, width 0.2s ease, height 0.2s ease'
								: 'none',
					}}>
					<Paper
						onMouseDown={() => {
							if (!taskIsFocused(manifest.appId)) {
								toggleAppIsVisible(manifest.appId)
							}
						}}
						pos={'absolute'}
						bg={performance.transparency ? rgba(theme.colors.dark[8], 0.9) : 'dark.8'}
						radius={'md'}
						style={{
							outlineStyle: 'solid',
							outlineWidth: '0.075em',
							outlineColor: taskIsFocused(manifest.appId)
								? theme.colors.dark[5]
								: 'transparent',
							transition: performance.animations ? 'all 0.2s ease' : 'none',
							backdropFilter: performance.transparency ? 'blur(0.5em)' : 'none',
							overflow: 'hidden',
							boxShadow: taskIsFocused(manifest.appId)
								? '0 0.25em 0.75em 0.5em rgba(0,0,0,0.25)'
								: 'none',
						}}
						/* shadow={taskIsFocused(manifest.appId) ? 'lg' : 'none'} */
						h={'100%'}
						w={'100%'}
						display={'grid'}
						left={0}
						top={0}
						right={0}
						bottom={0}>
						<Transition
							mounted={performance.transparency}
							duration={performance.animations ? undefined : 0}>
							{(styles) => (
								<Box
									/* noise */
									style={{
										...styles,
										pointerEvents: 'none',
									}}
									pos={'absolute'}
									left={0}
									top={0}
									right={0}
									bottom={0}>
									<BackgroundNoise />
								</Box>
							)}
						</Transition>

						<Box
							onPointerMove={onPointerMove}
							onPointerDown={(event) => {
								onPointerDown('left', event)
							}}
							onPointerUp={(event) => {
								onPointerUp('left', event)
							}}
							/* left resizer */
							style={{
								pointerEvents: 'auto',
								cursor: 'e-resize',
							}}
							pos={'absolute'}
							left={'-0.25em'}
							top={0}
							w={'0.5em'}
							bottom={0}
						/>
						<Box
							onPointerMove={onPointerMove}
							onPointerDown={(event) => {
								onPointerDown('right', event)
							}}
							onPointerUp={(event) => {
								onPointerUp('right', event)
							}}
							/* right resizer */
							style={{
								pointerEvents: 'auto',
								cursor: 'w-resize',
							}}
							pos={'absolute'}
							right={'-0.25em'}
							top={0}
							w={'0.5em'}
							bottom={0}
						/>
						<Box
							onPointerMove={onPointerMove}
							onPointerDown={(event) => {
								onPointerDown('top', event)
							}}
							onPointerUp={(event) => {
								onPointerUp('top', event)
							}}
							/* top resizer */
							style={{
								pointerEvents: 'auto',
								cursor: 'n-resize',
							}}
							pos={'absolute'}
							top={'-0.25em'}
							left={0}
							h={'0.5em'}
							right={0}
						/>
						<Box
							onPointerMove={onPointerMove}
							onPointerDown={(event) => {
								onPointerDown('bottom', event)
							}}
							onPointerUp={(event) => {
								onPointerUp('bottom', event)
							}}
							/* bottom resizer */
							style={{
								pointerEvents: 'auto',
								cursor: 'n-resize',
							}}
							pos={'absolute'}
							bottom={'-0.25em'}
							left={0}
							h={'0.5em'}
							right={0}
						/>
						<Box
							onPointerMove={onPointerMove}
							onPointerDown={(event) => {
								onPointerDown('leftTop', event)
							}}
							onPointerUp={(event) => {
								onPointerUp('leftTop', event)
							}}
							/* top left resizer */
							style={{
								pointerEvents: 'auto',
								cursor: 'nw-resize',
							}}
							pos={'absolute'}
							left={'-0.25em'}
							top={'-0.25em'}
							w={'0.5em'}
							h={'0.5em'}
						/>
						<Box
							onPointerMove={onPointerMove}
							onPointerDown={(event) => {
								onPointerDown('topRight', event)
							}}
							onPointerUp={(event) => {
								onPointerUp('topRight', event)
							}}
							/* top right resizer */
							style={{
								pointerEvents: 'auto',
								cursor: 'ne-resize',
							}}
							pos={'absolute'}
							right={'-0.25em'}
							top={'-0.25em'}
							w={'0.5em'}
							h={'0.5em'}
						/>
						<Box
							onPointerMove={onPointerMove}
							onPointerDown={(event) => {
								onPointerDown('rightBottom', event)
							}}
							onPointerUp={(event) => {
								onPointerUp('rightBottom', event)
							}}
							/* bottom right resizer */
							style={{
								pointerEvents: 'auto',
								cursor: 'se-resize',
							}}
							pos={'absolute'}
							right={'-0.25em'}
							bottom={'-0.25em'}
							w={'0.5em'}
							h={'0.5em'}
						/>
						<Box
							onPointerMove={onPointerMove}
							onPointerDown={(event) => {
								onPointerDown('bottomLeft', event)
							}}
							onPointerUp={(event) => {
								onPointerUp('bottomLeft', event)
							}}
							/* bottom left resizer */
							style={{
								pointerEvents: 'auto',
								cursor: 'sw-resize',
							}}
							pos={'absolute'}
							left={'-0.25em'}
							bottom={'-0.25em'}
							w={'0.5em'}
							h={'0.5em'}
						/>
						<Box
							pos={'absolute'}
							display={'grid'}
							top={'0.25em'}
							bottom={'0.25em'}
							right={'0.25em'}
							left={'0.25em'}
							style={{
								overflow: 'hidden',
								gridTemplateRows: 'auto 1fr',
							}}>
							<Box
								onDoubleClick={(e) => {
									e.preventDefault()
									if (!isMobile && manifest.canMaximize !== false)
										toggleAppMaximized(manifest.appId)
								}}
								onPointerMove={onPointerMove}
								onPointerDown={(event) => {
									onPointerDown('topbar', event)
								}}
								onPointerUp={(event) => {
									onPointerUp('topbar', event)
								}}
								style={{
									pointerEvents: 'auto',
									cursor: !dragging.topbar ? 'grab' : 'grabbing',
									overflow: 'hidden',
								}}
								/* window topbar - moveable */
								w={'100%'}
								p={'0.5em'}>
								{childrenTopbar}
							</Box>
							<Box
								about={'window-content-parent'}
								style={{
									overflow: 'hidden',
									pointerEvents: 'auto',
								}}
								h={'100%'}
								w={'100%'}
								p={'0.5em'}>
								{children}
							</Box>
						</Box>
					</Paper>
				</Box>
			) : null}
		</Box>
	)
}
