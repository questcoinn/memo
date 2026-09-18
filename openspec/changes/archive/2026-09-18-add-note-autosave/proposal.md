## Why

The explicit-save model (click "저장" to commit an edit) adds friction the user no longer wants: they want edits to persist automatically as they type, with the save button removed entirely.

## What Changes

- **BREAKING**: Remove the explicit "저장" (Save) button and the requirement that persistence only happens on that click.
- Add debounced autosave: after the user stops typing in the title or body for a short pause, the draft is persisted automatically.
- A brand-new note is not persisted, and does not appear in the note list, until it has actual content (a non-empty title or body) — the first autosave after that first non-empty edit is what creates it. An untouched new-note draft that the user walks away from is discarded silently, same as today.
- Navigating away from a dirty draft (selecting another note, starting a new note, going back) immediately flushes the pending autosave instead of prompting a confirmation dialog. The `confirm()`-based unsaved-changes guard is removed — it's no longer needed once every edit is persisted automatically.
- Save-status feedback becomes ambient instead of button-attached: nothing is shown while idle/saved, a "저장 중…" message shows while an autosave is in flight, and a persistent failure message shows if it fails (unchanged from today, just no longer anchored to a button). A failed autosave is retried only passively — the next edit's debounce triggers another attempt; there is no separate background retry loop.
- Delete still requires an explicit `confirm()` — unaffected by this change.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `note-taking`: replaces the explicit-save and confirm-guarded-navigation model with debounced autosave and flush-on-navigate-away; changes when a new note starts appearing in the list.

## Impact

- **Code**: `src/App.svelte` (removes `confirmDiscardIfDirty`/`isDirty`-for-guarding and `saveDraft`-on-click; adds debounce + flush-on-navigate autosave logic), `src/lib/components/NoteEditPanel.svelte` (removes the Save button, adds ambient save-status text).
- **Dependencies**: none added.
- **Design system**: `DESIGN.md`'s `button-primary` component is currently described as covering "메모 저장, 새 메모 만들기" — after this change it's only used for "새 메모". Out of scope for this OpenSpec change (DESIGN.md is governed separately); flagged for a follow-up `omd:apply`/`omd:learn` pass.
