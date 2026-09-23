## Context

See [proposal.md](proposal.md) for motivation. Relevant current state:

- [NoteCard.svelte](../../../src/lib/components/NoteCard.svelte) renders the entire card as a single `<button class="note-card" onclick={onSelect}>`, with the tag list (`<ul class="tag-list"><li class="tag">`) as plain, non-interactive children inside that button.
- [NoteListPanel.svelte](../../../src/lib/components/NoteListPanel.svelte) owns `searchQuery` as local `$state` and derives `filteredNotes` from it; this is the only place list-level filtering happens.
- `Note.tags` ([types.ts](../../../src/lib/notes/types.ts)) is already `string[]`, sourced from storage; no data model change is needed.
- DESIGN.md is a **generated projection**, not hand-authored: `.omd/system/manifest.json` declares `profile: portable-core` with `authority.canonical: "system-graph"` and a bound `graph.json` hash. Per [CLAUDE.md](../../../CLAUDE.md) and DESIGN.md's own "Additional change rules", token/component changes go through the System Graph draft and its compiler, then get re-projected into DESIGN.md — DESIGN.md itself is never edited by hand.
- DESIGN.md's `tag` component already defines a `selected` state (`States: default, selected`) but nothing sets it today, and its `Interaction kind: non-interactive` is the thing this change needs flipped.

## Goals / Non-Goals

**Goals:**
- Make tag chips on note cards clickable filter toggles, multi-select with AND semantics, combinable with the existing keyword search.
- Keep the card's existing accessible "click anywhere on the card to open it" behavior intact and valid HTML/ARIA — no interactive element nested inside another interactive element.
- Respect the existing documented contrast constraint on `color-on-primary`/`color-primary` (AA text needs 17px+ bold) rather than reusing that pair on small tag chip text.

**Non-Goals:**
- A dedicated, always-visible "browse all tags" bar independent of note cards (rejected in exploration in favor of clicking a tag chip you already see).
- OR semantics for multiple selected tags (confirmed AND only).
- Persisting the active tag filter across reloads or route changes — it is transient UI state, same lifecycle as the existing `searchQuery`.
- Any change to how tags are added/removed/suggested in [TagInput.svelte](../../../src/lib/components/TagInput.svelte) — out of scope, untouched.

## Decisions

### 1. Restructure NoteCard markup: sibling button + tag row, not nested buttons

Today the whole card is one `<button>`. Making tag chips independently clickable `<button>` elements inside that outer `<button>` is invalid HTML (interactive content cannot nest) and is also a known ARIA anti-pattern when done via `role="button"` on a wrapping `<div>` instead — a nested real `<button>` inside an element a screen reader announces as "button" is confusing, and this project's DESIGN.md lists accessibility as its #1 project priority.

Chosen approach: change `.note-card` from a `<button>` to a non-interactive `<div>` that keeps the current border/radius/padding styling. Inside it:
- A `<button class="card-open">` wraps only the title, preview, and timestamp (the part that should open the note), reset to look unstyled so the card's visual appearance is unchanged.
- A `<div class="tag-row">` (sibling of `card-open`, not a descendant) holds one `<button class="tag">` per tag, each toggling that tag's active-filter state on click.

This keeps every interactive element a real, independently focusable `<button>`, with no nesting, and preserves today's visual layout (tag row still appears inside the same bordered card).

**Alternative considered**: keep `.note-card` as a single `<button>` and move the tag row outside it as a sibling `<li>` child (i.e., visually detach tags from the card). Rejected — it changes the card's visual grouping for no benefit, when the wrapping-`<div>` approach achieves the same accessibility properties without a layout change.

**Alternative considered**: `<div role="button" tabindex="0">` wrapping everything including nested tag `<button>`s, with `stopPropagation` on tag clicks. Rejected — valid HTML, but re-implements keyboard activation (Enter/Space) by hand and is the ARIA nested-interactive anti-pattern flagged above.

### 2. Active-tag filter state lives in NoteListPanel, alongside `searchQuery`

Add `let activeTags = $state<Set<string>>(new Set())` in [NoteListPanel.svelte](../../../src/lib/components/NoteListPanel.svelte), next to the existing `searchQuery`. `NoteCard` receives the current note's active/inactive tag state and an `onToggleTag(tag: string)` callback as props, rather than owning any filter state itself — consistent with `NoteCard` already being presentational and driven by props (`selected` is done the same way today).

`matches(note, query, activeTags)` extends the existing word-AND logic with: `activeTags.size === 0 || [...activeTags].every(t => note.tags.some(nt => nt.toLowerCase() === t.toLowerCase()))`. Tag comparison is case-insensitive for defense-in-depth (active tags always come from an existing note's own `tags` array via a click, never free text, but a lower-cased compare costs nothing and matches the case-insensitivity already used for duplicate-tag prevention and suggestions).

### 3. Selected-tag styling: keep the weak-background chip, add a `color-primary` ring — don't reuse `color-primary`/`color-on-primary` as chip fill

DESIGN.md documents that `color-on-primary` on `color-primary` measures 3.71:1 and is only safe for 17px+ bold text ("버튼 라벨은 17px 이상 굵은 글자만 사용하고, 더 낮은 대비가 필요한 곳에는 재사용하지 않는다") — tag chip text is `typography-body-small` (14px), so filling a selected chip with `color-primary` background + `color-on-primary` text would violate that constraint.

Instead, the selected state keeps the existing `color-weak-background`/`color-weak-foreground` chip (unchanged text contrast) and adds a `2px solid var(--color-primary)` border/ring to mark it active — the same visual language the app already uses for focus-visible and selection (e.g. `note-card.selected { border-color: var(--color-primary) }`, `.new-button:focus-visible { outline: 2px solid var(--color-primary) }`). This satisfies the foundation rule that `color-primary` is reserved for elements with a real action (tags are now actionable) without touching the flagged low-contrast pair.

### 4. Active-filter row is inline markup in NoteListPanel, not a new component

The active-filter display (per-tag remove control + clear-all) is only ever used in one place. Following the project's own guidance against premature abstraction, it is implemented as inline markup/state inside `NoteListPanel.svelte` rather than factored into a new `.svelte` component. Its chip/remove-button visual style mirrors the existing chip pattern in [TagInput.svelte](../../../src/lib/components/TagInput.svelte) (`chip` + `chip-remove` with a `×` control) for visual consistency, without importing or sharing code with it — `TagInput`'s chips edit a note's stored tags; this row edits transient filter state, a different concern.

### 5. DESIGN.md is regenerated, not hand-edited

Because `.omd/system/manifest.json` binds an adopted Core v2 graph as canonical authority, the `tag` component's `Interaction kind` (→ `interactive`) and its state table (`selected` becomes load-bearing) are changed in the System Graph draft first, then DESIGN.md is regenerated from it via the project's compiler/apply flow — never edited directly. `tasks.md` reflects this as a graph-update-and-resync step rather than a DESIGN.md file edit.

## Risks / Trade-offs

- **[Risk]** Splitting `.note-card` into `card-open` (button) + `tag-row` (div of buttons) changes the DOM structure and CSS selectors (`.note-card:hover`, `.note-card:focus-visible`, `.note-card.selected` currently target the button itself). → **Mitigation**: move `:hover`/`:focus-visible` styling to target `.card-open`, keep `.note-card`'s border/background/radius on the outer `<div>` so the card's overall look (including the `selected` state) is visually unchanged; verify manually against the two-panel layout at 320px width per the existing responsive constraint.
- **[Risk]** A card that both opens a note (title/preview click) and filters (tag click) could confuse users about what a click on the card "does." → **Mitigation**: this is the exact behavior the user explicitly chose (tag-chip-click-to-filter) after seeing the alternative (a separate always-visible tag bar); the visual distinction between the open-target area and the tag row, plus the new `selected` ring, keeps the two actions legible.
- **[Risk]** Active tag filters are per-mount transient state; navigating away and back (e.g. a full reload) silently clears them with no message. → **Mitigation**: matches existing `searchQuery` behavior (also cleared on reload), so this is consistent with an established pattern rather than a new inconsistency.
