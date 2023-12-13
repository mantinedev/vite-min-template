import '@mantine/carousel/styles.css'
import '@mantine/code-highlight/styles.css'
import { AppShell, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/dropzone/styles.css'
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css'
import '@mantine/nprogress/styles.css'
import '@mantine/spotlight/styles.css'
import '@mantine/tiptap/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { HashRouter } from 'react-router-dom'
import { Apps } from './apps'
import useDebug from './hooks/use-debug'
import './styles/global.css'
import { useTheme } from './styles/theme'

const queryClient = new QueryClient()

export default function Providers() {
	// eslint-disable-next-line react-hooks/rules-of-hooks -- Está bien :)
	import.meta.env.DEV && useDebug()

	const theme = useTheme()

	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider
				/* defaultColorScheme={'auto'} */
				forceColorScheme={'dark'}
				theme={theme}>
				{createElement(HashRouter /* import.meta.env.DEV ? HashRouter : MemoryRouter */, {
					children: (
						<AppShell>
							<AppShell.Main
								display={'grid'}
								pos={'relative'}
								style={{
									overflow: 'hidden',
								}}>
								<Apps />
							</AppShell.Main>
						</AppShell>
					),
				})}
				<Notifications />
			</MantineProvider>
		</QueryClientProvider>
	)
}
