<script lang="ts">
  import type { Note } from '../notes/types'
  import NoteCard from './NoteCard.svelte'

  interface Props {
    notes: Note[]
    selectedId: string | null
    onSelect: (note: Note) => void
    onNew: () => void
  }

  let { notes, selectedId, onSelect, onNew }: Props = $props()

  let searchQuery = $state('')

  function matches(note: Note, query: string): boolean {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    if (words.length === 0) return true
    const haystack = `${note.title}\n${note.body}`.toLowerCase()
    return words.every((word) => haystack.includes(word))
  }

  const filteredNotes = $derived(notes.filter((note) => matches(note, searchQuery)))
</script>

<section class="list-panel">
  <header class="list-header">
    <h2>메모</h2>
    <button type="button" class="new-button" onclick={onNew}>새 메모</button>
  </header>

  <input
    class="search-field"
    type="search"
    placeholder="검색: 제목, 내용..."
    bind:value={searchQuery}
  />

  {#if notes.length === 0}
    <p class="empty-state">아직 메모가 없어요. "새 메모"로 시작해보세요.</p>
  {:else if filteredNotes.length === 0}
    <p class="empty-state">"{searchQuery}"와 일치하는 메모가 없어요.</p>
  {:else}
    <ul class="note-list">
      {#each filteredNotes as note (note.id)}
        <li>
          <NoteCard {note} selected={note.id === selectedId} onSelect={() => onSelect(note)} />
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .list-panel {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    height: 100%;
    padding: var(--spacing-xl);
    overflow-y: auto;
    background: var(--color-canvas);
  }

  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .list-header h2 {
    font-size: var(--typography-h2-size);
    font-weight: var(--typography-h2-weight);
    line-height: var(--typography-h2-line-height);
    color: var(--color-foreground);
    margin: 0;
  }

  .new-button {
    font-family: inherit;
    font-size: var(--typography-body-size);
    font-weight: 600;
    line-height: var(--typography-body-line-height);
    color: var(--color-on-primary);
    background: var(--color-primary);
    border: none;
    border-radius: var(--radius-button);
    height: 40px;
    padding: 0 var(--spacing-lg);
    cursor: pointer;
  }

  .new-button:hover {
    background: var(--color-primary-hover);
  }

  .new-button:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .search-field {
    font-family: inherit;
    font-size: var(--typography-body-size);
    font-weight: var(--typography-body-weight);
    line-height: var(--typography-body-line-height);
    color: var(--color-foreground);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .search-field:focus-visible {
    outline: none;
    border-color: var(--color-primary);
  }

  .empty-state {
    font-size: var(--typography-body-size);
    color: var(--color-muted);
  }

  .note-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
</style>
