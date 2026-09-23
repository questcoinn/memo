## 1. Restructure NoteCard for independent tag buttons

- [x] 1.1 Change `.note-card`'s root element in [NoteCard.svelte](../../../src/lib/components/NoteCard.svelte) from `<button>` to a non-interactive `<div>` carrying today's card styling (border, radius, padding, `selected` state); add an inner `<button class="card-open">` wrapping title/preview/timestamp that calls `onSelect`, reset so the visual layout is unchanged from today.
- [x] 1.2 Move the tag list out of `card-open` into a sibling `<div class="tag-row">`, and change each `<li class="tag">` into a `<button class="tag">` — verify via `svelte-check` (`npm run check`) that there is no nested-interactive-element warning and by inspecting rendered HTML that no `<button>` is nested inside another.
- [x] 1.3 Add `activeTags: Set<string>` and `onToggleTag: (tag: string) => void` props to `NoteCard`; clicking a tag button calls `onToggleTag(tag)` and does not call `onSelect` — verify by clicking a tag in the running app and confirming the edit panel does not open.
- [x] 1.4 Style the selected-tag state: keep the existing weak-background/weak-foreground chip fill, add a `2px solid var(--color-primary)` ring when `activeTags.has(tag)` — verify visually that an active tag looks distinct from an inactive one on the same card.

## 2. Active tag filter state and combined matching in NoteListPanel

- [x] 2.1 Add `activeTags = $state<Set<string>>(new Set())` to [NoteListPanel.svelte](../../../src/lib/components/NoteListPanel.svelte) with a toggle function that adds/removes a tag (case as stored, comparisons case-insensitive) and pass `activeTags` + the toggle callback down to each `NoteCard`.
- [x] 2.2 Extend `matches(note, query, activeTags)` so a note must satisfy the existing keyword AND-of-words rule AND have every tag in `activeTags` (case-insensitive) — verify with two notes sharing one tag but not another that selecting both tags shows only the note with both.
- [x] 2.3 Verify combined keyword + tag filtering in the running app: type a keyword, activate a tag, confirm only notes matching both remain, in either order of activation.

## 3. Active-filter display

- [x] 3.1 Add an active-filter row in `NoteListPanel`, shown only when `activeTags.size > 0`, positioned near the search field; render one removable chip per active tag (reusing the `chip`/`chip-remove` visual pattern from [TagInput.svelte](../../../src/lib/components/TagInput.svelte) without importing it) plus a clear-all control.
- [x] 3.2 Wire each chip's remove control and the clear-all control to update `activeTags` — verify that removing one tag from the row leaves other active tags in place, and clear-all empties `activeTags` and hides the row.
- [x] 3.3 Verify the row stays visible and usable when the active filters match zero notes (no note card rendered to click a tag on) — confirm a tag can still be removed via the row in that state.

## 4. No-match messaging

- [x] 4.1 Update the list panel's empty-results branch so it covers "keyword matches nothing," "tag filter matches nothing," and "both combined match nothing," all showing the distinct no-match message (not the "no notes at all" message) — verify each of the three cases manually.

## 5. Design system sync

- [x] 5.1 Update the `tag` component's `Interaction kind` to `interactive` and make its `selected` state load-bearing in the System Graph draft (`.omd/system/graph.json`), following the project's compiler-based update flow (per design.md decision 5) rather than hand-editing [DESIGN.md](../../../DESIGN.md) — verify the regenerated DESIGN.md reflects the change and its bound hash in `.omd/system/manifest.json` is refreshed.
- [x] 5.2 Remove the now-superseded "Tags on a note card are descriptive, not an interactive filter" line from DESIGN.md's `tag` component semantics/rules via the same regeneration flow, keeping DESIGN.md and the delta spec's REMOVED requirement in agreement.

## 6. Final verification

- [x] 6.1 Run `npm run check` and confirm it passes with no new type or Svelte diagnostics.
- [x] 6.2 Manually test at 320px viewport width (per the project's responsive constraint) that the active-filter row and tag chips reflow without horizontal scrolling.
- [x] 6.3 Manually confirm keyboard access: tabbing reaches `card-open`, each tag button, and each active-filter chip's controls as separate stops, and Enter/Space activates each. Tab order verified via focus-order inspection in the running app. Enter/Space activation could not be mechanically driven through the browser-automation tool in this session (confirmed environment-level: even a bare vanilla `<button onclick>` created for a control test did not register a synthetic Space keypress here) — activation is nonetheless guaranteed because `card-open` and each `.tag` are real native `<button>` elements (design.md decision 1's whole rationale for avoiding `role="button"` divs), which get Enter/Space activation from the browser for free with no custom key handling in this codebase to get wrong.
