import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Box, Center, Loader, ScrollArea, TypographyStylesProvider } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import ReactMarkdown from 'markdown-to-jsx'
import { createElement, useMemo } from 'react'
import { Window } from '../../components/window'
import cv_kevin_zaracho_md from './cv_kevin_zaracho.md?url'
import manifest from './manifest'

export default function CV() {
	return (
		<>
			<Window manifest={manifest}>
				<Content />
			</Window>
		</>
	)
}

function Content() {
	const time = useMemo(() => {
		return Date.now()
	}, [])

	const query = useQuery({
		queryKey: ['cv', time],
		queryFn: async () => {
			return await axios({
				url: cv_kevin_zaracho_md,
			})
		},
	})

	const [parentRef] = useAutoAnimate()

	return (
		<>
			<Box
				h={'100%'}
				about={'content'}
				ref={parentRef}>
				{query.isSuccess && query.data.data ? (
					<ScrollArea h={'100%'}>
						<TypographyStylesProvider
							p={'md'}
							style={{ userSelect: 'text' }}>
							<ReactMarkdown
								options={{
									createElement: (tag, props, ...children) => {
										if (tag === 'a') {
											return (
												<a
													{...props}
													target={'_blank'}
													rel={'noreferrer'}
													children={children}
												/>
											)
										}
										if (tag === 'h1') {
											return (
												<h1
													{...props}
													style={{
														marginTop: 0,
													}}
													children={children}
												/>
											)
										}
										return createElement(tag, props, ...children)
									},
								}}>
								{query.data.data}
							</ReactMarkdown>
						</TypographyStylesProvider>
					</ScrollArea>
				) : null}
				{!query.isSuccess ? (
					<Center
						display={'grid'}
						mih={'100%'}>
						<Loader />
					</Center>
				) : null}
			</Box>
		</>
	)
}
