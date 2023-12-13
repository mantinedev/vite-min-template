import { IconQrcode } from '@tabler/icons-react'
import { TypeAppManifest } from '../taskbar'

const manifest: TypeAppManifest = {
	appId: 'qr-generator',
	name: 'Generador de QR',
	icon: IconQrcode,
	soon: !import.meta.env.DEV,
}

export default manifest
