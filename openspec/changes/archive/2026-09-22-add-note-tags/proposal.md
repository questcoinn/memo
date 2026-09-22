## Why

메모가 쌓일수록 제목/본문 검색만으로는 관련 메모를 묶어보기 어렵습니다. 메모에 태그를 붙이고 목록 카드에서 바로 확인할 수 있게 하여, 다시 찾고 정리하는 흐름을 보강합니다. DESIGN.md에는 이미 `tag` 컴포넌트(non-interactive, note-card의 `tag-list` anatomy)가 정의되어 있지만 실제 UI에는 아직 반영되어 있지 않습니다.

## What Changes

- `Note`에 `tags: string[]` 필드를 추가합니다. 기존 저장 데이터에 `tags`가 없으면 빈 배열로 취급합니다.
- 메모 편집 화면(`NoteEditPanel`)에 칩 입력기를 새로 추가합니다. 태그를 하나씩 추가하고, 다른 메모에서 이미 쓰인 태그를 입력 중 자동완성으로 제안합니다. 칩은 x 버튼 클릭 또는(입력창이 비어있을 때) Backspace로 제거할 수 있습니다.
- 메모 카드(`NoteCard`)에 태그 목록을 표시합니다. DESIGN.md에 이미 정의된 `tag` 컴포넌트(fill/weak variant)를 그대로 재사용합니다.
- 태그 입력을 위한 새 인터랙티브 컴포넌트(가칭 `tag-input`)를 DESIGN.md에 추가합니다. 기존 `tag`는 non-interactive로 못박혀 있어 편집 중 추가/삭제되는 칩에는 재사용할 수 없습니다.
- 태그 부여/저장/자동완성/표시만 다루며, 태그를 클릭해 목록을 필터링하는 기능과 검색어에 태그를 포함시키는 것은 이번 범위에 포함하지 않습니다 (DESIGN.md가 이미 예고한 별도의 "필터-칩" 컴포넌트 확장으로 남깁니다).

## Capabilities

### New Capabilities
(없음)

### Modified Capabilities
- `note-taking`: 메모에 태그를 부여하고 편집 화면과 목록 카드에서 다루는 요구사항을 추가합니다 (기존 "메모를 편집하고 태그로 정리하기"라는 제품 목표를 실제 요구사항으로 구체화).

## Impact

- `src/lib/notes/types.ts`: `Note`에 `tags: string[]` 추가
- `src/lib/notes/local-storage-store.ts`: 저장된 데이터에 `tags`가 없는 기존 메모를 읽을 때 빈 배열로 보정
- `src/lib/components/NoteEditPanel.svelte`: 새 태그 입력 UI 추가
- `src/lib/components/NoteCard.svelte`: 태그 목록 표시 추가
- `src/App.svelte`: 전체 메모에서 자동완성용 태그 목록을 파생
- `DESIGN.md`: 새 `tag-input` 컴포넌트 계약 추가 (canonical compiler를 통한 재발행 경로를 따름)
- 새 컴포넌트 파일(예: `TagInput.svelte`) 추가
