## 1. Data model & storage layer

- [x] 1.1 Add the `Note` type (`id`, `title`, `body`, `createdAt`, `updatedAt`) in a shared module and verify `npm run check` passes with no type errors.
- [x] 1.2 Define the `NoteStore` interface (`list`, `get`, `save`, `remove`, all `Promise`-returning) per design.md and verify the file compiles with no implementation yet (interface-only).
- [x] 1.3 Implement `LocalStorageNoteStore`, serializing all notes as one JSON blob under one `localStorage` key, and verify manually in the browser devtools console that `save()` then `list()` round-trips a note.
- [x] 1.4 Make `LocalStorageNoteStore.list()`/`get()` treat a missing or unparsable blob as an empty list rather than throwing, and `save()`/`remove()` reject with an error on write failure, and verify by manually corrupting the `localStorage` key and confirming the app still loads to the empty-list state instead of crashing.

## 2. App shell & responsive layout

- [x] 2.1 Replace the placeholder `App.svelte` with a two-panel shell (`NoteListPanel` + `NoteEditPanel`), owning `selectedNoteId` (`$state`) and the loaded `Note[]`, and verify `npm run dev` renders both panels.
- [x] 2.2 Add the `>= 768px` / `< 768px` responsive CSS behavior from design.md and verify by resizing the browser: both panels are visible together above the breakpoint, and only one screen shows at a time below it, down to 320px wide with no horizontal scroll.
- [x] 2.3 Wire `App.svelte` to load notes from the `NoteStore` on mount and verify previously saved notes (added via devtools in 1.3) appear in the list on page load.

## 3. Note list panel

- [x] 3.1 Build `NoteCard` using the `note-card` token/state contract from `DESIGN.md` (title, preview text, timestamp, hover/focus-visible states) and verify it renders for a sample note with correct styling tokens applied.
- [x] 3.2 Render the note list sorted by `updatedAt` descending and verify by saving edits to two different notes and confirming the most recently saved one appears first.
- [x] 3.3 Add the empty-list message (shown when there are zero notes) and verify it appears after deleting all notes and disappears once a note exists.
- [x] 3.4 Add the "new note" action in the list panel and verify clicking it opens an empty draft in the edit panel without adding anything to the list yet.

## 4. Note view/edit panel

- [x] 4.1 Implement the draft state machine from design.md (`viewing` / `editing` / `drafting-new`) in `NoteEditPanel` and verify by selecting a note (read-only view) then typing (enters editing) without the list changing.
- [x] 4.2 Build the title/body `text-field` inputs and the `button-primary` Save action per `DESIGN.md`, and verify clicking Save on a new draft calls `NoteStore.save()` and the note then appears in the list.
- [x] 4.3 Verify clicking Save on an edited existing note updates its stored title/body and moves it to the top of the list (per 3.2's ordering).
- [x] 4.4 Show a save-failure message when `NoteStore.save()` rejects, without discarding the draft's in-progress content, and verify by temporarily forcing `save()` to reject and confirming the draft text is still present after the failure message appears.

## 5. Delete and unsaved-changes protection

- [x] 5.1 Add a delete action on an open note that calls `window.confirm()` before calling `NoteStore.remove()`, and verify: confirming removes the note from the list and storage; cancelling leaves it untouched.
- [x] 5.2 Add the unsaved-changes guard: selecting a different note or starting a new note while a draft is dirty calls `window.confirm()` first, and verify: cancelling keeps the current draft open and unchanged; confirming discards it and shows the newly selected note or new draft.

## 6. End-to-end verification

- [x] 6.1 Manually walk through the full loop once (create -> save -> edit -> save -> delete) in the running dev app and confirm every scenario in `specs/note-taking/spec.md` holds.
- [x] 6.2 Run `npm run check` and fix any type errors introduced by the above.
