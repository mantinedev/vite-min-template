import { Center, Loader } from '@mantine/core'
import { ReactElement, useEffect, useState } from 'react'

interface AppComponent {
	default: () => ReactElement // Define la forma del componente esperado
}

export function Apps() {
	const [apps, setApps] = useState<AppComponent[]>([]) // Usa la interfaz definida

	useEffect(() => {
		const importApps = import.meta.glob('./apps/**/index.tsx')
		const promises = Object.keys(importApps).map((key) => importApps[key]())

		Promise.all(promises)
			.then((modules) => {
				const typedModules = modules.map((module) => module as AppComponent)
				setApps(typedModules)
			})
			.catch((error) => {
				console.error('Error al importar las apps:', error)
			})
	}, [])

	return (
		<>
			{apps.length === 0 ? (
				<Center h={'100%'}>
					<Loader color={'dark.5'} />
				</Center>
			) : null}
			{apps.length !== 0 ? apps.map((App, index) => <App.default key={index} />) : null}
		</>
	)
}
