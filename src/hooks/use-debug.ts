import { useEffect, useState } from 'react'

let informed = false

export default function useDebug() {
	const [debug, setDebug] = useState(false)

	useEffect(() => {
		const root = document.getElementById('root')
		if (!root) return

		debug && !root.classList.contains('debug') && root.classList.add('debug')
		!debug && root.classList.contains('debug') && root.classList.remove('debug')
	}, [debug])

	useEffect(() => {
		const handleDebug = (e: KeyboardEvent) => {
			const shift = e.shiftKey
			if (!shift) return
			const keyD = e.key === 'd' || e.key === 'D'
			if (!keyD) return
			const newValue = !debug
			setDebug(newValue)
		}
		window.addEventListener('keydown', handleDebug)

		return () => {
			window.removeEventListener('keydown', handleDebug)
		}
	}, [debug])

	useEffect(() => {
		if (!informed) {
			informed = true
			console.info(
				'Presioná las teclas [ Shift + D ] para ver el contorno de todos los elementos.',
			)
		}
	}, [])

	return debug
}
