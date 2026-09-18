## Why

The project is currently a blank Vite + Svelte scaffold with no note-taking behavior. We need the basic memo app loop — create, view, edit, save, and delete a note — working end to end before anything else (search, tags, sync) can build on top of it.

## What Changes

- Add a two-panel shell: a note list on the left, a view/edit panel on the right.
- Add a `NoteStore` persistence interface with a `localStorage`-backed implementation, so the storage backend can be swapped (e.g. for IndexedDB or a remote API) later without touching UI code.
- Add note CRUD: create (as an unsaved draft), edit, explicit save, delete.
- Add an explicit-save model: edits are held as a draft in the edit panel and only committed to `NoteStore` when the user clicks Save.
- Add an unsaved-changes guard: switching away from a dirty draft (selecting another note, starting a new note) prompts a native `confirm()` before discarding.
- Add a delete confirmation using the same `confirm()` pattern.
- Add responsive layout behavior: both panels are visible side by side on wide viewports; on narrow viewports (down to 320px) the list and the view/edit panel become two separate full-width screens with back navigation, per the layout rules already defined in `DESIGN.md`.
- Add empty-list and save-failure state messaging (no silent empty/error states, per `DESIGN.md` governance principles).

Out of scope for this change: search/filtering, tags, markdown rendering, and any storage backend other than `localStorage`. These are explicitly deferred to future changes.

## Capabilities

### New Capabilities
- `note-taking`: Creating, viewing, editing, saving, deleting, and persisting personal notes through a two-panel (list + view/edit) UI, backed by a swappable storage interface.

### Modified Capabilities
(none — no existing specs)

## Impact

- **Code**: `src/App.svelte` (currently a placeholder) becomes the two-panel shell; new components for the note list, note card, and view/edit panel; a new `NoteStore` interface module and a `localStorage`-backed implementation.
- **Dependencies**: none added — plain Svelte 5 runes for state, no router or state-management library.
- **Design system**: consumes tokens/components already defined in `DESIGN.md` (`note-card`, `text-field`, `button-primary`, `tag` is not used yet since tagging is out of scope).
- **Data**: introduces a client-side note schema (id, title, body, createdAt, updatedAt) serialized to `localStorage`; no backend/API involved.
