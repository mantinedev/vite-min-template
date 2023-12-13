import { useEffect, useState } from 'react'
import { TypeAppManifest } from '../apps/taskbar'

export function useManifests() {
	const [manifests, setManifests] = useState<TypeAppManifest[]>([]) // Usa la interfaz definida

	useEffect(() => {
		const appsWithManifest = import.meta.glob('../apps/**/manifest.tsx')
		const promises = Object.keys(appsWithManifest).map((key) => appsWithManifest[key]())

		Promise.all(promises)
			.then((modules) => {
				const typedModules = modules.map(
					(module) => (module as { default: TypeAppManifest }).default,
				)
				setManifests(typedModules)
			})
			.catch((error) => {
				console.error('Error al importar las apps:', error)
			})
	}, [])

	return manifests
}
