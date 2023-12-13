import { Menu } from '@mantine/core'
import { IconDownload } from '@tabler/icons-react'
import cv_kevin_zaracho_pdf from './cv_kevin_zaracho.pdf?url'
import axios from 'axios'

export default function MenuCV() {
	const download = async () => {
		axios({
			url: cv_kevin_zaracho_pdf,
			method: 'GET',
			responseType: 'blob', // important
		}).then((response) => {
			const url = window.URL.createObjectURL(new Blob([response.data]))
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', 'cv_kevin_zaracho.pdf')
			document.body.appendChild(link)
			link.click()
		})
	}

	return (
		<>
			<Menu.Item
				onClick={download}
				leftSection={<IconDownload size={16} />}>
				Descargar CV en .PDF
			</Menu.Item>
		</>
	)
}
