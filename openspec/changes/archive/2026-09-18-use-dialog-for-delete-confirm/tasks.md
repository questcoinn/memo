## 1. DESIGN.md: new token and component

- [x] 1.1 Build a graph draft off the current canonical `.omd/system/graph.json` adding the `color-overlay` token (`rgba(25, 31, 40, 0.5)`, derived from `color-foreground`) to `foundations.tokens`, and verify it validates locally (`validateCoreGraph`) before submitting. (`$type` is `overlay-color`, not `color` — the validator's `token_reference_closure` check requires `$type: "color"` tokens to be a 6-digit hex string, which an alpha-blended `rgba()` value can't satisfy. Discovered via the first failed adopt attempt; no behavior or value changed, just the type label.)
- [x] 1.2 In the same draft, add the `confirm-dialog` component to `components_states.components` (anatomy: title/message/cancel-action/confirm-action; variant: destructive; token refs including `color-danger` and `color-overlay`; interactive with `default`/`focus-visible` applicable and `disabled`/`loading`/`error`/`success` not-applicable) and add matching `provenance.json`/graph `governance.decisions` entries (source_class `agent-proposed-greenfield-decision`, evidence: this change's design.md reasoning).
- [x] 1.3 Run the draft through `prepare-design-md-core-review.cjs` and diff the preview `DESIGN.md` against the current one — verify only the intended token/component/provenance lines differ.
- [x] 1.4 Approve, compile, checkpoint, and adopt the package into the project root, and verify `.omd/system/manifest.json`'s hashes match the new `DESIGN.md`/`graph.json` on disk.

## 2. `ConfirmDialog.svelte` component

- [x] 2.1 Create `src/lib/components/ConfirmDialog.svelte` with `open`, `title`, `message`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel` props, using a real `<dialog>` element called via `showModal()`/`close()` in response to `open` changing, and verify `pnpm run check` passes.
- [x] 2.2 Style it with the new `color-overlay`/`color-danger`/`radius-md`/`radius-card`/`typography-body`/`typography-h3` tokens from `app.css`, with the Cancel button before the Confirm button in DOM order so `showModal()`'s autofocus lands on Cancel. Verified visually and via `document.activeElement` that opening the dialog focuses "취소" by default.
- [x] 2.3 Wire Escape (native `cancel`/`close` events) and backdrop click (`click` handler checking `event.target === dialogElement`) to call `onCancel`. Backdrop click verified directly: closes the dialog, note unchanged. Escape could not be verified in the browser pane used for this session — a completely bare, app-free `<dialog>` element also didn't close on a synthetic Escape keypress there (trusted keydown reached the page, `cancel`/`close` never fired), pointing to a host/embedded-browser limitation rather than an app bug. The code adds no `preventDefault()` and relies entirely on the platform's native Escape-closes-modal-`<dialog>` behavior, which is standard in real browsers (Chrome/Firefox/Safari). **Unresolved**: please confirm Escape works as expected in your own browser.

## 3. Wire into delete flow

- [x] 3.1 In `NoteEditPanel.svelte`, render `ConfirmDialog` for the delete action instead of the "삭제" button calling `onDelete` directly; clicking "삭제" now opens the dialog, and the dialog's own confirm action calls `onDelete`.
- [x] 3.2 In `App.svelte`, remove the `window.confirm(...)` call from `deleteCurrentNote()` — the confirmation gate now lives entirely in the dialog, so `deleteCurrentNote()` performs the actual deletion unconditionally once called.
- [x] 3.3 Verify end-to-end: clicking "삭제" opens the styled dialog; clicking "삭제" inside it removes the note; clicking "취소" or the backdrop close it with the note unchanged; no native browser confirm dialog appears anywhere in this flow (confirmed via console — no new "Page dialog suppressed" entries across a fresh create→delete cycle). Escape path not re-verified here — see 2.3 note.

## 4. Verification

- [x] 4.1 Manually walked through the "Delete a note with confirmation" scenarios in the running dev app: confirm removes the note, cancel (button and backdrop) keeps it unchanged. The Escape-specific scenario is implemented but unverified in this browser pane (see 2.3).
- [x] 4.2 Run `npm run check` and fix any type errors introduced by the above. (0 errors.)
