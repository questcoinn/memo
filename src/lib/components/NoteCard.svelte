<script lang="ts">
  import type { Note } from '../notes/types'

  interface Props {
    note: Note
    selected: boolean
    onSelect: () => void
  }

  let { note, selected, onSelect }: Props = $props()

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

<button
  type="button"
  class="note-card"
  class:selected
  onclick={onSelect}
>
  <span class="title">{note.title.trim() || '제목 없음'}</span>
  <span class="preview">{preview}</span>
  <span class="timestamp">{updatedAtLabel}</span>
</button>

<style>
  .note-card {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-xs);
    width: 100%;
    text-align: left;
    background: var(--color-canvas);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-card);
    padding: var(--spacing-lg);
    font-family: inherit;
    cursor: pointer;
  }

  .note-card:hover {
    background: var(--color-surface);
  }

  .note-card:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .note-card.selected {
    border-color: var(--color-primary);
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
</style>
