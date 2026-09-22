<script lang="ts">
  interface Props {
    tags: string[]
    allTags: string[]
    onChange: (tags: string[]) => void
  }

  let { tags, allTags, onChange }: Props = $props()

  let inputValue = $state('')
  let highlightedIndex = $state(-1)
  let isComposing = false
  let inputEl: HTMLInputElement | undefined

  const suggestions = $derived.by(() => {
    const query = inputValue.trim().toLowerCase()
    if (!query) return []
    const currentLower = new Set(tags.map((tag) => tag.toLowerCase()))
    return allTags.filter(
      (tag) => tag.toLowerCase().includes(query) && !currentLower.has(tag.toLowerCase()),
    )
  })

  $effect(() => {
    if (highlightedIndex >= suggestions.length) highlightedIndex = suggestions.length - 1
  })

  function addTag(rawName: string) {
    const name = rawName.trim()
    inputValue = ''
    highlightedIndex = -1
    if (!name) return
    const lower = name.toLowerCase()
    if (tags.some((tag) => tag.toLowerCase() === lower)) return
    onChange([...tags, name])
  }

  function selectSuggestion(name: string) {
    addTag(name)
    inputEl?.focus()
  }

  function removeTagAt(index: number) {
    onChange(tags.filter((_, i) => i !== index))
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (event.isComposing || isComposing) return
      event.preventDefault()
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        selectSuggestion(suggestions[highlightedIndex])
      } else {
        addTag(inputValue)
      }
      return
    }
    if (event.key === 'Backspace' && inputValue === '') {
      if (tags.length > 0) removeTagAt(tags.length - 1)
      return
    }
    if (event.key === 'ArrowDown' && suggestions.length > 0) {
      event.preventDefault()
      highlightedIndex = (highlightedIndex + 1) % suggestions.length
      return
    }
    if (event.key === 'ArrowUp' && suggestions.length > 0) {
      event.preventDefault()
      highlightedIndex = highlightedIndex <= 0 ? suggestions.length - 1 : highlightedIndex - 1
      return
    }
    if (event.key === 'Escape') {
      highlightedIndex = -1
    }
  }

  function handleInput() {
    highlightedIndex = -1
  }
</script>

<div class="tag-input">
  <ul class="chip-list">
    {#each tags as tag, index (tag)}
      <li class="chip">
        <span class="chip-label">{tag}</span>
        <button
          type="button"
          class="chip-remove"
          aria-label={`${tag} 태그 삭제`}
          onclick={() => removeTagAt(index)}
        >
          ×
        </button>
      </li>
    {/each}
    <li class="input-item">
      <input
        bind:this={inputEl}
        type="text"
        class="text-input"
        placeholder={tags.length === 0 ? '태그 추가' : ''}
        bind:value={inputValue}
        oninput={handleInput}
        onkeydown={handleKeydown}
        oncompositionstart={() => (isComposing = true)}
        oncompositionend={() => (isComposing = false)}
        role="combobox"
        aria-expanded={suggestions.length > 0}
        aria-controls="tag-suggestions"
        aria-activedescendant={highlightedIndex >= 0 ? `tag-suggestion-${highlightedIndex}` : undefined}
        aria-autocomplete="list"
      />
    </li>
  </ul>
  {#if suggestions.length > 0}
    <ul class="suggestion-list" id="tag-suggestions" role="listbox">
      {#each suggestions as suggestion, index (suggestion)}
        <li
          id={`tag-suggestion-${index}`}
          role="option"
          aria-selected={index === highlightedIndex}
          class="suggestion"
          class:highlighted={index === highlightedIndex}
        >
          <button
            type="button"
            class="suggestion-button"
            onclick={() => selectSuggestion(suggestion)}
          >
            {suggestion}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .tag-input {
    position: relative;
  }

  .chip-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-sm);
    list-style: none;
    margin: 0;
    padding: var(--spacing-sm);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .chip-list:focus-within {
    border-color: var(--color-primary);
  }

  .chip {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    background: var(--color-weak-background);
    color: var(--color-weak-foreground);
    border-radius: var(--radius-sm);
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .chip-label {
    font-size: var(--typography-body-small-size);
    font-weight: var(--typography-body-small-weight);
    line-height: var(--typography-body-small-line-height);
  }

  .chip-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--color-weak-foreground);
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
  }

  .chip-remove:hover {
    background: rgba(27, 100, 218, 0.12);
  }

  .chip-remove:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .input-item {
    flex: 1;
    min-width: 96px;
  }

  .text-input {
    width: 100%;
    font-family: inherit;
    font-size: var(--typography-body-size);
    font-weight: var(--typography-body-weight);
    line-height: var(--typography-body-line-height);
    color: var(--color-foreground);
    background: transparent;
    border: none;
  }

  .text-input:focus {
    outline: none;
  }

  .suggestion-list {
    position: absolute;
    z-index: 1;
    top: calc(100% + var(--spacing-xs));
    left: 0;
    right: 0;
    margin: 0;
    padding: var(--spacing-xs);
    list-style: none;
    background: var(--color-canvas);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: none;
    max-height: 200px;
    overflow-y: auto;
  }

  .suggestion-button {
    width: 100%;
    text-align: left;
    font-family: inherit;
    font-size: var(--typography-body-small-size);
    font-weight: var(--typography-body-small-weight);
    line-height: var(--typography-body-small-line-height);
    color: var(--color-foreground);
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    padding: var(--spacing-sm);
    cursor: pointer;
  }

  .suggestion.highlighted .suggestion-button,
  .suggestion-button:hover {
    background: var(--color-weak-background);
    color: var(--color-weak-foreground);
  }
</style>
