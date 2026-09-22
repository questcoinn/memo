<script lang="ts">
  import { parseBody, type BodyLine } from '../notes/body-format'
  import { splitIntoRuns } from '../notes/link-format'

  interface Props {
    value: string
    placeholder?: string
    onInput: (newBody: string) => void
  }

  let { value, placeholder, onInput }: Props = $props()

  const isEmpty = $derived(value.trim().length === 0)

  const MAX_DEPTH = 3

  let containerEl: HTMLDivElement | undefined
  let lastEmitted: string | null = null
  let activeLineEl: HTMLElement | null = null

  function applyLineClass(el: HTMLElement) {
    const type = el.dataset.lineType
    el.className = 'line'
    if (type === 'heading') {
      el.classList.add('line-heading')
      el.style.marginLeft = ''
    } else if (type === 'list-item') {
      el.classList.add('line-list-item')
      const depth = Number(el.dataset.depth ?? '0')
      el.style.marginLeft = `calc(var(--spacing-lg) * ${depth})`
    } else {
      el.classList.add('line-paragraph')
      el.style.marginLeft = ''
    }
  }

  function setLineContent(el: HTMLElement, text: string) {
    el.textContent = text
    if (text.length === 0) el.appendChild(document.createElement('br'))
  }

  function createLineElement(line: BodyLine): HTMLDivElement {
    const el = document.createElement('div')
    el.dataset.lineType = line.type
    if (line.type === 'list-item') el.dataset.depth = String(line.depth)
    applyLineClass(el)
    setLineContent(el, line.text)
    return el
  }

  function createLinkElement(url: string): HTMLAnchorElement {
    const a = document.createElement('a')
    a.href = url.startsWith('www.') ? `https://${url}` : url
    a.textContent = url
    a.contentEditable = 'false'
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.className = 'inline-link'
    return a
  }

  // Independent of confirmLine — a link can appear in any line type, confirmed or not.
  function confirmLinks(lineEl: HTMLElement) {
    // Replacing a text node the caret points into resets the selection, so capture/restore it.
    const selection = document.getSelection()
    const caretWasHere =
      selection !== null && selection.rangeCount > 0 && lineEl.contains(selection.getRangeAt(0).startContainer)
    const preservedOffset = caretWasHere ? caretOffsetInLine(lineEl) : -1

    let changed = false
    for (const child of Array.from(lineEl.childNodes)) {
      if (child.nodeType !== Node.TEXT_NODE) continue
      const runs = splitIntoRuns(child.textContent ?? '')
      if (runs.length === 1 && runs[0].type === 'text') continue
      const replacement = runs.map((run) =>
        run.type === 'link' ? createLinkElement(run.url) : document.createTextNode(run.value),
      )
      child.replaceWith(...replacement)
      changed = true
    }

    if (changed && preservedOffset >= 0) {
      placeCaretAtOffset(lineEl, preservedOffset)
    }
  }

  function linkImmediatelyBefore(range: Range): HTMLAnchorElement | null {
    const { startContainer, startOffset } = range
    if (startContainer.nodeType === Node.TEXT_NODE) {
      if (startOffset !== 0) return null
      const prev = startContainer.previousSibling
      return prev instanceof HTMLAnchorElement ? prev : null
    }
    if (startContainer.nodeType === Node.ELEMENT_NODE) {
      const prev = startContainer.childNodes[startOffset - 1]
      return prev instanceof HTMLAnchorElement ? prev : null
    }
    return null
  }

  // Moves child nodes onto prevEl (not via .textContent) so links on either side survive.
  function mergeLineIntoPrevious(lineEl: HTMLElement, prevEl: HTMLElement) {
    const mergeOffset = prevEl.textContent?.length ?? 0
    if (mergeOffset === 0) prevEl.replaceChildren() // drop prevEl's own empty-line <br> placeholder
    for (const child of Array.from(lineEl.childNodes)) {
      if (child instanceof HTMLBRElement) continue // lineEl's own empty-line placeholder, if any
      prevEl.appendChild(child)
    }
    if (prevEl.childNodes.length === 0) prevEl.appendChild(document.createElement('br'))
    lineEl.remove()
    placeCaretAtOffset(prevEl, mergeOffset)
    activeLineEl = prevEl
  }

  function renderAll(body: string) {
    if (!containerEl) return
    containerEl.replaceChildren()
    for (const line of parseBody(body)) {
      const el = createLineElement(line)
      confirmLinks(el)
      containerEl.appendChild(el)
    }
    activeLineEl = null
  }

  $effect(() => {
    if (value !== lastEmitted) {
      renderAll(value)
      lastEmitted = value
    }
  })

  function serializeDom(): string {
    if (!containerEl) return ''
    return Array.from(containerEl.children)
      .map((child) => {
        const el = child as HTMLElement
        const type = el.dataset.lineType ?? 'paragraph'
        const text = el.textContent ?? ''
        if (type === 'heading') return `## ${text}`
        if (type === 'list-item') {
          const depth = Number(el.dataset.depth ?? '0')
          return `${'  '.repeat(depth)}- ${text}`
        }
        return text
      })
      .join('\n')
  }

  function emit() {
    const body = serializeDom()
    lastEmitted = body
    onInput(body)
  }

  function lineElementOf(node: Node | null): HTMLElement | null {
    let current: Node | null = node
    while (current && current !== containerEl) {
      if (current instanceof HTMLElement && current.parentElement === containerEl) return current
      current = current.parentElement
    }
    return null
  }

  function currentLineEl(): HTMLElement | null {
    const selection = document.getSelection()
    if (!selection || selection.rangeCount === 0) return null
    return lineElementOf(selection.getRangeAt(0).startContainer)
  }

  function caretOffsetInLine(lineEl: HTMLElement): number {
    const selection = document.getSelection()
    if (!selection || selection.rangeCount === 0) return -1
    const range = selection.getRangeAt(0)
    if (!lineEl.contains(range.startContainer)) return -1
    const preRange = range.cloneRange()
    preRange.selectNodeContents(lineEl)
    preRange.setEnd(range.startContainer, range.startOffset)
    return preRange.toString().length
  }

  function placeCaret(lineEl: HTMLElement, atStart: boolean) {
    const range = document.createRange()
    range.selectNodeContents(lineEl)
    range.collapse(atStart)
    const selection = document.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }

  function placeCaretAtOffset(lineEl: HTMLElement, offset: number) {
    let remaining = Math.max(0, offset)
    const selection = document.getSelection()
    const range = document.createRange()

    for (const child of Array.from(lineEl.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const len = child.textContent?.length ?? 0
        if (remaining <= len) {
          range.setStart(child, remaining)
          range.collapse(true)
          selection?.removeAllRanges()
          selection?.addRange(range)
          return
        }
        remaining -= len
      } else {
        // Atomic children are never entered — snap before one if the offset lands at/inside it.
        const len = child.textContent?.length ?? 0
        if (remaining <= 0 || remaining < len) {
          range.setStartBefore(child)
          range.collapse(true)
          selection?.removeAllRanges()
          selection?.addRange(range)
          return
        }
        remaining -= len
      }
    }

    placeCaret(lineEl, false)
  }

  function parseLineForConfirm(text: string): { type: 'heading' | 'list-item'; text: string } | null {
    if (text.startsWith('## ')) return { type: 'heading', text: text.slice(3) }
    if (text.startsWith('- ')) return { type: 'list-item', text: text.slice(2) }
    return null
  }

  function confirmLine(lineEl: HTMLElement | null): boolean {
    if (!lineEl) return false
    const currentType = lineEl.dataset.lineType ?? 'paragraph'
    if (currentType !== 'paragraph') return false
    const parsed = parseLineForConfirm(lineEl.textContent ?? '')
    if (!parsed) return false
    lineEl.dataset.lineType = parsed.type
    if (parsed.type === 'list-item') lineEl.dataset.depth = '0'
    applyLineClass(lineEl)
    setLineContent(lineEl, parsed.text)
    return true
  }

  function revertLine(lineEl: HTMLElement) {
    const type = lineEl.dataset.lineType
    const text = lineEl.textContent ?? ''
    // List items don't restore their marker text; headings still do (empty, no preceding line only).
    const restored = type === 'heading' ? `## ${text}` : text
    lineEl.dataset.lineType = 'paragraph'
    delete lineEl.dataset.depth
    lineEl.dataset.reverted = 'true'
    applyLineClass(lineEl)
    setLineContent(lineEl, restored)
  }

  function changeDepth(lineEl: HTMLElement, delta: 1 | -1): boolean {
    if (lineEl.dataset.lineType !== 'list-item') return false
    const depth = Number(lineEl.dataset.depth ?? '0')
    const next = depth + delta
    if (next < 0 || next > MAX_DEPTH) return true
    lineEl.dataset.depth = String(next)
    applyLineClass(lineEl)
    return true
  }

  function splitLine(lineEl: HTMLElement) {
    const offset = caretOffsetInLine(lineEl)
    const text = lineEl.textContent ?? ''
    const currentType = lineEl.dataset.lineType ?? 'paragraph'

    // Enter on an empty list item exits list formatting instead of creating another item.
    if (currentType === 'list-item' && text.length === 0) {
      lineEl.dataset.lineType = 'paragraph'
      delete lineEl.dataset.depth
      applyLineClass(lineEl)
      placeCaret(lineEl, true)
      activeLineEl = lineEl
      return
    }

    // Enter at the start of a heading pushes it down; list items split into two items instead.
    if (offset === 0 && text.length > 0 && currentType !== 'list-item') {
      const blank = createLineElement({ type: 'paragraph', text: '' })
      lineEl.before(blank)
      placeCaret(lineEl, true)
      activeLineEl = lineEl
      return
    }

    // DOM-level split (not flattened-string) so a link before the caret survives.
    const clampedOffset = offset >= 0 ? offset : text.length
    const { keepInBefore, moveToAfter } = splitLineNodes(lineEl, clampedOffset)
    lineEl.replaceChildren(...keepInBefore)
    if (keepInBefore.length === 0) lineEl.appendChild(document.createElement('br'))

    const after = moveToAfter.map((node) => node.textContent ?? '').join('')
    const newLine: BodyLine =
      currentType === 'list-item'
        ? { type: 'list-item', text: after, depth: Number(lineEl.dataset.depth ?? '0') }
        : { type: 'paragraph', text: after }
    const newEl = createLineElement(newLine)
    lineEl.after(newEl)
    placeCaret(newEl, true)
    activeLineEl = newEl
  }

  // Splits at offset: a straddling text node is split; an atomic link is never split mid-span.
  function splitLineNodes(lineEl: HTMLElement, offset: number): { keepInBefore: Node[]; moveToAfter: Node[] } {
    const keepInBefore: Node[] = []
    const moveToAfter: Node[] = []
    let remaining = offset
    let pastSplit = false

    for (const child of Array.from(lineEl.childNodes)) {
      if (pastSplit) {
        moveToAfter.push(child)
        continue
      }
      const len = child.textContent?.length ?? 0
      if (remaining >= len) {
        keepInBefore.push(child)
        remaining -= len
        continue
      }
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? ''
        const beforeText = text.slice(0, remaining)
        const afterText = text.slice(remaining)
        if (beforeText) keepInBefore.push(document.createTextNode(beforeText))
        if (afterText) moveToAfter.push(document.createTextNode(afterText))
      } else {
        moveToAfter.push(child)
      }
      pastSplit = true
    }

    return { keepInBefore, moveToAfter }
  }

  function handleInput() {
    // Editing a reverted line again makes it eligible for confirmation again.
    const lineEl = currentLineEl()
    if (lineEl) delete lineEl.dataset.reverted
    emit()
  }

  function handleKeydown(event: KeyboardEvent) {
    // Reading textContent mid-composition races the IME's commit and can corrupt the text.
    if (event.isComposing) return

    const lineEl = currentLineEl()
    if (!lineEl) return

    if (event.key === 'Tab') {
      event.preventDefault()
      if (lineEl.dataset.lineType === 'list-item') {
        changeDepth(lineEl, event.shiftKey ? -1 : 1)
      } else if (!event.shiftKey && confirmLine(lineEl)) {
        placeCaret(lineEl, false)
      }
      confirmLinks(lineEl)
      emit()
      return
    }

    if (event.key === 'Backspace') {
      const selection = document.getSelection()
      const offset = caretOffsetInLine(lineEl)

      // A confirmed link is atomic — Backspace right after one deletes it whole (never at offset 0).
      if (selection?.isCollapsed && offset > 0) {
        const range = selection.getRangeAt(0)
        const precedingLink = linkImmediatelyBefore(range)
        if (precedingLink) {
          event.preventDefault()
          const linkLength = precedingLink.textContent?.length ?? 0
          precedingLink.remove()
          placeCaretAtOffset(lineEl, offset - linkLength)
          emit()
          return
        }
      }

      // Only a collapsed caret triggers revert/delete/merge; a selection just deletes normally.
      if (selection?.isCollapsed && offset === 0) {
        event.preventDefault()
        const isEmptyLine = (lineEl.textContent ?? '').length === 0
        const prevEl = lineEl.previousElementSibling as HTMLElement | null
        const lineType = lineEl.dataset.lineType ?? 'paragraph'

        if (lineType === 'paragraph') {
          // No marker to revert to — merge into the previous line (native div-merge corrupts links).
          if (prevEl) mergeLineIntoPrevious(lineEl, prevEl)
        } else if (isEmptyLine) {
          if (prevEl) {
            lineEl.remove()
            placeCaret(prevEl, false)
            activeLineEl = prevEl
          } else {
            revertLine(lineEl)
            placeCaret(lineEl, true)
          }
        } else if (lineType === 'heading' && prevEl) {
          if (prevEl.dataset.lineType === 'paragraph' && (prevEl.textContent ?? '').length === 0) {
            // Empty spacer line above — remove it, leave the heading untouched.
            prevEl.remove()
            placeCaret(lineEl, true)
            activeLineEl = lineEl
          } else {
            // Otherwise merge into the line above, dropping the heading style.
            mergeLineIntoPrevious(lineEl, prevEl)
          }
        } else if (lineType === 'list-item') {
          // List items revert in place instead of merging; revertLine() leaves bare text, no marker.
          revertLine(lineEl)
          placeCaret(lineEl, true)
        }
        // A heading with no previous line has nothing to merge into — Backspace is a no-op.

        emit()
      }
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      // Enter is a focus-loss trigger too — confirm the line before splitting it, like Tab would.
      const rawText = lineEl.textContent ?? ''
      const preOffset = caretOffsetInLine(lineEl)
      if (confirmOnLeave(lineEl)) {
        const markerLength = rawText.length - (lineEl.textContent?.length ?? 0)
        placeCaretAtOffset(lineEl, Math.max(0, preOffset - markerLength))
      }
      splitLine(lineEl)
      emit()
    }
  }

  function confirmOnLeave(lineEl: HTMLElement | null): boolean {
    if (!lineEl) return false
    // A reverted line shouldn't silently re-confirm from a passive trigger — only Tab can.
    const confirmed = lineEl.dataset.reverted === 'true' ? false : confirmLine(lineEl)
    // Must run after confirmLine, whose setLineContent() would wipe out any link structure.
    confirmLinks(lineEl)
    return confirmed
  }

  function handleClick(event: MouseEvent) {
    const target = event.target
    const link = target instanceof Element ? target.closest('a.inline-link') : null
    if (!(link instanceof HTMLAnchorElement)) return
    // contenteditable="false" doesn't block the <a>'s native navigation — always prevent it.
    event.preventDefault()
    if (event.metaKey || event.ctrlKey) {
      window.open(link.href, '_blank', 'noopener,noreferrer')
    }
  }

  function handlePaste(event: ClipboardEvent) {
    // Default paste can wrap text in a <span>, invisible to confirmLinks — force plain-text insertion.
    event.preventDefault()
    const text = event.clipboardData?.getData('text/plain') ?? ''
    if (text) document.execCommand('insertText', false, text)
  }

  function handleFocusOut() {
    if (confirmOnLeave(activeLineEl)) emit()
    activeLineEl = null
  }

  function handleSelectionChange() {
    if (!containerEl || document.activeElement !== containerEl) return
    const nowLineEl = currentLineEl()
    if (nowLineEl === activeLineEl) return
    if (confirmOnLeave(activeLineEl)) emit()
    activeLineEl = nowLineEl
  }

  $effect(() => {
    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  })
</script>

<div class="body-editor-wrapper">
  <div
    bind:this={containerEl}
    class="body-editor"
    contenteditable="true"
    role="textbox"
    tabindex="0"
    aria-multiline="true"
    aria-label="메모 본문"
    oninput={handleInput}
    onkeydown={handleKeydown}
    onclick={handleClick}
    onpaste={handlePaste}
    onfocusout={handleFocusOut}
  ></div>
  {#if isEmpty && placeholder}
    <p class="body-editor-placeholder">{placeholder}</p>
  {/if}
</div>

<style>
  .body-editor-wrapper {
    position: relative;
    flex: 1;
    display: flex;
    min-height: 0;
  }

  .body-editor {
    flex: 1;
    font-family: inherit;
    font-size: var(--typography-body-size);
    font-weight: var(--typography-body-weight);
    line-height: var(--typography-body-line-height);
    color: var(--color-body);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    overflow-y: auto;
  }

  .body-editor-placeholder {
    position: absolute;
    top: var(--spacing-lg);
    left: var(--spacing-lg);
    margin: 0;
    color: var(--color-muted);
    font-size: var(--typography-body-size);
    line-height: var(--typography-body-line-height);
    pointer-events: none;
  }

  .body-editor:focus-visible {
    outline: none;
    border-color: var(--color-primary);
  }

  .body-editor :global(.line) {
    min-height: 1em;
    white-space: pre-wrap;
  }

  .body-editor :global(.line-heading) {
    font-size: var(--typography-body-heading-size);
    font-weight: var(--typography-body-heading-weight);
    line-height: var(--typography-body-heading-line-height);
    color: var(--color-foreground);
  }

  .body-editor :global(.line-list-item) {
    position: relative;
    padding-left: var(--spacing-lg);
  }

  .body-editor :global(.line-list-item::before) {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--color-muted);
  }

  .body-editor :global(.inline-link) {
    color: var(--color-primary);
    text-decoration: underline;
    cursor: text;
  }

  .body-editor :global(.inline-link:hover) {
    color: var(--color-primary-hover);
  }

  .body-editor :global(.inline-link:focus-visible) {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
</style>
