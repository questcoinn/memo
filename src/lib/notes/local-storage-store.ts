import type { Note } from './types'
import type { NoteStore } from './store'

const STORAGE_KEY = 'memo.notes.v1'

function readAll(): Note[] {
  let raw: string | null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    return []
  }
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function writeAll(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch (error) {
    throw new Error('메모를 저장하지 못했어요.', { cause: error })
  }
}

export class LocalStorageNoteStore implements NoteStore {
  async list(): Promise<Note[]> {
    return readAll()
  }

  async get(id: string): Promise<Note | undefined> {
    return readAll().find((note) => note.id === id)
  }

  async save(note: Note): Promise<Note> {
    const notes = readAll()
    const index = notes.findIndex((existing) => existing.id === note.id)
    if (index === -1) {
      notes.push(note)
    } else {
      notes[index] = note
    }
    writeAll(notes)
    return note
  }

  async remove(id: string): Promise<void> {
    const notes = readAll().filter((note) => note.id !== id)
    writeAll(notes)
  }
}
