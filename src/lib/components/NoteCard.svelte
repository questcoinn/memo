<script lang="ts">
  import type { Note } from '../notes/types'

  interface Props {
    note: Note
    selected: boolean
    activeTagsLower: Set<string>
    onSelect: () => void
    onToggleTag: (tag: string) => void
  }

  let { note, selected, activeTagsLower, onSelect, onToggleTag }: Props = $props()

  const preview = $derived(note.body.trim().slice(0, 80) || '내용 없음')
  const updatedAtLabel = $derived(
    new Date(note.updatedAt).toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  )
</script>

<div class="note-card" class:selected>
  <button type="button" class="card-open" onclick={onSelect}>
    <span class="title">{note.title.trim() || '제목 없음'}</span>
    <span class="preview">{preview}</span>
    <span class="timestamp">{updatedAtLabel}</span>
  </button>
  {#if note.tags.length > 0}
    <div class="tag-row">
      {#each note.tags as tag (tag)}
        <button
          type="button"
          class="tag"
          class:active={activeTagsLower.has(tag.toLowerCase())}
          onclick={() => onToggleTag(tag)}
        >
          {tag}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .note-card {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-xs);
    width: 100%;
    background: var(--color-canvas);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-card);
    padding: var(--spacing-lg);
  }

  .note-card.selected {
    border-color: var(--color-primary);
  }

  .card-open {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-xs);
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    padding: var(--spacing-xs) var(--spacing-sm);
    font-family: inherit;
    cursor: pointer;
  }

  .note-card:hover .card-open {
    background: var(--color-surface);
  }

  .card-open:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .title {
    font-size: var(--typography-h3-size);
    font-weight: var(--typography-h3-weight);
    line-height: var(--typography-h3-line-height);
    color: var(--color-foreground);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .preview {
    font-size: var(--typography-body-small-size);
    font-weight: var(--typography-body-small-weight);
    line-height: var(--typography-body-small-line-height);
    color: var(--color-body);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .timestamp {
    font-size: var(--typography-body-small-size);
    font-weight: var(--typography-body-small-weight);
    line-height: var(--typography-body-small-line-height);
    color: var(--color-muted);
  }

  .tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  .tag {
    font-family: inherit;
    font-size: var(--typography-body-small-size);
    font-weight: var(--typography-body-small-weight);
    line-height: var(--typography-body-small-line-height);
    color: var(--color-weak-foreground);
    background: var(--color-weak-background);
    border: 2px solid transparent;
    border-radius: var(--radius-sm);
    padding: var(--spacing-xs) var(--spacing-sm);
    cursor: pointer;
  }

  .tag:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .tag.active {
    border-color: var(--color-primary);
  }
</style>
