import type { Note } from './types'

export interface NoteStore {
  list(): Promise<Note[]>
  get(id: string): Promise<Note | undefined>
  save(note: Note): Promise<Note>
  remove(id: string): Promise<void>
}
