import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import { useWallpaper } from './use-wallpaper'

export function useWallpaperDownloader() {
	const { wallpaper: wallpaperSaved } = useWallpaper()

	const files = useLiveQuery(
		() => db.files.filter((f) => f.path.startsWith('/assets/wallpapers/')).toArray(),
		[wallpaperSaved.url],
	)

	const wallpaper = useQuery({
		queryKey: ['wallpaper', wallpaperSaved.url, files],
		queryFn: async () => {
			try {
				const fileSaved = files?.find(
					(f) => f.path === `/assets/wallpapers/default-${wallpaperSaved.id}.jpg`,
				)
				if (fileSaved) {
					// file is in storage, return
					const url = URL.createObjectURL(fileSaved.content as Blob)
					return url
				} else {
					// download file, save to storage and return
					const response = await axios({
						url: wallpaperSaved.url,
						method: 'GET',
						responseType: 'blob',
					})
					await db.files.put({
						path: `/assets/wallpapers/default-${wallpaperSaved.id}.jpg`,
						content: response.data,
					})
					const url = URL.createObjectURL(response.data)
					return url
				}
			} catch (error) {
				throw Error((error as unknown as AxiosError).message)
			}
		},
		enabled: !!files,
		placeholderData: keepPreviousData,
	})

	return wallpaper
}
