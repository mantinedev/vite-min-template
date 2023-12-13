import { IconSettings } from '@tabler/icons-react'
import { TypeAppManifest } from '../taskbar'

const manifest: TypeAppManifest = {
	appId: 'settings',
	name: 'Configuración',
	icon: IconSettings,
	canMinimize: true,
	dev: true,
	defaultSize: {
		width: 715,
		height: 500,
	},
	minSize: { width: 715, height: 500 },
	onCloseClearParams: [
		{
			key: 'settings-tab',
		},
	],
}

export default manifest
