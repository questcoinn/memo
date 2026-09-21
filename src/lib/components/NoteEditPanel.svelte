<script lang="ts">
  import type { Note } from '../notes/types'
  import ConfirmDialog from './ConfirmDialog.svelte'
  import NoteBodyEditor from './NoteBodyEditor.svelte'

  interface Props {
    draft: Note | null
    isNewDraft: boolean
    saveStatus: 'idle' | 'saving' | 'error'
    saveErrorMessage: string | null
    onEdit: () => void
    onDelete: () => void
    onBack: () => void
  }

  let { draft, isNewDraft, saveStatus, saveErrorMessage, onEdit, onDelete, onBack }: Props =
    $props()

  let deleteConfirmOpen = $state(false)

  function confirmDelete() {
    deleteConfirmOpen = false
    onDelete()
  }
</script>

<section class="edit-panel">
  {#if draft === null}
    <p class="placeholder">왼쪽에서 메모를 선택하거나 새 메모를 만들어보세요.</p>
  {:else}
    <header class="edit-header">
      <button type="button" class="back-button" onclick={onBack}>← 목록</button>
      {#if !isNewDraft}
        <button type="button" class="delete-button" onclick={() => (deleteConfirmOpen = true)}>삭제</button>
      {/if}
    </header>

    <input
      class="title-field"
      type="text"
      placeholder="제목 없음"
      bind:value={draft.title}
      oninput={onEdit}
    />

    <NoteBodyEditor
      value={draft.body}
      placeholder="메모를 입력하세요"
      onInput={(newBody) => {
        draft.body = newBody
        onEdit()
      }}
    />

    {#if saveStatus === 'saving'}
      <p class="save-status">저장 중…</p>
    {:else if saveStatus === 'error'}
      <p class="save-status error" role="alert">{saveErrorMessage}</p>
    {/if}

    <ConfirmDialog
      open={deleteConfirmOpen}
      title="메모 삭제"
      message="이 메모를 삭제할까요? 삭제하면 되돌릴 수 없어요."
      confirmLabel="삭제"
      cancelLabel="취소"
      onConfirm={confirmDelete}
      onCancel={() => (deleteConfirmOpen = false)}
    />
  {/if}
</section>

<style>
  .edit-panel {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    height: 100%;
    padding: var(--spacing-xl);
    overflow-y: auto;
    background: var(--color-canvas);
    border-left: 1px solid var(--color-border);
  }

  .placeholder {
    font-size: var(--typography-body-size);
    color: var(--color-muted);
  }

  .edit-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .back-button {
    display: none;
    font-family: inherit;
    font-size: var(--typography-body-size);
    color: var(--color-body);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .delete-button {
    font-family: inherit;
    font-size: var(--typography-body-small-size);
    color: var(--color-danger);
    background: none;
    border: 1px solid var(--color-danger);
    border-radius: var(--radius-md);
    height: 32px;
    padding: 0 var(--spacing-md);
    cursor: pointer;
    margin-left: auto;
  }

  .title-field {
    font-family: inherit;
    font-size: var(--typography-h1-size);
    font-weight: var(--typography-h1-weight);
    line-height: var(--typography-h1-line-height);
    color: var(--color-foreground);
    border: none;
    border-bottom: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm) 0;
    background: transparent;
  }

  .title-field:focus-visible {
    outline: none;
    border-bottom-color: var(--color-primary);
  }

  .save-status {
    font-size: var(--typography-body-small-size);
    color: var(--color-muted);
    margin: 0;
  }

  .save-status.error {
    color: var(--color-danger);
  }

  @media (max-width: 767px) {
    .back-button {
      display: inline-block;
    }
  }
</style>
