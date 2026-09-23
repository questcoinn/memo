## Why

Notes can now carry tags, but tags are purely decorative — clicking one does nothing, and search only matches title/body. As tag usage grows, there is no way to jump straight to "all notes tagged X" without scrolling and reading every card. This change turns the existing tag chips into a real filter.

## What Changes

- Clicking a tag chip on a note card toggles it into an active filter, instead of doing nothing.
- Selecting more than one tag filters to notes that carry **all** selected tags (AND).
- An active-filter row shows the currently selected tags near the search field, with a control to clear one tag or all of them — this is the only way to clear a filter once it has narrowed the list to zero notes, since the tag chip a user would otherwise click to toggle it off is no longer rendered.
- Tag filtering combines with the existing keyword search: a note must match the typed keywords AND carry every selected tag.
- The note list's "no notes match" empty state also covers the case where a tag filter (with or without a keyword query) matches nothing.
- **BREAKING** (spec-level, not a runtime compatibility break): removes the existing requirement that tag chips on a note card are non-interactive/presentational-only. The `tag` component's `interaction kind` in DESIGN.md changes from `non-interactive` to `interactive`, and its `selected` state (already defined but unused) becomes load-bearing.

## Capabilities

### Modified Capabilities

- `note-taking`: replaces the "Tags on a note card are descriptive, not an interactive filter" requirement with a new requirement that tag chips filter the note list; adds requirements for multi-tag AND filtering, the active-filter row and its clear controls, and combining tag filters with the existing keyword search (including the shared empty-state message).

## Impact

- [src/lib/components/NoteCard.svelte](../../../src/lib/components/NoteCard.svelte) — tag chips become clickable controls; markup restructures so a tag button is not nested inside the card's own `<button>` (invalid HTML today).
- [src/lib/components/NoteListPanel.svelte](../../../src/lib/components/NoteListPanel.svelte) — owns the set of active tag filters, the active-filter row, and the combined keyword+tag `matches()` logic.
- [DESIGN.md](../../../DESIGN.md) — `tag` component's semantics, interaction kind, and state table change; System Graph must be regenerated per the project's compiler-only-edit rule before DESIGN.md is hand-edited.
- `openspec/specs/note-taking/spec.md` — one requirement removed, several added (delta in this change's `specs/` folder).
- No data model or storage change: filtering is derived client-side from the `tags` already on each `Note`.
