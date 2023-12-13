import { IconFolder } from '@tabler/icons-react'
import { TypeAppManifest } from '../taskbar'

const manifest: TypeAppManifest = {
	appId: 'explorer',
	name: 'Explorador',
	icon: IconFolder,
	soon: !import.meta.env.DEV,
}

export default manifest
