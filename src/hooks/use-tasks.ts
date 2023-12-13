import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useManifests } from './use-manifests'

export function useTasks() {
	const [searchParams, setSearchParams] = useSearchParams()

	const manifests = useManifests()

	const tasks = useMemo(() => {
		return searchParams.get('tasks') ? String(searchParams.get('tasks')).split(',') : []
	}, [searchParams])

	const tasksMaximized = useMemo(() => {
		return searchParams.get('tasks-maximized')
			? String(searchParams.get('tasks-maximized')).split(',')
			: []
	}, [searchParams])

	const tasksMinimized = useMemo(() => {
		return searchParams.get('tasks-minimized')
			? String(searchParams.get('tasks-minimized')).split(',')
			: []
	}, [searchParams])

	const taskGetZIndex = useCallback(
		(appId: string) => {
			// check the position of the array
			return tasks.indexOf(appId) + 1
		},
		[tasks],
	)

	const taskIsFocused = useCallback(
		(appId: string) => {
			return taskGetZIndex(appId) === tasks.length
		},
		[taskGetZIndex, tasks.length],
	)

	const saveAllChanges = useCallback(() => {
		tasks.length !== 0
			? searchParams.set('tasks', tasks.join(','))
			: searchParams.delete('tasks')

		tasksMinimized.length !== 0
			? searchParams.set('tasks-minimized', tasksMinimized.join(','))
			: searchParams.delete('tasks-minimized')
		setSearchParams(searchParams)

		tasksMaximized.length !== 0
			? searchParams.set('tasks-maximized', tasksMaximized.join(','))
			: searchParams.delete('tasks-maximized')
		setSearchParams(searchParams)
	}, [tasks, searchParams, tasksMinimized, setSearchParams, tasksMaximized])

	const closeTask = useCallback(
		(appId: string) => {
			if (tasks.includes(appId)) {
				tasks.splice(tasks.indexOf(appId), 1)
			}
			if (tasksMinimized.includes(appId)) {
				tasksMinimized.splice(tasksMinimized.indexOf(appId), 1)
			}

			const manifest = manifests.find((manifest) => manifest.appId === appId)

			if (manifest?.onCloseClearParams) {
				manifest.onCloseClearParams.forEach((param) => {
					searchParams.delete(param.key)
				})
			}

			saveAllChanges()
		},
		[tasks, tasksMinimized, manifests, saveAllChanges, searchParams],
	)

	const toggleAppMinimized = useCallback(
		(appId: string) => {
			if (!tasksMinimized.includes(appId)) {
				tasksMinimized.push(appId)
			} else if (tasksMinimized.includes(appId)) {
				tasksMinimized.splice(tasksMinimized.indexOf(appId), 1)
			}
			saveAllChanges()
		},
		[saveAllChanges, tasksMinimized],
	)
	const toggleAppMaximized = useCallback(
		(appId: string) => {
			if (!tasksMaximized.includes(appId)) {
				tasksMaximized.push(appId)
			} else if (tasksMaximized.includes(appId)) {
				tasksMaximized.splice(tasksMaximized.indexOf(appId), 1)
			}
			saveAllChanges()
		},
		[saveAllChanges, tasksMaximized],
	)

	type TypeParam = {
		key: string
		value: string
	}

	const toggleAppIsVisible = useCallback(
		(
			appId: string,
			optional?: {
				force?: boolean
				params?: TypeParam[]
			},
		) => {
			if (!tasks.includes(appId)) {
				// isn't open, open it
				tasks.push(appId)
			} else if (tasks.includes(appId)) {
				if (taskGetZIndex(appId) === tasks.length) {
					if (tasksMinimized.includes(appId)) {
						// is open, focused and minimized, so we normalize it
						tasksMinimized.splice(tasksMinimized.indexOf(appId), 1)
					} else if (!tasksMinimized.includes(appId)) {
						// is open, focused and normalized, so we minimize it
						// but only if the app can be minimized, and isn't forced
						if (
							manifests.find((m) => m.appId === appId)?.canMinimize !== false &&
							optional?.force !== true
						)
							tasksMinimized.push(appId)
					}
				} else if (taskGetZIndex(appId) !== tasks.length) {
					// is open, not focused, so we focus it and normalize it (if is minimized)
					tasks.splice(tasks.indexOf(appId), 1)
					tasks.push(appId)
					if (tasksMinimized.includes(appId)) {
						tasksMinimized.splice(tasksMinimized.indexOf(appId), 1)
					}
				}
			}
			if (optional?.params) {
				optional?.params.forEach((param) => {
					searchParams.set(param.key, param.value)
					setSearchParams(searchParams)
				})
			}
			saveAllChanges()
		},
		[
			tasks,
			saveAllChanges,
			taskGetZIndex,
			tasksMinimized,
			manifests,
			searchParams,
			setSearchParams,
		],
	)

	const taskIsOpen = useCallback(
		(appId: string) => {
			return tasks.includes(appId)
		},
		[tasks],
	)

	const taskIsMaximized = useCallback(
		(appId: string) => {
			return tasksMaximized.includes(appId)
		},
		[tasksMaximized],
	)

	const taskIsMinimized = useCallback(
		(appId: string) => {
			return tasksMinimized.includes(appId)
		},
		[tasksMinimized],
	)

	return useMemo(() => {
		return {
			tasks,
			toggleAppIsVisible,
			taskIsOpen,
			taskIsMaximized,
			taskIsMinimized,
			taskGetZIndex,
			closeTask,
			toggleAppMaximized,
			toggleAppMinimized,
			taskIsFocused,
		}
	}, [
		tasks,
		toggleAppIsVisible,
		taskIsOpen,
		taskIsMaximized,
		taskIsMinimized,
		taskGetZIndex,
		closeTask,
		toggleAppMaximized,
		toggleAppMinimized,
		taskIsFocused,
	])
}
