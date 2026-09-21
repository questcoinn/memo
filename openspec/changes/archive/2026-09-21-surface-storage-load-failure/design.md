## Context

`LocalStorageNoteStore` (`src/lib/notes/local-storage-store.ts`) keeps every note in a single JSON array under one `localStorage` key (`memo.notes.v1`). Its private `readAll()` helper is called by all four `NoteStore` methods (`list`, `get`, `save`, `remove`); today, if the stored string fails `JSON.parse` or doesn't parse to an array, it silently returns `[]` — identical to the genuinely-empty case. See proposal.md - Why for the two concrete failure modes this causes (indistinguishable-from-empty display, and permanent destruction of the corrupted bytes on the next save).

## Goals / Non-Goals

**Goals:**
- Make a load failure distinguishable from "no notes yet" at the UI layer.
- Preserve the original unreadable bytes before anything can overwrite them.
- Keep every other operation (create/edit/delete) working normally after a load failure — nothing should be blocked waiting for the user to do anything about it.

**Non-Goals:**
- No *parsed* recovery/import flow — the app never tries to interpret the corrupted bytes as notes data and offer to restore them (see Decisions for what it does show instead).
- No automatic cleanup of the backup key — it stays in `localStorage` indefinitely once written. See Risks.
- No change to `NoteStore`'s method signatures (`list(): Promise<Note[]>` etc.) — see Decisions for why the existing shape is sufficient.

## Decisions

### Only `list()` throws on corruption; `get`/`save`/`remove` treat it as empty
All four methods read through the same corrupted key, but only `list()` is ever awaited from a context that should surface a user-visible failure (`App.svelte`'s `onMount`, the same place that already has no prior state to protect). `get`, `save`, and `remove` must keep working after that point — a user creating their first post-corruption note calls `save()`, which internally reads the same corrupted key; if `save()` also threw here, note-taking itself would be blocked by the very failure this change exists to avoid making worse. So: reading corrupted data resolves to `[]` everywhere, and only `list()` additionally throws a descriptive `Error` (mirroring the existing `writeAll()` pattern that `persistDraft()` in `App.svelte` already catches for save failures — this reuses that exact error-catching shape, no new error-handling pattern needed in `App.svelte`).

This is naturally self-healing: as soon as any `save()` succeeds, `writeAll()` overwrites the corrupted key with valid JSON, and every subsequent `readAll()` — including the next `list()` — parses normally. Nothing needs to track "has the user seen the error" — the error simply stops being true once real data exists again. A page reload before any save still shows the failure message again, which is correct: the stored data is, in fact, still unreadable.

### Backing up the raw string happens on every detected corruption, not just once
The corrupted string is copied verbatim to a second key (e.g. `memo.notes.v1.corrupted-backup`) every time it's detected, unconditionally overwriting whatever was backed up before. Considered only backing up when no backup exists yet, to avoid redundant writes — rejected: between two corruption events (rare, but the key could theoretically get overwritten with different garbage more than once before a successful save) the *current* corrupted content is the one worth preserving, not a stale first copy. Because the corrupted content doesn't change between reads until a `save()` succeeds, the "redundant" writes in the common case are writing identical bytes anyway, so there's no real cost to keeping this unconditional.

### Error message content
Following `DESIGN.md`'s voice rules (short, direct, always says the next step) and the existing save-failure message's tone (`메모를 저장하지 못했어요.` in `NoteEditPanel.svelte`): something like `메모를 불러오지 못했어요. 저장된 데이터에 문제가 있는 것 같아요.`, with the list panel's existing "새 메모" button remaining visible and functional right below it so the recovery path (keep using the app) is visually obvious rather than stated separately.

### The right panel shows the raw backup as read-only text, not a recovery flow
After seeing the load-failure message in place, the natural follow-up question is "so where did my data go?" — the backup key (above) answers that for anyone who opens dev tools, but that's not a reasonable expectation for most users. Instead, `NoteEditPanel`'s existing "select a note or start a new one" placeholder (shown whenever `draft === null`) is replaced by the raw backed-up string plus a "복사" button (`navigator.clipboard.writeText`, silently falling back to "just leave the text selectable" if clipboard access is denied) whenever a load error just occurred. This is deliberately *not* a recovery/import feature: the app never tries to parse or interpret the bytes, it only displays them — the user decides what, if anything, to do with them (paste into a text editor, search for fragments, discard). `getCorruptedBackup()` is exported as a small standalone function from `local-storage-store.ts` (not a `NoteStore` method) since it's a debugging affordance specific to this storage backend, not a capability every future `NoteStore` implementation needs to have.

### No `NoteStore` interface change
`list(): Promise<Note[]>` already supports "throws on failure to load" — that's a normal rejected Promise, the same shape any real network-backed implementation would use for its own load failures. Nothing about this fix is specific to `localStorage`; a future backend-backed `NoteStore` would report its own load failures the same way, through the same `try/catch` this change adds to `App.svelte`.

## Risks / Trade-offs

- **[Risk] If `localStorage` is completely full, the backup write can also fail.** → Accepted: this is best-effort (wrapped in its own `try`/`catch` so a failed backup never prevents the corruption itself from being reported and handled); there is no lower-level fallback available from a browser tab.
- **[Trade-off] The backup key is never cleaned up automatically**, so a device that corrupts its data once carries a small permanent extra `localStorage` entry forever after. → Accepted: at personal-note-app scale this is a few KB at most, and silently deleting a user's only remaining copy of their old (corrupted) data on their behalf is worse than leaving an inert key behind.
- **[Trade-off] The backup is opaque raw text, not something the app can offer to restore automatically** — by definition, it failed to parse as valid notes data. A technically inclined user could still open it from dev tools and attempt manual recovery. → Accepted per Non-Goals; building an actual recovery/import flow is a larger, separate feature if this ever proves worth it.
