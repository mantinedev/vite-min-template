// db.ts
import Dexie, { Table } from 'dexie'

export interface File {
	id?: number
	path: string
	content: unknown
}

export class FilesSubClassedDexie extends Dexie {
	// 'files' is added by dexie when declaring the stores()
	// We just tell the typing system this is the case
	files!: Table<File>

	constructor() {
		super('storage')
		this.version(1).stores({
			files: '++id, path, content', // Primary key and indexed props
		})
	}
}

export const db = new FilesSubClassedDexie()
