## 1. Autosave core

- [x] 1.1 In `App.svelte`, replace `saving`/`saveError` with a derived `saveStatus: 'idle' | 'saving' | 'error'` (keeping the error message text alongside `'error'`) and verify `pnpm run check` passes with no type errors.
- [x] 1.2 Extract the persistence logic from the current `saveDraft()` into a routine that: skips the `NoteStore.save()` call when `isNewDraft` is true and both `draft.title` and `draft.body` are empty after trimming; otherwise saves, updates the `notes` array, and flips `isNewDraft` to `false` on success. Verify by temporarily calling it directly with an empty new draft and confirming no `NoteStore.save()` call happens (e.g. via a console log or breakpoint).
- [x] 1.3 Add a 500ms debounce: on every change to `draft.title`/`draft.body`, (re)schedule a timer that runs the routine from 1.2 when it fires. Verify in the running app that editing a note and waiting ~500ms updates the note list without any button click.
- [x] 1.4 Add `flushPendingSave()`: clears the pending timer and, if the draft is dirty, immediately `await`s the same routine from 1.2. Verify by editing a note and immediately (before 500ms) checking dev tools that the note is nonetheless saved once `flushPendingSave()` runs.

## 2. Navigation without confirmation

- [x] 2.1 Make `openNote`, `startNewNote`, and `goBack` `async` and have each `await flushPendingSave()` before changing `selectedNoteId`/`draft`, and delete `confirmDiscardIfDirty()` and its `window.confirm(...)` call entirely. Verify by editing a note, immediately clicking a different note, and confirming: no confirmation dialog appears, the edit is saved, and the other note opens.
- [x] 2.2 Verify starting a new note, typing nothing, and then selecting an existing note discards the empty draft with no dialog and no entry added to the list (per the "Walking away from an untouched draft discards it" scenario).
- [x] 2.3 Verify the mobile "back" action (`goBack`) also flushes a pending edit the same way before returning to the list.

## 3. UI: remove Save button, add ambient status

- [x] 3.1 Remove the Save button and its `onSave`/`isDirty`-as-disabled-condition wiring from `NoteEditPanel.svelte`.
- [x] 3.2 Add ambient save-status text driven by `saveStatus`: nothing rendered for `'idle'`, "저장 중…" for `'saving'`, and the persistent failure message for `'error'` (reusing the existing `.save-error` styling). Verify visually: idle shows nothing, and forcing a slow/failing save (as in task 4.1 of the prior change) shows the right text at the right time.
- [x] 3.3 Verify the Delete button and its own `confirm()` are unaffected by these changes.

## 4. End-to-end verification

- [x] 4.1 Manually walk through every scenario in the updated `specs/note-taking/spec.md` delta (new note stays out of the list until it has content, edits autosave after a pause, navigating away flushes immediately with no dialog, idle/saving/error status text, passive-only retry) in the running dev app.
- [x] 4.2 Run `npm run check` and fix any type errors introduced by the above.
