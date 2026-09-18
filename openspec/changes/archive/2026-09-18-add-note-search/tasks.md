## 1. DESIGN.md: add search variant to text-field

- [x] 1.1 Build a graph draft off the current canonical `.omd/system/graph.json` adding `search` to the `text-field` component's `variants` array (anatomy/states/token_refs unchanged), and verify it validates locally (`validateCoreGraph`) before submitting.
- [x] 1.2 Add matching `provenance.json`/graph `governance.decisions` entries for this change (source_class `agent-proposed-greenfield-decision`, evidence: this change's design.md reasoning).
- [x] 1.3 Run the draft through `prepare-design-md-core-review.cjs` and diff the preview `DESIGN.md` against the current one — verify only the intended variant/provenance lines differ.
- [x] 1.4 Approve, compile, checkpoint, and adopt the package into the project root, and verify `.omd/system/manifest.json`'s hashes match the new `DESIGN.md`/`graph.json` on disk. (Adoption failed once first: two provenance decisions from the archived `use-dialog-for-delete-confirm` change still pointed at `openspec/changes/use-dialog-for-delete-confirm/design.md`, which no longer exists at that path after archiving moved it to `openspec/changes/archive/2026-09-18-use-dialog-for-delete-confirm/design.md`. Fixed both evidence paths to the archived location and re-ran; this is a real, recurring risk for every future DESIGN.md change after any archive — worth a permanent fix at some point, not attempted here since it's outside this change's scope.)

## 2. Search and filtering in `NoteListPanel`

- [x] 2.1 Add a local `searchQuery` (`$state('')`) and a `matches(note, query)` word-AND helper (case-insensitive, checks a combined `title + body` haystack per word) in `NoteListPanel.svelte`, and derive `filteredNotes` from `notes` + `searchQuery`. Verify `pnpm run check` passes.
- [x] 2.2 Render an `<input type="search">` in the list header, always visible (not behind a toggle), bound to `searchQuery`, styled with the `text-field` `search` variant's tokens. Verify visually it matches the existing input styling in the app.
- [x] 2.3 Verify live filtering in the running app: typing a word narrows the list immediately (no debounce, no submit button); clearing the field (including via the native search-input clear control) restores the full list.
- [x] 2.4 Verify multi-word AND matching: a query of two words where one is only in one note's title and the other only in a different note's body matches neither; a query where both words are findable (in either field) within the *same* note matches that note. (Verified with 3 real notes: query "회의 노트" matched only the note with "회의" in body and "노트" as a substring of "노트북" in body; correctly excluded a note containing "회의" alone.)

## 3. Empty-state disambiguation

- [x] 3.1 Keep the existing "아직 메모가 없어요" branch keyed on `notes.length === 0` (before filtering), and add a second branch for `notes.length > 0 && filteredNotes.length === 0` showing a message naming the query (e.g. `"{query}"와 일치하는 메모가 없어요`).
- [x] 3.2 Verify both empty states independently: deleting all notes shows the "no notes at all" message even with an empty search field; typing a query that matches nothing (with notes present) shows the distinct "no results" message. (Also verified the priority case: zero notes total with a non-empty search query still shows "아직 메모가 없어요", not the no-results message.)

## 4. Verification

- [x] 4.1 Manually walk through every scenario in `specs/note-taking/spec.md`'s new "Search filters the note list by keyword" requirement in the running dev app.
- [x] 4.2 Run `npm run check` and fix any type errors introduced by the above. (0 errors.)
