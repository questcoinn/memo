## Context

`src/App.svelte` is currently a placeholder (`<main>hello app!</main>`) in a plain Vite + Svelte 5 + TypeScript scaffold — no router, no state library, no backend. `DESIGN.md` already defines the visual system this UI must use, including a `note-card` component, a `text-field` component, a `button-primary` component with `loading`/`disabled` states, and a layout rule requiring a two-column desktop layout that collapses to two full-width screens down to 320px. See `proposal.md` - Why / What Changes for motivation and scope.

## Goals / Non-Goals

**Goals:**
- Define the note data shape and the storage abstraction boundary.
- Define the draft/save state machine shared by "create" and "edit".
- Define how panel visibility responds to viewport width.
- Define component decomposition for the list and view/edit panels.

**Non-Goals:**
- Search, tags, or markdown rendering (deferred; see proposal.md - What Changes).
- Any storage backend other than `localStorage` (the interface is designed for it, but no second implementation is built now).
- Routing/deep-linking to a specific note.

## Decisions

### Note data shape
```ts
interface Note {
  id: string        // crypto.randomUUID()
  title: string
  body: string       // plain text, no markdown
  createdAt: string  // ISO 8601
  updatedAt: string  // ISO 8601
}
```
Plain strings for timestamps (not `Date`) keep the shape trivially JSON-serializable for `localStorage`, matching the confirmed plain-text, no-markdown scope.

### Storage boundary: `NoteStore` interface
```ts
interface NoteStore {
  list(): Promise<Note[]>
  get(id: string): Promise<Note | undefined>
  save(note: Note): Promise<Note>   // create or update; id decides which
  remove(id: string): Promise<void>
}
```
All methods return `Promise`s even though the initial `LocalStorageNoteStore` implementation is synchronous under the hood. This was chosen (over synchronous methods) specifically so callers already handle the async shape and a future `IndexedDbNoteStore` or remote-API-backed store can be swapped in later without changing any calling code — the extensibility the user asked for. `LocalStorageNoteStore` serializes the full note array as one JSON blob under one `localStorage` key; a corrupt or oversized blob is treated as the "save failure" / "load failure" path already required by the spec, not a crash.

Alternative considered: expose a Svelte store (`Writable<Note[]>`) directly instead of a repository interface. Rejected because it conflates persistence with reactive UI state and would make swapping backends harder later.

### Draft/save state machine
The view/edit panel holds at most one `draft` in local component state, independent of the persisted notes:
```
idle (no selection)
  -> viewing(note)            [click a note-card]
  -> drafting-new(emptyNote)  [click "new note"]
viewing(note) -> editing(note, draft=copy of note)   [user types]
editing / drafting-new -> viewing(saved note)         [Save clicked, NoteStore.save() resolves]
editing / drafting-new -> (discarded)                 [navigate away + confirm() accepted]
```
A draft is only ever written to `NoteStore` on explicit Save. This directly implements the "Explicit save" and "Unsaved changes are protected" requirements. The unsaved-changes guard is a single `confirm()` call gating any action that would replace the current draft (selecting another note, starting a new note); no custom modal component is introduced now, matching the confirmed minimal-scope choice.

### Responsive layout: CSS-driven, one state variable
A single reactive `selectedNoteId: string | null` (Svelte 5 `$state`) at the app root drives both panels; there is no router. Panel visibility is CSS-only:
- `>= 768px` (a conventional tablet/desktop breakpoint, chosen because nothing in `DESIGN.md` mandates a specific number beyond "down to 320px" for the narrow case): both panels rendered side by side via CSS grid/flex, regardless of `selectedNoteId`.
- `< 768px`: the list panel is shown when `selectedNoteId === null`; the view/edit panel is shown full-width otherwise. "Back" simply sets `selectedNoteId = null`.

This avoids adding a router dependency, matches the earlier decision to keep selection in component state (not the URL), and keeps the breakpoint as the only new "magic number," isolated to one CSS media query.

### Component decomposition
```
App.svelte
├── NoteListPanel.svelte     (list, empty state, "new note" action)
│   └── NoteCard.svelte      (per DESIGN.md note-card component)
└── NoteEditPanel.svelte     (view/edit, draft state, save/delete, confirm() guards)
```
`App.svelte` owns `selectedNoteId`, the loaded `Note[]`, and the single `NoteStore` instance; it passes data and callbacks down. This keeps the store a single source of truth and keeps both panels simple, presentational-plus-local-draft-state components.

## Risks / Trade-offs

- **[Risk] `confirm()` is a blocking, unstyled native dialog** that cannot match `DESIGN.md`'s visual system. → Mitigation: acceptable for this basic-behavior change per the explicit scope decision; isolated behind the single guard check so it can be swapped for a custom modal later without touching the state machine.
- **[Risk] Single JSON blob in `localStorage` means one corrupt write can affect all notes.** → Mitigation: `LocalStorageNoteStore` treats parse failure as a load failure (shown via the existing empty/error messaging requirement), and writes are wrapped so a failed `save()` rejects instead of partially overwriting the blob.
- **[Trade-off] No router means no deep link to a specific note and selection resets on reload.** → Accepted per the earlier "component state only" decision; the `NoteStore` boundary keeps a future move to hash-based routing localized to `App.svelte`.

## Migration Plan

No production data exists yet (the app has no note-taking behavior today), so there is no migration for this change itself. `LocalStorageNoteStore` is additive: it introduces a new `localStorage` key and does not touch anything existing.
