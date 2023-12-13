import { ReactNode } from 'react'
import { TypeAppManifest } from '../apps/taskbar'
import { WindowResizable } from './window-resizable'
import { WindowManager } from './window-manager'
import { WindowTopbar } from './window-topbar'

export function Window({
	children,
	manifest,
}: {
	children: ReactNode
	manifest: TypeAppManifest
}) {
	return (
		<WindowManager manifest={manifest}>
			<WindowResizable
				manifest={manifest}
				childrenTopbar={<WindowTopbar manifest={manifest} />}>
				{children}
			</WindowResizable>
		</WindowManager>
	)
}
