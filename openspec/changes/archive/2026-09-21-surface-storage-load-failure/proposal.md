## Why

`LocalStorageNoteStore.list()` silently returns an empty array when the stored `localStorage` blob fails to parse (corrupted JSON, e.g. from a browser crash mid-write, disk/extension interference, or manual tampering) — this is indistinguishable from the user genuinely having no notes. Worse, the very next save the app performs (e.g. creating a new note from the resulting "아직 메모가 없어요" empty-state screen) overwrites that single JSON blob, permanently destroying the corrupted-but-still-present raw data with no chance of manual recovery. For a personal note-taking app with no other backend or sync, this is the most severe failure mode available: total, silent, and irreversible data loss.

## What Changes

- Distinguish a load-time parse failure from a genuinely empty note list, instead of collapsing both into `[]`.
- Show an explicit, distinct error message in the list panel when notes fail to load, instead of the "아직 메모가 없어요" empty-state message — following the same "don't hide the failure" principle the existing save-failure requirement already establishes.
- Before any further save can overwrite the corrupted `localStorage` entry, preserve its raw (unparsed) contents under a separate backup key, once, so the original bytes remain recoverable even after the user resumes normal use.
- The rest of the app SHALL continue to work normally after a load failure — creating, editing, and deleting notes are not blocked; only the note list starts empty (since nothing could be recovered from it) and the error is visible.

## Capabilities

### Modified Capabilities
- `note-taking`: adds a "load failure is shown, not hidden" requirement (parallel to the existing save-failure requirement) covering how a corrupted stored notes list is surfaced to the user, and that the underlying raw data is preserved rather than destroyed by the next write.

## Impact

- `src/lib/notes/local-storage-store.ts`: `readAll()` must report a parse failure distinctly (rather than returning `[]` indistinguishably from empty), and must back up the raw corrupted string under a separate key before it can be overwritten.
- `src/App.svelte`: `onMount`'s initial load needs to capture and hold a load-error state alongside the existing `notes` state.
- `src/lib/components/NoteListPanel.svelte`: needs a new prop/branch to render the load-error message in place of the empty-state message, reusing the existing `color-danger` treatment already used for save failures (no new DESIGN.md component or token needed).
