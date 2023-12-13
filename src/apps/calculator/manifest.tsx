import { IconCalculator } from '@tabler/icons-react'
import { TypeAppManifest } from '../taskbar'

const manifest: TypeAppManifest = {
	appId: 'calculator',
	name: 'Calculadora',
	icon: IconCalculator,
	canMinimize: true,
	canMaximize: false,
	dev: true,
	defaultSize: {
		width: 300,
		height: 380,
	},
	minSize: {
		width: 300,
		height: 380,
	},
}

export default manifest
