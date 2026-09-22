## Why

`add-note-body-formatting` explicitly dropped rich text — including links — as a non-goal ("Date blocks, multiple heading levels, bold/italic/links/tables — explicitly out of scope per the proposal"). Notes routinely reference other pages or documents, and right now a pasted or typed URL just sits in the body as plain, unclickable text. This reopens that dropped scope for links specifically, using the same Tab-confirm architecture already proven for headings and lists rather than introducing a new editing paradigm.

## What Changes

- Detect raw URL-shaped text (starting with `http://`, `https://`, or `www.`) anywhere within a line's text and, at the same existing confirmation points that already confirm headings/lists — Tab, the line losing focus, or pressing Enter — convert each match into a styled, clickable link. No markdown bracket syntax (`[label](url)`); the visible text and the link target are the same string.
- A confirmed link is atomic: it renders as a single, non-editable unit within the surrounding editable text. Cmd/Ctrl+click opens it in a new tab; a plain click behaves like clicking anywhere else in the text (places the caret, does not navigate). Backspace with the caret immediately after a link removes it as a whole — its text does not remain as plain text, unlike how headings/lists revert to marker-prefixed plain text. Editing an already-confirmed link's text in place is not supported in this version; the user deletes it and retypes.
- Because a link's visible text and its target are the same string, no new data needs to be stored — `Note.body` stays exactly the plain string it already is, and link detection is a rendering/serialization-time concern applied on top of the existing per-line text, the same way `## `/`- ` markers already are.
- Adds a new `link` component to `DESIGN.md` (states: default, hover, focus-visible; disabled/loading/error not applicable) through the standard graph → review → compile → adopt pipeline.

## Capabilities

### Modified Capabilities
- `note-taking`: adds inline link formatting to note bodies — detecting URL-shaped text and converting it into a clickable, atomic link at the same points headings/lists are already confirmed, with Cmd/Ctrl+click to open and whole-unit removal via Backspace.

## Impact

- `src/lib/components/NoteBodyEditor.svelte`: rendering (splitting a line's text into plain-text and link runs), the shared confirm logic used by Tab/`confirmOnLeave`/Enter (now also scans for link-shaped text, not just line-start markers), Backspace handling (deleting an atomic link when the caret sits immediately after one — distinct from the existing offset-0 block-level revert/merge logic, which is unaffected since "offset 0" has nothing preceding it by definition), and click handling (Cmd/Ctrl+click to open).
- A new small, DOM-free pure module (alongside `src/lib/notes/body-format.ts`) for detecting URL-shaped substrings within a line's text and splitting it into plain-text/link runs — kept separate from `body-format.ts` since it operates within a line's text, not on whole-line classification.
- `DESIGN.md` / `.omd/system/graph.json`: new `link` component, added through the graph pipeline, not a hand edit — styled with the existing `color-primary`/`color-primary-hover` tokens, so no new token is needed.
