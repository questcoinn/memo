export type BodyLine =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list-item'; text: string; depth: number }

const MAX_LIST_DEPTH = 3

export function parseBody(body: string): BodyLine[] {
  return body.split('\n').map(parseLine)
}

function parseLine(line: string): BodyLine {
  if (line.startsWith('## ')) {
    return { type: 'heading', text: line.slice(3) }
  }
  const listMatch = line.match(/^( *)- (.*)$/)
  if (listMatch) {
    const depth = Math.min(MAX_LIST_DEPTH, Math.floor(listMatch[1].length / 2))
    return { type: 'list-item', text: listMatch[2], depth }
  }
  return { type: 'paragraph', text: line }
}

export function serializeLines(lines: BodyLine[]): string {
  return lines.map(serializeLine).join('\n')
}

function serializeLine(line: BodyLine): string {
  if (line.type === 'heading') return `## ${line.text}`
  if (line.type === 'list-item') return `${'  '.repeat(line.depth)}- ${line.text}`
  return line.text
}
