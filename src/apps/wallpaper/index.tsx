import { Box, Center, Flex, Image, Loader, Title, Transition } from '@mantine/core'
import { IconPhotoOff } from '@tabler/icons-react'
import { name, version } from '../../../package.json'
import { useTasks } from '../../hooks/use-tasks'
import { useWallpaperDownloader } from './use-wallpaper-downloader'
import { usePerformanceSettings } from '../../hooks/use-effects'

export default function Wallpaper() {
	const wallpaper = useWallpaperDownloader()
	const { taskIsOpen } = useTasks()
	const performance = usePerformanceSettings()

	return (
		<>
			<Box
				pos={'absolute'}
				style={{
					userSelect: 'none',
					zIndex: 0,
				}}
				top={0}
				right={0}
				bottom={0}
				left={0}>
				<Transition
					mounted={wallpaper.isSuccess && Boolean(wallpaper.data)}
					duration={performance.animations ? undefined : 0}>
					{(styles) => (
						<>
							<Box
								style={styles}
								w={'100%'}
								h={'100%'}>
								<Image
									pos={'absolute'}
									bgp={'center'}
									bgr={'no-repeat'}
									bgsz={'cover'}
									src={wallpaper.data}
									style={{
										filter: taskIsOpen('launcher') ? 'brightness(50%)' : 'none',
										transition: performance.animations
											? 'filter 0.250s'
											: 'none',
									}}
									alt={''}
									w={'100%'}
									h={'100%'}
								/>
								{performance.transparency ? (
									<Transition
										mounted={taskIsOpen('launcher')}
										duration={performance.animations ? undefined : 0}>
										{(styles) => (
											<>
												<Image
													pos={'absolute'}
													bgp={'center'}
													bgr={'no-repeat'}
													bgsz={'cover'}
													src={wallpaper.data}
													alt={''}
													w={'100%'}
													h={'100%'}
													style={{
														...styles,
														filter: 'blur(1em) brightness(50%)',
														transform: 'scale(1.1)',
													}}
												/>
												<Image
													pos={'absolute'}
													bgp={'center'}
													bgr={'no-repeat'}
													bgsz={'cover'}
													src={wallpaper.data}
													alt={''}
													w={'100%'}
													h={'100%'}
													style={{
														...styles,
														filter: 'blur(1em) brightness(50%)',
													}}
												/>
											</>
										)}
									</Transition>
								) : null}
							</Box>
							<Flex
								p={'xl'}
								justify={'flex-end'}
								align={'flex-end'}
								pos={'absolute'}
								style={styles}
								top={0}
								right={0}
								bottom={0}
								left={0}
								w={'100%'}
								h={'100%'}>
								<Title
									opacity={0.25}
									order={6}
									m={0}
									p={0}>
									{name} {version}
								</Title>
							</Flex>
						</>
					)}
				</Transition>
				<Transition
					mounted={wallpaper.isPending}
					duration={performance.animations ? undefined : 0}>
					{(styles) => (
						<Center
							style={styles}
							w={'100%'}
							h={'100%'}>
							<Loader color={'dark.5'} />
						</Center>
					)}
				</Transition>
				<Transition
					mounted={wallpaper.isError}
					duration={performance.animations ? undefined : 0}>
					{(styles) => (
						<Center
							style={styles}
							w={'100%'}
							h={'100%'}>
							<IconPhotoOff />
						</Center>
					)}
				</Transition>
			</Box>
		</>
	)
}
