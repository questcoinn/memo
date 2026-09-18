## Context

`src/App.svelte` currently implements an explicit-save model: `draft`/`isNewDraft`/`isDirty` track a working copy, `saveDraft()` only runs on a Save button click, and `confirmDiscardIfDirty()` gates every navigation (`openNote`, `startNewNote`, `goBack`) behind a native `window.confirm()`. `NoteEditPanel.svelte` owns the Save button and renders `saveError` next to it. See proposal.md for why this is changing.

## Goals / Non-Goals

**Goals:**
- Persist edits automatically without any explicit save action or button.
- Never lose an edit to a navigation action within the app (selecting another note, starting a new note, going back).
- Keep save failures visible (per `DESIGN.md`'s "don't hide loading/error states" governance principle), without a button to anchor them to.

**Non-Goals:**
- Per-field debounce tuning, cross-tab sync, undo/redo, or an active background retry loop — none of these were asked for, and passive retry (confirmed with the user) is sufficient for the failure modes a `localStorage` backend actually has.
- Changing anything about delete, which keeps its own explicit `confirm()`.

## Decisions

### Debounce interval: 500ms
A single `setTimeout`-based debounce, reset on every keystroke in title or body, fires the autosave 500ms after the user stops typing. This is a conventional "feels instant but doesn't write on every keystroke" value; nothing in the confirmed decisions requires a specific number, and `LocalStorageNoteStore` writes are cheap enough that the exact value isn't load-bearing.

### Flush-on-navigate-away is awaited before switching
`flushPendingSave()` clears any pending debounce timer and, if the draft is dirty, immediately runs the same save routine the timer would have run — and the three navigation handlers (`openNote`, `startNewNote`, `goBack`) `await` it before changing `selectedNoteId`/`draft`. `LocalStorageNoteStore.save()` is synchronous under the hood, so this adds no perceptible delay today. Awaiting it (rather than firing-and-forgetting) is what keeps failure handling simple: a flush failure surfaces against the note the user is leaving, before the panel has switched to something else, rather than needing to attribute a failure to a note that's no longer on screen. If the storage backend ever becomes genuinely slow (e.g. a remote API), this trade-off should be revisited.

Alternative considered: fire-and-forget the flush and navigate immediately. Rejected because a failure would then need to be shown against a note the user has already navigated away from, which has no natural place to display it in this UI.

### First-content-triggers-creation
The save routine, when `isNewDraft` is true, checks `draft.title.trim() || draft.body.trim()` before calling `NoteStore.save()`. Empty → skip the save entirely (no-op; this is what makes an untouched new draft vanish silently on navigate-away, with nothing to flush). Non-empty → save, then flip `isNewDraft = false`; from that point it behaves exactly like editing any other existing note, including being allowed to be edited back to empty without disappearing (matches the unchanged "Edit an existing note as a draft" behavior).

### Save-status as a single derived field
`saveStatus: 'idle' | 'saving' | 'error'` replaces the current `saving: boolean` + `saveError: string | null` pair conceptually (the error message string is still kept alongside `'error'` to render). `NoteEditPanel` shows nothing for `'idle'`, "저장 중…" for `'saving'`, and the persistent failure message for `'error'`. A successful autosave after a failure resets to `'idle'`.

### What gets removed
`confirmDiscardIfDirty()` and every `window.confirm(...)` call tied to navigation are deleted outright — not replaced with an autosave-aware equivalent, per the confirmed decision that flushing removes the need to ask. `isDirty` survives as an internal signal (does the draft differ from what's persisted, or is it a new draft with content) used only to decide whether there's anything to flush — it no longer gates a confirmation dialog. The Save button is removed from `NoteEditPanel.svelte`; the Delete button and its own `confirm()` are untouched.

## Risks / Trade-offs

- **[Risk] A crash or tab close within the 500ms debounce window can still lose the last keystroke** — no debounce-based autosave can fully eliminate this. → Mitigation: flush-on-navigate-away covers every in-app navigation, which is the common case; the remaining window is a narrow, accepted edge case consistent with this being a basic-behavior change.
- **[Trade-off] Passive-only retry** means a persisted failure (e.g. `localStorage` quota exceeded) stays visibly failed until the user edits again. → Accepted per the earlier confirmed decision: this backend's failure modes are not transient, so an automatic retry loop wouldn't help anyway.
