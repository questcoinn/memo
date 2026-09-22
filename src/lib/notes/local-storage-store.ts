import type { Note } from './types'
import type { NoteStore } from './store'

const STORAGE_KEY = 'memo.notes.v1'
const BACKUP_KEY = `${STORAGE_KEY}.corrupted-backup`

interface RawRead {
  notes: Note[]
  corrupted: boolean
  raw: string | null
}

function parseNotes(raw: string): Note[] | null {
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed.map((note) => ({ tags: [], ...note }))
  } catch {
    return null
  }
}

function readRaw(): RawRead {
  let raw: string | null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    return { notes: [], corrupted: false, raw: null }
  }
  if (!raw) return { notes: [], corrupted: false, raw: null }
  const parsed = parseNotes(raw)
  if (parsed === null) return { notes: [], corrupted: true, raw }
  return { notes: parsed, corrupted: false, raw }
}

function readAll(): Note[] {
  return readRaw().notes
}

function backupCorrupted(raw: string): void {
  try {
    localStorage.setItem(BACKUP_KEY, raw)
  } catch {
    // best-effort; nothing more we can do if this also fails
  }
}

function writeAll(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch (error) {
    throw new Error('메모를 저장하지 못했어요.', { cause: error })
  }
}

export function getCorruptedBackup(): string | null {
  try {
    return localStorage.getItem(BACKUP_KEY)
  } catch {
    return null
  }
}

export class LocalStorageNoteStore implements NoteStore {
  async list(): Promise<Note[]> {
    const result = readRaw()
    if (result.corrupted && result.raw) {
      backupCorrupted(result.raw)
      throw new Error('메모를 불러오지 못했어요. 저장된 데이터에 문제가 있는 것 같아요.')
    }
    return result.notes
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
