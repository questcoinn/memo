## 1. Data model and storage

- [x] 1.1 Add `tags: string[]` to `Note` in `src/lib/notes/types.ts` and verify `npm run check` passes with the new field referenced from `App.svelte`
- [x] 1.2 Normalize missing `tags` to `[]` inside `parseNotes` in `src/lib/notes/local-storage-store.ts`, and verify a manually seeded `localStorage` note object without a `tags` key loads without a load-failure message
- [x] 1.3 Update `startNewNote` in `src/App.svelte` to initialize `tags: []` on a new draft

## 2. DESIGN.md: new `tag-input` component

- [x] 2.1 Add the `tag-input` component to DESIGN.md's Components & States section (anatomy `chip-list`/`chip-remove-control`/`text-input`/`suggestion-list`; states `default`/`focus-visible`/`has-suggestions`; token references per design.md's Decisions), following the project's existing DESIGN.md update path, and verify the new entry follows the same structure as the other components (`tag`, `text-field`) already in the file

## 3. `TagInput` component

- [x] 3.1 Create `src/lib/components/TagInput.svelte` taking the current note's `tags: string[]`, the derived list of all known tags, and an `onChange` callback; render existing tags as chips (reusing `tag`'s weak-variant tokens) each with a remove control, plus a text input
- [x] 3.2 Implement add-on-Enter with an `isComposing` guard so confirming a tag doesn't fire mid-IME-composition, and verify by typing a Korean tag name and pressing Enter without producing a truncated syllable block
- [x] 3.3 Implement duplicate prevention (case-insensitive) and empty/whitespace-only rejection on add, and verify by trying to re-add an existing tag in a different casing
- [x] 3.4 Implement the suggestion dropdown: filter the all-known-tags list by case-insensitive substring match on the current input, excluding tags already on the note, and verify suggestions update as the user types and selecting one adds the tag using its existing spelling
- [x] 3.5 Implement chip removal via the chip's remove control, and via Backspace when the text input is empty (removing the most recently added tag), and verify both paths in the browser
- [x] 3.6 Style focus-visible states for the text input and each chip's remove control per DESIGN.md's `color-primary` focus-ring convention, and verify with keyboard-only navigation (Tab through chips and input)

## 4. Wire tags into the edit panel and autosave

- [x] 4.1 Add `TagInput` to `NoteEditPanel.svelte`, positioned between the title field and `NoteBodyEditor`, wired to `draft.tags` and calling `onEdit` on every add/remove so the existing debounce/flush autosave path picks it up
- [x] 4.2 Extend `isDirty` in `src/App.svelte` to compare `draft.tags` against the persisted note's `tags` by value (not reference), and verify adding then removing a tag (net no-op) still triggers autosave once, matching the existing title/body dirty-check pattern
- [x] 4.3 Verify end-to-end in the browser: add a tag, wait for the autosave debounce, reload the page, and confirm the tag is still present on the note

## 5. Show tags on the note card

- [x] 5.1 Add a tag-list to `NoteCard.svelte` after the timestamp, using the existing `tag` component's weak variant, rendered only when the note has at least one tag
- [x] 5.2 Verify in the browser: a note with tags shows them on its card, a note with no tags shows no tag-list area, and clicking a tag on a card does not filter or otherwise change the note list

## 6. Cross-cutting verification

- [x] 6.1 Run `npm run check` and confirm no type errors across the changed files
- [x] 6.2 Manually verify a note saved before this change (no `tags` field in its stored JSON) still loads normally with an empty tag list and can have tags added to it
- [x] 6.3 Manually verify the tag input and note-card tag-list stay usable and legible at 320px viewport width, per DESIGN.md's responsive constraints
