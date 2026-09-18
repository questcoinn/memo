## Why

As the note list grows, finding a specific note by scrolling becomes impractical. `DESIGN.md`'s Experience section already lists "메모 목록에서 검색하고 다시 찾기" as a primary task, but it was explicitly deferred out of scope in the first change (`add-basic-memo-crud`). This adds it.

## What Changes

- Add a search field, always visible in the list panel (no toggle to reveal it), that filters the note list live as the user types — no debounce, no explicit submit action.
- Matching is by title and body, case-insensitive, word-AND: every whitespace-separated word in the query must appear as a substring somewhere in the note's title or body (in either field, not necessarily the same one) for the note to match.
- An empty query shows the full list, unchanged from today.
- A query that matches nothing shows a distinct "no results for this query" message, separate from the existing "no notes at all" empty state.
- Out of scope, explicitly: highlighting matched keywords in the results, and searching by tag (tags aren't implemented yet). Both can be their own future change.

## Capabilities

### Modified Capabilities
- `note-taking`: adds a search/filter requirement to the note list; existing list, create, edit, delete, and autosave behavior is unchanged.

## Impact

- **Code**: `src/lib/components/NoteListPanel.svelte` (owns the search input and the distinct empty-results state), `src/App.svelte` (adds the filtering step between `sortedNotes` and what's passed to the panel).
- **Dependencies**: none added — plain string matching, no search library.
- **Design system**: the list panel header gains a search input; DESIGN.md doesn't yet have a dedicated search-field variant, so this will need a small addition to the `text-field` component (or a documented new one) via the standard graph → compile → adopt pipeline.
