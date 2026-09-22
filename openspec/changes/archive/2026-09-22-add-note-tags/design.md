## Context

`Note` (`src/lib/notes/types.ts`) currently has no `tags` field. `LocalStorageNoteStore` (`src/lib/notes/local-storage-store.ts`) round-trips the whole `Note[]` array as JSON with no schema versioning or migration step; `App.svelte` holds the full notes list in memory (`notes = $state<Note[]>([])`), so any cross-note data (like "all tags in use") can be derived client-side without a new store method.

DESIGN.md already defines a `tag` component (`non-interactive`, `fill`/`weak` variants) intended for `note-card`'s `tag-list` anatomy, but no component exists yet for adding/removing tags during editing — see proposal.md for why that gap needs a new component rather than reusing `tag`.

## Goals / Non-Goals

**Goals:**
- Let a user attach free-form tags to a note and see them on its note card, per specs/note-taking/spec.md.
- Keep the new interactive chip-input component's visual language consistent with the existing `tag` component's tokens.
- Keep storage backward-compatible: notes saved before this change load without error.

**Non-Goals:**
- Clicking a tag to filter the note list (explicitly deferred to a future "filter-chip" component, per DESIGN.md's own note on this).
- Including tags in the search-field match.
- Tag rename/merge across notes, tag colors, or a max-tag-count limit.
- Any server-side or cross-device sync of tags (the app has no such layer today).

## Decisions

**Data model:** `Note.tags: string[]`, ordered by insertion (order of addition), not sorted. Simple array keeps `save`/`list`/`get` in `NoteStore` unchanged in shape; no new store methods needed.

**Backward-compatible reads:** normalize `tags` to `[]` at the single point where stored JSON is parsed (`parseNotes` in `local-storage-store.ts`), not scattered as `note.tags ?? []` across components. Every `Note` flowing through the app is guaranteed to have a `tags` array from the moment it's read.

**Autocomplete source:** derive the set of all tags in use from the in-memory `notes` array in `App.svelte` (`$derived`), deduplicated case-insensitively (first-seen spelling wins), sorted. No separate index or store query — the full note list is already loaded for the list panel.

**Tag identity / normalization:** trim whitespace on add; compare for duplicates and for autocomplete matching case-insensitively; store the tag using whichever spelling was first used (typing a new casing of an existing tag reuses the existing spelling via suggestion selection, per spec). No further normalization (no lowercasing, no punctuation stripping) — keeps behavior simple and matches how the user described wanting autocomplete to work, without inventing a stricter canonicalization rule.

**Autosave integration:** `isDirty` in `App.svelte` currently compares `title`/`body` between `draft` and the persisted note. Extend it to also compare `tags` (array equality by value and order). This means adding or removing a tag chip marks the draft dirty and triggers the existing debounced autosave / flush-on-navigate flow — no new persistence path, tags ride the existing autosave machinery.

**New component (`tag-input`):** interactive, composed of a text input + suggestion dropdown + chip list, added to DESIGN.md's Components & States section:
- Anatomy: `chip-list`, `chip-remove-control`, `text-input`, `suggestion-list`
- States: `default`, `focus-visible` (on the text input and, separately, on a chip's remove control), `has-suggestions` (dropdown open)
- Token reuse: chips reuse `color-weak-background`/`color-weak-foreground`/`radius-sm`/`typography-body-small` from the existing `tag` component (visual continuity between "tag while typing" and "tag once shown on a card"); the input field itself reuses `color-surface`/`color-border`/`radius-md`/`typography-body` from `text-field`; focus rings reuse `color-primary`, matching every other focus-visible state in DESIGN.md.
- This is a new component, not a `text-field` variant, because it has structurally different anatomy (chips + dropdown) and different keyboard semantics (Enter confirms a chip rather than submitting).

**Placement in the edit panel:** the tag input sits directly under the title field, above `NoteBodyEditor`. Tags are metadata about the note, like the title, so grouping them together keeps the body editor visually focused on writing.

**Note-card tag-list placement:** after the timestamp, matching the anatomy order already declared in DESIGN.md for `note-card` (`title, preview-text, timestamp, tag-list`). Uses the `tag` component's `weak` variant (quieter than `fill`, consistent with DESIGN.md's "avoid decoration" principle) and wraps to additional lines if needed — no truncation or "+N more" affordance for this scope, since capping tags adds UI complexity for a problem (very tag-heavy notes) that doesn't exist yet.

**IME safety:** the tag input's Enter-to-confirm handling must ignore Enter presses that occur during IME composition (Korean input), using the input event's `isComposing` / `compositionstart`/`compositionend`, so composing a Korean tag doesn't prematurely confirm a partial syllable block as a tag.

## Risks / Trade-offs

- [Risk] Free-form tagging invites near-duplicate tags ("todo" vs "TODO" vs "to-do") → [Mitigation] Case-insensitive autocomplete nudges the user toward reusing an existing tag's exact spelling; true synonym-merging is out of scope for this change.
- [Risk] A naive Enter-to-confirm handler fires mid-IME-composition and mangles Korean tag input → [Mitigation] Explicit `isComposing` guard, called out as its own decision above.
- [Risk] Extending `isDirty` to compare `tags` could subtly change autosave timing if array comparison is implemented wrong (e.g. reference equality) → [Mitigation] Use value-based comparison (element-wise or `JSON.stringify`), covered by the same tests as the existing title/body dirty-check.
- [Risk] Adding a new DESIGN.md component increases the design system's surface to maintain → [Mitigation] It deliberately reuses existing tokens rather than introducing new ones, keeping the addition small.

## Migration Plan

No data migration script needed: `parseNotes` already tolerates missing fields at the JSON level, so normalizing a missing `tags` to `[]` is a one-line addition at that same parse boundary. No versioning, no backfill write — old notes simply gain an empty tag list the first time they're read, and get `tags` written the next time they're saved (on any edit, including a tag add).
