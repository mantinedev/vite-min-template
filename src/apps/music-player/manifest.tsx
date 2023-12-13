import { IconMusic } from '@tabler/icons-react'
import { TypeAppManifest } from '../taskbar'

const manifest: TypeAppManifest = {
	appId: 'music-player',
	name: 'Reproductor de música',
	icon: IconMusic,
	soon: !import.meta.env.DEV,
}

export default manifest
