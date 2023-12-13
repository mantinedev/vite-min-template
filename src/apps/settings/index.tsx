import {
	ActionIcon,
	AspectRatio,
	Center,
	Fieldset,
	Group,
	Image,
	List,
	Paper,
	ScrollArea,
	Stack,
	Switch,
	Tabs,
	Text,
	Tooltip,
	UnstyledButton,
	rem,
	useMantineTheme,
} from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import {
	IconBrandSpeedtest,
	IconBrush,
	IconCheck,
	IconHome,
	IconInfoCircle,
	IconMoon,
	IconSun,
} from '@tabler/icons-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import packageInfo from '../../../package.json'
import { Window } from '../../components/window'
import { usePerformanceSettings } from '../../hooks/use-effects'
import { useMainColor } from '../../hooks/use-main-color'
import { useWallpaper } from '../wallpaper/use-wallpaper'
import manifest from './manifest'

export default function Settings() {
	return (
		<Window manifest={manifest}>
			<Content />
		</Window>
	)
}

function Content() {
	const iconStyle = { width: rem(16), height: rem(16) }

	const [searchParams, setSearchParams] = useSearchParams()

	type TypeTab = 'home' | 'theme' | 'performance' | 'information'

	const parentSize = useElementSize()

	const tabNamesVisible = useMemo(() => {
		return parentSize.width >= 480
	}, [parentSize.width])

	const theme = useMantineTheme()

	const { mainColorTheme, setMainColorTheme } = useMainColor()

	const { wallpapers, setWallpaper } = useWallpaper()

	const sunIcon = (
		<IconSun
			style={{ width: rem(16), height: rem(16) }}
			stroke={2.5}
			color={theme.colors.yellow[4]}
		/>
	)

	const moonIcon = (
		<IconMoon
			style={{ width: rem(16), height: rem(16) }}
			stroke={2.5}
			color={theme.colors.blue[6]}
		/>
	)

	const performance = usePerformanceSettings()

	const [loadImages, setLoadImages] = useState(false)

	useEffect(() => {
		setLoadImages(true)
	}, [])

	return (
		<Tabs
			h={'100%'}
			ref={parentSize.ref}
			orientation={'vertical'}
			value={(searchParams.get('settings-tab') as TypeTab) || 'theme'}
			onChange={(value) => {
				const newValue = value as TypeTab
				if (newValue === 'home') {
					searchParams.delete('settings-tab')
				} else {
					searchParams.set('settings-tab', newValue)
				}
				setSearchParams(searchParams)
			}}>
			{parentSize.width > 0 && parentSize.height > 0 ? (
				<>
					<Tabs.List>
						<Tabs.Tab
							disabled
							w={'100%'}
							h={'3em'}
							value={'home'}
							leftSection={<IconHome style={iconStyle} />}
							children={tabNamesVisible ? 'Inicio' : undefined}
						/>
						<Tabs.Tab
							w={'100%'}
							h={'3em'}
							value={'theme'}
							leftSection={<IconBrush style={iconStyle} />}
							children={tabNamesVisible ? 'Personalización' : undefined}
						/>
						<Tabs.Tab
							w={'100%'}
							h={'3em'}
							value={'performance'}
							leftSection={<IconBrandSpeedtest style={iconStyle} />}
							children={tabNamesVisible ? 'Rendimiento' : undefined}
						/>
						<Tabs.Tab
							w={'100%'}
							h={'3em'}
							value={'information'}
							leftSection={<IconInfoCircle style={iconStyle} />}
							children={tabNamesVisible ? 'Información' : undefined}
						/>
					</Tabs.List>

					<Tabs.Panel
						h={'100%'}
						value={'home'}>
						<ScrollArea
							h={'100%'}
							type={'always'}
							p={'lg'}
							pt={0}>
							<Text>TODO</Text>
						</ScrollArea>
					</Tabs.Panel>

					<Tabs.Panel
						h={'100%'}
						value={'theme'}>
						<ScrollArea
							h={'100%'}
							p={'lg'}
							py={0}>
							<Stack>
								<Fieldset
									legend={'Modo'}
									disabled>
									<Switch
										checked={false}
										size={'xl'}
										color={'dark.4'}
										onLabel={sunIcon}
										offLabel={moonIcon}
									/>
								</Fieldset>
								<Fieldset legend={'Color principal'}>
									<Group gap={'xs'}>
										{Object.keys(theme.colors)
											.filter((color) => color !== 'dark')
											.filter((color) => color !== 'gray')
											.map((color) => {
												return (
													<Tooltip
														color={'dark.6'}
														key={`color-select-${color}`}
														label={color}>
														<ActionIcon
															onClick={() => {
																setMainColorTheme(color)
															}}
															variant={'filled'}
															radius={'xl'}
															color={color}>
															{mainColorTheme === color && (
																<IconCheck
																	size={16}
																	strokeWidth={3}
																/>
															)}
														</ActionIcon>
													</Tooltip>
												)
											})}
									</Group>
								</Fieldset>
								<Fieldset legend={'Fondo de pantalla'}>
									<Group
										h={'auto'}
										w={'auto'}
										gap={'xs'}>
										{wallpapers.map((currentWallpaper) => {
											return (
												<AspectRatio
													key={currentWallpaper.id}
													ratio={16 / 11}
													w={'100%'}
													h={'auto'}
													maw={200}>
													<Tooltip
														color={'dark.6'}
														label={currentWallpaper.name}>
														<UnstyledButton
															onClick={() => {
																setWallpaper(currentWallpaper.id)
															}}
															w={'100%'}
															h={'100%'}>
															<Paper
																w={'100%'}
																h={'100%'}
																style={{
																	overflow: 'hidden',
																}}
																withBorder>
																{loadImages ? (
																	<Image
																		w={'100%'}
																		h={'100%'}
																		fit={'cover'}
																		src={
																			currentWallpaper.url_preview
																		}
																	/>
																) : null}
															</Paper>
														</UnstyledButton>
													</Tooltip>
												</AspectRatio>
											)
										})}
									</Group>
								</Fieldset>
							</Stack>
						</ScrollArea>
					</Tabs.Panel>

					<Tabs.Panel
						h={'100%'}
						value={'performance'}>
						<ScrollArea
							h={'100%'}
							p={'lg'}
							py={0}>
							<Stack>
								<Fieldset legend={'Efectos'}>
									<Stack>
										<Switch
											onChange={(event) =>
												performance.setTransparency(
													event.currentTarget.checked,
												)
											}
											checked={performance.transparency}
											label={'Transparencia'}
											description={
												'Activa o desactiva la transparencia en ciertas partes de la interfaz.'
											}
										/>
										<Switch
											onChange={(event) =>
												performance.setAnimations(
													event.currentTarget.checked,
												)
											}
											checked={performance.animations}
											label={'Animaciones'}
											description={
												'Activa o desactiva la animación de ciertas partes de la interfaz.'
											}
										/>
									</Stack>
								</Fieldset>
							</Stack>
						</ScrollArea>
					</Tabs.Panel>
					<Tabs.Panel
						style={{
							userSelect: 'text',
						}}
						h={'100%'}
						value={'information'}>
						<ScrollArea
							h={'100%'}
							p={'lg'}
							py={0}>
							<Stack>
								<Fieldset>
									<Center
										w={'100%'}
										style={{
											overflow: 'hidden',
										}}>
										<Stack
											align={'center'}
											gap={0}
											style={{
												whiteSpace: 'nowrap',
											}}
											w={'min-content'}>
											<Text
												size={'2.5em'}
												fw={700}
												variant={'gradient'}
												gradient={{ from: 'blue', to: 'cyan', deg: 90 }}>
												{packageInfo.name}
											</Text>
											<Text
												size={'2em'}
												fw={700}
												variant={'gradient'}
												gradient={{ from: 'red', to: 'orange', deg: 90 }}>
												{packageInfo.version}
											</Text>
										</Stack>
									</Center>
								</Fieldset>

								<Fieldset legend={'Autor'}>
									{/* list of packageInfo.author */}
									{packageInfo.author
										? Object.entries(packageInfo.author).map(([key, value]) => {
												return <Text key={key}>{value}</Text>
										  })
										: null}
								</Fieldset>

								<Fieldset legend={'Dependencias (Open Source)'}>
									<List type={'ordered'}>
										{Object.keys({
											...packageInfo.dependencies,
											...packageInfo.devDependencies,
										}).map((dependency) => {
											return (
												<List.Item key={dependency}>
													<UnstyledButton
														component={'a'}
														href={`https://www.npmjs.com/package/${dependency}`}
														target={'_blank'}
														rel={'noreferrer'}>
														{dependency}
													</UnstyledButton>
												</List.Item>
											)
										})}
									</List>
								</Fieldset>
							</Stack>
						</ScrollArea>
					</Tabs.Panel>
				</>
			) : null}
		</Tabs>
	)
}
