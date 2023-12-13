import { IconUser } from '@tabler/icons-react'
import { TypeAppManifest } from '../taskbar'
import Menu from './menu'

const manifest: TypeAppManifest = {
	appId: 'cv',
	icon: IconUser,
	name: 'CV',
	alwaysInTaskbar: true,
	defaultSize: {
		width: 520,
		height: 568,
	},
	menuContent: <Menu />,
}

export default manifest
