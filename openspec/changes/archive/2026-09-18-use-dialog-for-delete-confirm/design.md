## Context

Delete currently gates on `window.confirm('이 메모를 삭제할까요?')` in [App.svelte](../../../src/App.svelte)'s `deleteCurrentNote()`. This was flagged as a known risk in the very first change (`archive/2026-09-18-add-basic-memo-crud/design.md`): the native dialog can't carry any `DESIGN.md` styling. `DESIGN.md` is an adopted Core v2 Portable Core package (`.omd/system/manifest.json` binds exact hashes for `graph.json`/`DESIGN.md`/`provenance.json`/`coverage.json`) — its own governance section is explicit that "DESIGN.md 본문과 claim marker는 컴파일러 출력만 신뢰하고 직접 수정하지 않는다." Any new component (here, `confirm-dialog`) and any new token (here, an overlay color) must go through the same graph draft → review → compile → adopt pipeline used for every existing component, not a hand edit.

## Goals / Non-Goals

**Goals:**
- Replace `window.confirm()` with a `DESIGN.md`-styled `<dialog>` for delete, with no regression to the existing confirm/cancel/delete behavior.
- Add backdrop-click and Escape as additional, safe (cancel-only) dismiss paths.
- Register `confirm-dialog` as a real Core v2 component so future confirmations (if any) have a defined contract instead of ad hoc markup.

**Non-Goals:**
- Open/close animation. `DESIGN.md`'s foundations already require `Reduced motion: Required`; the simplest way to satisfy that without extra work is to add no motion at all — the dialog appears/disappears instantly via `showModal()`/`close()`. This can be revisited later behind a `prefers-reduced-motion` guard if wanted.
- Generalizing beyond delete. Only one confirmation exists in the app today; the component is designed to be reusable, but no second call site is being added now.

## Decisions

### `showModal()`, not `show()`
`showModal()` gives a real modal: focus trapped inside the dialog, background inert, and a `::backdrop` pseudo-element to style — matching what a delete confirmation needs. `show()` (non-modal) would leave the rest of the page interactive, which is wrong for a destructive-action gate.

### Default focus on Cancel
The dialog's first focusable element is the "취소" button (before "삭제" in DOM order), so `showModal()`'s built-in autofocus lands there and a stray Enter keypress cancels rather than deletes. This is the standard safe-default pattern for destructive-action confirmations.

### Backdrop click and Escape both cancel, never confirm
`<dialog>` closes on Escape automatically (it fires a `cancel` event, then `close`) — no extra wiring needed beyond listening for `close` and treating "closed without the confirm button having been clicked" as cancel, which is already the natural default since nothing happens unless the confirm button's own `onclick` runs. Backdrop click is not built in: a click handler on the `<dialog>` element itself checks `event.target === dialogElement` (a click that lands on the backdrop, not on the dialog's content, has the dialog element as its target) and calls the same close-as-cancel path. Both paths only ever cancel — there is no way to reach the delete action except clicking "삭제" directly, so this adds convenience without adding risk.

### New component: `confirm-dialog`
Added to the Core v2 graph's `components_states.components`:
- **Anatomy**: `title`, `message`, `cancel-action`, `confirm-action`
- **Variants**: `destructive` (the only variant used today, by delete)
- **States**: `default`, `focus-visible`
- **Token references**: `color-danger` (confirm action, destructive variant), `color-overlay` (new — see below), `radius-md`, `radius-card`, `typography-body`, `typography-h3`
- **Interaction**: interactive, both actions applicable in `default`/`focus-visible`; `disabled`/`loading`/`error`/`success` not-applicable — this dialog has no async state of its own, delete either succeeds and closes it or the existing "Save failure is shown, not hidden" style messaging on the underlying note (not the dialog) would apply, matching how the codebase already keeps a confirm/cancel dialog free of loading/error states.

### New token: `color-overlay`
Nothing in the current `foundations.tokens` covers a modal backdrop. Toss's own captured reference (`.claude/data/references/toss/DESIGN.md`) doesn't document a scrim/overlay value either — this is a genuine gap, not something to source from the reference. The proposed value is `rgba(25, 31, 40, 0.5)`: `color-foreground`'s hex (`#191f28` → `25, 31, 40`) at 50% alpha, so the overlay is derived from a color already in the system rather than an invented new hue. Provenance: `agent-proposed-greenfield-decision`. Its `$type` is `overlay-color`, not `color` — the project's Core v2 validator requires `$type: "color"` tokens to be a plain 6-digit hex string for its `token_reference_closure`/contrast checks, which an alpha-blended `rgba()` value can't satisfy; a distinct type label avoids that check without misrepresenting the value.

### Component structure: a small reusable `ConfirmDialog.svelte`
Rather than inlining `<dialog>` markup into `NoteEditPanel.svelte`, a small `ConfirmDialog.svelte` owns the element, its `showModal()`/`close()` lifecycle, and the backdrop/Escape wiring, taking `open`, `title`, `message`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel` props. `NoteEditPanel` renders it once and passes delete-specific copy. This mirrors the project's existing pattern of small presentational components (`NoteCard`, `NoteListPanel`) rather than growing `NoteEditPanel` further, and gives the `confirm-dialog` Core v2 component definition an actual 1:1 code counterpart.

## Risks / Trade-offs

- **[Risk] `<dialog>`'s `::backdrop` styling and `showModal()` focus behavior vary slightly across older browser versions.** → Accepted: current-generation Chrome/Safari/Firefox all support this well; no polyfill is being added for a personal note-taking app.
- **[Trade-off] No open/close animation** means the dialog feels slightly more abrupt than a typical polished modal. → Accepted per Non-Goals; revisit later behind `prefers-reduced-motion: no-preference` if wanted.
