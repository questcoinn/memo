## Why

The note body currently only accepts plain text. Longer notes are hard to scan without any structure — the user wants to be able to add subheadings and nested (multi-level) lists.

## What Changes

- **BREAKING**: Replace the plain `<textarea>` body editor with a `contenteditable`-based, line-aware editor. The `Note.body` field itself stays a plain string (unchanged storage format, unchanged `NoteStore` interface, unchanged search behavior) — only the editing/rendering surface changes.
- Add a single-level subheading: typing `## ` at the start of a line, then pressing Tab, converts that line into a styled subheading. Backspace at the start of a confirmed subheading line reverts it to plain text (marker included).
- Add nested list items: typing `- ` at the start of a line, then pressing Tab, converts that line into a list item at depth 0. Pressing Tab again while on an already-confirmed list item increases its depth (up to depth 3, four levels total); Shift+Tab decreases it. Backspace at the start of a list item line reverts it to plain text.
- The line currently under the caret is always shown as raw, unstyled text while being edited — conversion only happens on an explicit Tab (or on load, for lines already saved with a recognized marker). This is specifically to avoid corrupting Korean (or other CJK) IME composition, which is at risk if the DOM is rewritten mid-composition.
- Previously-saved notes containing `## `/`- `-prefixed lines render styled immediately when the note is reopened — no need to press Tab again for content that already has the marker.
- Explicitly out of scope (raised and dropped during exploration): date blocks/inline date recognition. Also out of scope: multiple heading levels (only one level, `##`, is supported), rich text (bold/italic/links), and perfect handling of multi-block copy-paste or undo/redo edge cases in the new contenteditable editor — those are accepted rough edges for this first version.

## Capabilities

### Modified Capabilities
- `note-taking`: the note body gains structural formatting (one heading level, nested lists up to 4 levels) with a Tab-to-confirm authoring gesture; plain-text editing behavior for unstructured lines is unchanged.

## Impact

- **Code**: `src/lib/components/NoteEditPanel.svelte` (replaces the body `<textarea>` with a new editor component), a new `src/lib/components/NoteBodyEditor.svelte` (or similar) that owns the `contenteditable` element, per-line block classification, and Tab/Shift+Tab/Backspace handling, plus a serializer/deserializer between the DOM block structure and the plain `body` string.
- **Unaffected**: `NoteStore`/`LocalStorageNoteStore` (still stores a plain string), search/filtering (still matches the same string, markers included), autosave, delete, and the two-panel layout.
- **Design system**: `DESIGN.md` needs new typography/spacing tokens or component definitions for the in-body subheading and list-item visual treatment, added via the standard graph → compile → adopt pipeline.
