import { IconMessageCircle } from '@tabler/icons-react'
import { TypeAppManifest } from '../taskbar'

const manifest: TypeAppManifest = {
	appId: 'contact',
	name: 'Contacto',
	icon: IconMessageCircle,
	soon: !import.meta.env.DEV,
}

export default manifest
