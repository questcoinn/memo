<script lang="ts">
  import type { Note } from '../notes/types'
  import NoteCard from './NoteCard.svelte'

  interface Props {
    notes: Note[]
    selectedId: string | null
    loadErrorMessage: string | null
    onSelect: (note: Note) => void
    onNew: () => void
  }

  let { notes, selectedId, loadErrorMessage, onSelect, onNew }: Props = $props()

  let searchQuery = $state('')
  let activeTags = $state<Set<string>>(new Set())

  const activeTagsLower = $derived(new Set([...activeTags].map((tag) => tag.toLowerCase())))

  function toggleTag(tag: string) {
    const lower = tag.toLowerCase()
    const existing = [...activeTags].find((t) => t.toLowerCase() === lower)
    const next = new Set(activeTags)
    if (existing !== undefined) {
      next.delete(existing)
    } else {
      next.add(tag)
    }
    activeTags = next
  }

  function clearTags() {
    activeTags = new Set()
  }

  function matchesQuery(note: Note, query: string): boolean {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    if (words.length === 0) return true
    const haystack = `${note.title}\n${note.body}`.toLowerCase()
    return words.every((word) => haystack.includes(word))
  }

  function matchesTags(note: Note, tagsLower: Set<string>): boolean {
    if (tagsLower.size === 0) return true
    const noteTagsLower = note.tags.map((tag) => tag.toLowerCase())
    return [...tagsLower].every((tag) => noteTagsLower.includes(tag))
  }

  const filteredNotes = $derived(
    notes.filter((note) => matchesQuery(note, searchQuery) && matchesTags(note, activeTagsLower)),
  )

  const trimmedQuery = $derived(searchQuery.trim())

  const noMatchMessage = $derived.by(() => {
    const tagList = [...activeTags].map((tag) => `"${tag}"`).join(', ')
    if (trimmedQuery && activeTags.size > 0) {
      return `"${trimmedQuery}"와 ${tagList} 태그를 모두 만족하는 메모가 없어요.`
    }
    if (activeTags.size > 0) {
      return `${tagList} 태그와 일치하는 메모가 없어요.`
    }
    return `"${trimmedQuery}"와 일치하는 메모가 없어요.`
  })
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

  {#if activeTags.size > 0}
    <div class="active-filters">
      <ul class="filter-chip-list">
        {#each [...activeTags] as tag (tag)}
          <li class="filter-chip">
            <span class="chip-label">{tag}</span>
            <button
              type="button"
              class="chip-remove"
              aria-label={`${tag} 필터 해제`}
              onclick={() => toggleTag(tag)}
            >
              ×
            </button>
          </li>
        {/each}
      </ul>
      <button type="button" class="clear-all" onclick={clearTags}>전체 해제</button>
    </div>
  {/if}

  {#if loadErrorMessage}
    <p class="empty-state load-error" role="alert">{loadErrorMessage}</p>
  {:else if notes.length === 0}
    <p class="empty-state">아직 메모가 없어요. "새 메모"로 시작해보세요.</p>
  {:else if filteredNotes.length === 0}
    <p class="empty-state">{noMatchMessage}</p>
  {:else}
    <ul class="note-list">
      {#each filteredNotes as note (note.id)}
        <li>
          <NoteCard
            {note}
            selected={note.id === selectedId}
            {activeTagsLower}
            onSelect={() => onSelect(note)}
            onToggleTag={toggleTag}
          />
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

  .active-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .filter-chip-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-sm);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .filter-chip {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    background: var(--color-weak-background);
    color: var(--color-weak-foreground);
    border: 2px solid var(--color-primary);
    border-radius: var(--radius-sm);
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .chip-label {
    font-size: var(--typography-body-small-size);
    font-weight: var(--typography-body-small-weight);
    line-height: var(--typography-body-small-line-height);
  }

  .chip-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--color-weak-foreground);
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
  }

  .chip-remove:hover {
    background: rgba(27, 100, 218, 0.12);
  }

  .chip-remove:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .clear-all {
    font-family: inherit;
    font-size: var(--typography-body-small-size);
    font-weight: var(--typography-body-small-weight);
    line-height: var(--typography-body-small-line-height);
    color: var(--color-muted);
    background: transparent;
    border: none;
    padding: var(--spacing-xs) var(--spacing-sm);
    cursor: pointer;
  }

  .clear-all:hover {
    color: var(--color-body);
  }

  .clear-all:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .empty-state {
    font-size: var(--typography-body-size);
    color: var(--color-muted);
  }

  .load-error {
    color: var(--color-danger);
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
