import { IconLanguage } from '@tabler/icons-react'
import { TypeAppManifest } from '../taskbar'

const manifest: TypeAppManifest = {
	appId: 'translator',
	name: 'Traductor',
	icon: IconLanguage,
	soon: !import.meta.env.DEV,
}

export default manifest
