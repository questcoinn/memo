## Why

Deleting a note currently confirms via native `window.confirm()`, which cannot be styled to match `DESIGN.md`'s visual system. This was flagged as a known risk when delete was first built (see `openspec/changes/archive/2026-09-18-add-basic-memo-crud/design.md` — "isolated behind the single guard check so it can be swapped for a custom modal later"). This change makes that swap: a native HTML `<dialog>` element, styled with the project's own tokens.

## What Changes

- Replace the `window.confirm('이 메모를 삭제할까요?')` call in delete with a native `<dialog>` opened via `showModal()`.
- Style the dialog and its `::backdrop` with `DESIGN.md` tokens (color, radius, typography), instead of the unstylable native dialog.
- Default focus lands on "취소" (Cancel), not "삭제" (Delete), so pressing Enter without deliberately moving focus cancels rather than deletes.
- Add two new dismiss affordances that `window.confirm()` didn't have as explicit, stylable behavior: clicking the backdrop, and pressing Escape. Both only ever cancel — neither can trigger the delete.
- Add a new `confirm-dialog` component to the `DESIGN.md` Core v2 system graph (anatomy, states, token references), following the same graph → compiler → adopt process used for every other component so far. This requires one new foundational token: a backdrop/overlay color, which doesn't exist yet.

## Capabilities

### Modified Capabilities
- `note-taking`: "Delete a note with confirmation" gains an explicit scenario for the backdrop/Escape cancel affordances. The existing confirm/cancel/delete behavior is unchanged — this requirement was already implementation-neutral about *how* confirmation is presented.

## Impact

- **Code**: `src/App.svelte` (delete handler no longer calls `window.confirm`), `src/lib/components/NoteEditPanel.svelte` (owns the `<dialog>` element and its open/close/backdrop/Escape wiring), likely a new small `ConfirmDialog.svelte` component so the pattern is reusable rather than delete-specific markup.
- **Design system**: new `confirm-dialog` component and new `color-overlay`-style token added to `DESIGN.md` via the standard graph/provenance/coverage → compile → adopt pipeline (not a hand edit).
- **Dependencies**: none added — native `<dialog>`, no library.
