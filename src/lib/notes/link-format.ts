export type Run = { type: 'text'; value: string } | { type: 'link'; url: string }

const URL_PATTERN = /(https?:\/\/|www\.)\S+/g

export function splitIntoRuns(text: string): Run[] {
  const runs: Run[] = []
  let lastIndex = 0

  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index ?? 0
    if (start > lastIndex) {
      runs.push({ type: 'text', value: text.slice(lastIndex, start) })
    }
    runs.push({ type: 'link', url: match[0] })
    lastIndex = start + match[0].length
  }

  if (lastIndex < text.length) {
    runs.push({ type: 'text', value: text.slice(lastIndex) })
  }

  if (runs.length === 0) runs.push({ type: 'text', value: '' })

  return runs
}
