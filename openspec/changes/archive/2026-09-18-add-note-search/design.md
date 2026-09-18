## Context

`src/App.svelte` computes `sortedNotes` (a `$derived` sort of `notes` by `updatedAt`) and passes it straight to `NoteListPanel`, which renders `NoteCard`s or an empty-state message. `DESIGN.md`'s `text-field` component currently has two variants, `title` and `body`, both used only in the edit panel — there's no search-input variant yet. See proposal.md for why this is being added now.

## Goals / Non-Goals

**Goals:**
- Live, no-debounce, case-insensitive, word-AND filtering over title + body.
- A search-results empty state distinct from the "no notes at all" empty state.
- Keep the change local to the list panel — no new global state, no router, no library.

**Non-Goals:**
- Highlighting matched text, tag search, fuzzy/typo-tolerant matching, search history — all explicitly deferred per the proposal.

## Decisions

### Filtering lives entirely in `NoteListPanel`, not `App.svelte`
The proposal's Impact section sketched the filter step as living in `App.svelte`; on reflection, it fits better as a purely local concern of the list panel. `NoteListPanel` already receives the full sorted `notes` array; it now also owns a local `searchQuery` `$state('')` and derives `filteredNotes` from `notes` + `searchQuery` internally. `App.svelte`, `NoteCard`, the edit panel, and the `NoteStore` are completely unaware search exists — nothing about note creation, editing, autosave, or delete changes. This is a smaller, more contained diff than routing the query through `App.svelte` and back down.

### Matching function
```ts
function matches(note: Note, query: string): boolean {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return true
  const haystack = `${note.title}\n${note.body}`.toLowerCase()
  return words.every((word) => haystack.includes(word))
}
```
Concatenating title and body into one lowercased haystack (rather than checking each field separately per word) directly implements "every word appears as a substring in its title **or** body" — a word can be satisfied by either field, and different words can be satisfied by different fields, matching the "Multiple words require all to match" scenario as written.

### `<input type="search">`, not `type="text"`
Browsers render a native clear ("×") control for `type="search"` inputs with no extra markup, and it's the semantically correct type. This wasn't explicitly asked for, but it's a zero-cost way to get clear-button behavior without adding icon assets or extra state — consistent with keeping this change small. If it doesn't feel sufficient later, a custom clear button is easy to add without changing the matching logic.

### `DESIGN.md`: add `search` to `text-field`'s variants
Rather than defining a whole new component, this adds `search` alongside the existing `title`/`body` variants on `text-field` — it's the same underlying control (a single-line text input with a placeholder), just used in a new place with a new purpose. Token references, states, and anatomy are unchanged; only `variants` grows by one entry. This goes through the same graph → review → compile → adopt pipeline as every other `DESIGN.md` change so far, not a hand edit.

### Empty-state disambiguation
`NoteListPanel` already branches on `notes.length === 0` for "아직 메모가 없어요". That check is kept as-is (it must fire even while a search query is typed, if there are genuinely zero notes — an empty list is an empty list regardless of query). A second branch is added: `notes.length > 0 && filteredNotes.length === 0` shows a distinct message naming the query, e.g. `"{query}"와 일치하는 메모가 없어요`. Otherwise the filtered list renders.

## Risks / Trade-offs

- **[Trade-off] No proximity/phrase matching** — "회의 노트" as two words matches a note with "회의" in the title and unrelated "노트" far away in the body. Accepted per the explicit AND-by-word decision; a future change could add quoted-phrase support if this proves confusing in practice.
- **[Risk] Recomputing the filter on every keystroke** — negligible at personal-note-app scale (filtering an in-memory array of strings); no virtualization or memoization beyond Svelte's own `$derived` is needed.
