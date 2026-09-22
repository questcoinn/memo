<script lang="ts">
  import { onMount } from 'svelte'
  import type { Note } from './lib/notes/types'
  import { LocalStorageNoteStore, getCorruptedBackup } from './lib/notes/local-storage-store'
  import NoteListPanel from './lib/components/NoteListPanel.svelte'
  import NoteEditPanel from './lib/components/NoteEditPanel.svelte'

  const AUTOSAVE_DEBOUNCE_MS = 500

  const noteStore = new LocalStorageNoteStore()

  let notes = $state<Note[]>([])
  let selectedNoteId = $state<string | null>(null)
  let draft = $state<Note | null>(null)
  let isNewDraft = $state(false)
  let saveStatus = $state<'idle' | 'saving' | 'error'>('idle')
  let saveErrorMessage = $state<string | null>(null)
  let loadErrorMessage = $state<string | null>(null)
  let loadErrorRawData = $state<string | null>(null)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const sortedNotes = $derived(
    [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  )

  const persistedSelected = $derived(
    selectedNoteId === null ? null : notes.find((note) => note.id === selectedNoteId) ?? null,
  )

  const isDirty = $derived(
    draft === null
      ? false
      : isNewDraft
        ? Boolean(draft.title.trim() || draft.body.trim())
        : persistedSelected !== null &&
          (draft.title !== persistedSelected.title || draft.body !== persistedSelected.body),
  )

  onMount(async () => {
    try {
      notes = await noteStore.list()
    } catch (error) {
      notes = []
      loadErrorMessage = error instanceof Error ? error.message : '메모를 불러오지 못했어요.'
      loadErrorRawData = getCorruptedBackup()
    }
  })

  async function persistDraft(): Promise<boolean> {
    if (draft === null || !isDirty) return true
    saveStatus = 'saving'
    const toSave: Note = { ...draft, updatedAt: new Date().toISOString() }
    try {
      const saved = await noteStore.save(toSave)
      const index = notes.findIndex((note) => note.id === saved.id)
      if (index === -1) {
        notes = [...notes, saved]
      } else {
        notes = notes.map((note) => (note.id === saved.id ? saved : note))
      }
      draft = { ...saved }
      if (isNewDraft) {
        selectedNoteId = saved.id
        isNewDraft = false
      }
      saveStatus = 'idle'
      saveErrorMessage = null
      return true
    } catch (error) {
      saveStatus = 'error'
      saveErrorMessage = error instanceof Error ? error.message : '메모를 저장하지 못했어요.'
      return false
    }
  }

  function clearScheduledAutosave() {
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
  }

  function scheduleAutosave() {
    clearScheduledAutosave()
    debounceTimer = setTimeout(() => {
      debounceTimer = null
      persistDraft()
    }, AUTOSAVE_DEBOUNCE_MS)
  }

  async function flushPendingSave(): Promise<boolean> {
    clearScheduledAutosave()
    return await persistDraft()
  }

  async function openNote(note: Note) {
    if (!(await flushPendingSave())) return
    selectedNoteId = note.id
    draft = { ...note }
    isNewDraft = false
    saveStatus = 'idle'
    saveErrorMessage = null
  }

  async function startNewNote() {
    if (!(await flushPendingSave())) return
    const now = new Date().toISOString()
    selectedNoteId = null
    draft = { id: crypto.randomUUID(), title: '', body: '', createdAt: now, updatedAt: now }
    isNewDraft = true
    saveStatus = 'idle'
    saveErrorMessage = null
  }

  async function goBack() {
    if (!(await flushPendingSave())) return
    selectedNoteId = null
    draft = null
    isNewDraft = false
    saveStatus = 'idle'
    saveErrorMessage = null
  }

  async function deleteCurrentNote() {
    if (draft === null || isNewDraft) return
    clearScheduledAutosave()
    const id = draft.id
    await noteStore.remove(id)
    notes = notes.filter((note) => note.id !== id)
    if (selectedNoteId === id) {
      selectedNoteId = null
      draft = null
      saveStatus = 'idle'
      saveErrorMessage = null
    }
  }
</script>

<main class="shell" data-has-draft={draft !== null}>
  <div class="pane list-pane">
    <NoteListPanel
      notes={sortedNotes}
      selectedId={selectedNoteId}
      {loadErrorMessage}
      onSelect={openNote}
      onNew={startNewNote}
    />
  </div>
  <div class="pane edit-pane">
    <NoteEditPanel
      bind:draft
      {isNewDraft}
      {saveStatus}
      {saveErrorMessage}
      {loadErrorRawData}
      onEdit={scheduleAutosave}
      onDelete={deleteCurrentNote}
      onBack={goBack}
    />
  </div>
</main>

<style>
  .shell {
    display: grid;
    grid-template-columns: 1fr;
    height: 100%;
    min-width: 320px;
  }

  .pane {
    min-height: 0;
  }

  .list-pane {
    display: block;
  }

  .edit-pane {
    display: none;
  }

  .shell[data-has-draft='true'] .list-pane {
    display: none;
  }

  .shell[data-has-draft='true'] .edit-pane {
    display: block;
  }

  @media (min-width: 768px) {
    .shell {
      grid-template-columns: 320px 1fr;
    }

    .list-pane,
    .edit-pane,
    .shell[data-has-draft='true'] .list-pane,
    .shell[data-has-draft='true'] .edit-pane {
      display: block;
    }
  }
</style>
