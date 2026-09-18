<script lang="ts">
  interface Props {
    open: boolean
    title: string
    message: string
    confirmLabel: string
    cancelLabel: string
    onConfirm: () => void
    onCancel: () => void
  }

  let { open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel }: Props = $props()

  let dialogEl: HTMLDialogElement | undefined

  $effect(() => {
    if (!dialogEl) return
    if (open && !dialogEl.open) {
      dialogEl.showModal()
    } else if (!open && dialogEl.open) {
      dialogEl.close()
    }
  })

  function handleCancel() {
    onCancel()
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === dialogEl) {
      onCancel()
    }
  }
</script>

<dialog
  bind:this={dialogEl}
  class="confirm-dialog"
  oncancel={handleCancel}
  onclick={handleBackdropClick}
>
  <h3>{title}</h3>
  <p>{message}</p>
  <div class="actions">
    <button type="button" class="cancel-button" onclick={onCancel}>{cancelLabel}</button>
    <button type="button" class="confirm-button" onclick={onConfirm}>{confirmLabel}</button>
  </div>
</dialog>

<style>
  .confirm-dialog {
    border: none;
    border-radius: var(--radius-card);
    padding: var(--spacing-xl);
    max-width: 320px;
    width: calc(100% - var(--spacing-xl) * 2);
    background: var(--color-canvas);
  }

  .confirm-dialog::backdrop {
    background: var(--color-overlay);
  }

  .confirm-dialog h3 {
    margin: 0 0 var(--spacing-md) 0;
    font-size: var(--typography-h3-size);
    font-weight: var(--typography-h3-weight);
    line-height: var(--typography-h3-line-height);
    color: var(--color-foreground);
  }

  .confirm-dialog p {
    margin: 0 0 var(--spacing-xl) 0;
    font-size: var(--typography-body-size);
    font-weight: var(--typography-body-weight);
    line-height: var(--typography-body-line-height);
    color: var(--color-body);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
  }

  .cancel-button,
  .confirm-button {
    font-family: inherit;
    font-size: var(--typography-body-size);
    border: none;
    border-radius: var(--radius-md);
    height: 40px;
    padding: 0 var(--spacing-lg);
    cursor: pointer;
  }

  .cancel-button {
    background: var(--color-surface);
    color: var(--color-body);
  }

  .cancel-button:hover {
    background: var(--color-border);
  }

  .confirm-button {
    background: var(--color-danger);
    color: var(--color-on-primary);
    font-weight: 600;
  }

  .confirm-button:hover {
    opacity: 0.9;
  }

  .cancel-button:focus-visible,
  .confirm-button:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
</style>
