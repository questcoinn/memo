<script lang="ts">
  import { parseBody, type BodyLine } from '../notes/body-format'

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

  function renderAll(body: string) {
    if (!containerEl) return
    containerEl.replaceChildren()
    for (const line of parseBody(body)) {
      containerEl.appendChild(createLineElement(line))
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
    const textNode = lineEl.firstChild
    const range = document.createRange()
    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      range.setStart(textNode, Math.min(offset, textNode.textContent?.length ?? 0))
    } else {
      range.selectNodeContents(lineEl)
    }
    range.collapse(true)
    const selection = document.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
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
    // List items don't restore their marker text; headings still do here
    // (only reached when empty, with no preceding line).
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

    // Enter on an empty list item exits list formatting instead of creating
    // another empty item.
    if (currentType === 'list-item' && text.length === 0) {
      lineEl.dataset.lineType = 'paragraph'
      delete lineEl.dataset.depth
      applyLineClass(lineEl)
      placeCaret(lineEl, true)
      activeLineEl = lineEl
      return
    }

    // Enter at the start of a heading pushes it down (a blank line is
    // inserted above) instead of splitting its text away. List items are
    // excluded — splitting into two list items below keeps the list intact.
    if (offset === 0 && text.length > 0 && currentType !== 'list-item') {
      const blank = createLineElement({ type: 'paragraph', text: '' })
      lineEl.before(blank)
      placeCaret(lineEl, true)
      activeLineEl = lineEl
      return
    }

    const before = offset >= 0 ? text.slice(0, offset) : text
    const after = offset >= 0 ? text.slice(offset) : ''
    setLineContent(lineEl, before)

    const newLine: BodyLine =
      currentType === 'list-item'
        ? { type: 'list-item', text: after, depth: Number(lineEl.dataset.depth ?? '0') }
        : { type: 'paragraph', text: after }
    const newEl = createLineElement(newLine)
    lineEl.after(newEl)
    placeCaret(newEl, true)
    activeLineEl = newEl
  }

  function handleInput() {
    // Editing a reverted line again makes it eligible for confirmation again.
    const lineEl = currentLineEl()
    if (lineEl) delete lineEl.dataset.reverted
    emit()
  }

  function handleKeydown(event: KeyboardEvent) {
    // Reading textContent mid-composition races the IME's commit and can
    // corrupt/duplicate the composing text.
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
      emit()
      return
    }

    if (event.key === 'Backspace') {
      const selection = document.getSelection()
      const offset = caretOffsetInLine(lineEl)
      // Only a collapsed caret triggers revert/delete; a selection should
      // just delete its text normally.
      if (selection?.isCollapsed && offset === 0 && lineEl.dataset.lineType !== 'paragraph') {
        event.preventDefault()
        const isEmptyLine = (lineEl.textContent ?? '').length === 0
        const prevEl = lineEl.previousElementSibling as HTMLElement | null

        if (isEmptyLine) {
          if (prevEl) {
            lineEl.remove()
            placeCaret(prevEl, false)
            activeLineEl = prevEl
          } else {
            revertLine(lineEl)
            placeCaret(lineEl, true)
          }
        } else if (lineEl.dataset.lineType === 'heading' && prevEl) {
          if (prevEl.dataset.lineType === 'paragraph' && (prevEl.textContent ?? '').length === 0) {
            // Empty spacer line above — remove it, leave the heading untouched.
            prevEl.remove()
            placeCaret(lineEl, true)
            activeLineEl = lineEl
          } else {
            // Otherwise merge this heading's text into the end of the line
            // above, dropping its heading style.
            const mergeOffset = (prevEl.textContent ?? '').length
            setLineContent(prevEl, (prevEl.textContent ?? '') + (lineEl.textContent ?? ''))
            lineEl.remove()
            placeCaretAtOffset(prevEl, mergeOffset)
            activeLineEl = prevEl
          }
        } else if (lineEl.dataset.lineType === 'list-item') {
          // List items revert in place instead of merging; revertLine()
          // leaves the bare text, no marker.
          revertLine(lineEl)
          placeCaret(lineEl, true)
        }
        // No preceding line at all — Backspace does nothing.

        emit()
      }
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      // Enter is a focus-loss trigger too — confirm the line before
      // splitting it, like Tab would.
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
    // A reverted line shouldn't silently re-confirm from a passive trigger
    // (focus loss, arrow keys) — only Tab should undo a revert.
    if (lineEl?.dataset.reverted === 'true') return false
    return confirmLine(lineEl)
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
</style>
