import { useMemo } from 'react'
import defaultWallpaperLightStr from '../../assets/wallpapers/pierre-yves-burgi-Yq72qj2yGH0-unsplash.jpg'
import defaultWallpaperDarkStr from '../../assets/wallpapers/pierre-yves-burgi-eQRywYTBZOQ-unsplash.jpg'
import defaultWallpaperLightPreviewStr from '../../assets/wallpapers/pierre-yves-burgi-Yq72qj2yGH0-unsplash_preview.jpg'
import defaultWallpaperDarkPreviewStr from '../../assets/wallpapers/pierre-yves-burgi-eQRywYTBZOQ-unsplash_preview.jpg'
import { useLocalStorage } from '@mantine/hooks'

export interface TypeWallpaper {
	name: string
	id: string
	url: string
	url_preview: string
}

export function useWallpaper() {
	const wallpapers: TypeWallpaper[] = useMemo(() => {
		return [
			{
				name: 'Volcán de noche',
				id: 'volcano-night',
				url: defaultWallpaperDarkStr,
				url_preview: defaultWallpaperDarkPreviewStr,
			},
			{
				name: 'Volcán de día',
				id: 'volcano-day',
				url: defaultWallpaperLightStr,
				url_preview: defaultWallpaperLightPreviewStr,
			},
		]
	}, [])

	const [wallpaperSaved, setWallpaper] = useLocalStorage({
		key: 'wallpaper',
		defaultValue: 'volcano-night',
		getInitialValueInEffect: false,
	})

	const wallpaper = useMemo(() => {
		return wallpapers.find((w) => w.id === wallpaperSaved) || wallpapers[0]
	}, [wallpaperSaved, wallpapers])

	return { wallpapers, wallpaper, setWallpaper }
}
