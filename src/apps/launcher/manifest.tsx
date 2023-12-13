import { IconApps } from '@tabler/icons-react'
import { TypeAppManifest } from '../taskbar'

const manifest: TypeAppManifest = {
	appId: 'launcher',
	name: 'Aplicaciones',
	icon: IconApps,
	alwaysInTaskbar: true,
	alwaysOpened: true,
	canMinimize: false,
	hiddenInLauncher: true,
}

export default manifest
