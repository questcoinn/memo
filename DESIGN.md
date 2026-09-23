# 메모 앱 Design System

<!-- design-md:section experience -->
## 1. Experience

<!-- design-md:claim scope kind=product-surface lang=en -->
### Scope

메모를 적고, 목록에서 다시 찾고, 정리하는 세 가지 핵심 동작을 차분한 화이트 캔버스와 단일한 신뢰감 있는 블루 액션 컬러로 지원한다. 화면은 항상 다음에 할 일을 명확히 보여주고, 비어있음/로딩/에러 같은 상태를 숨기지 않는다.
<!-- design-md:claim-end -->

<!-- design-md:claim primary-tasks kind=user-outcomes count=4 lang=en -->
### Primary tasks

- 새 메모 빠르게 작성하기

- 메모 목록에서 검색하고 다시 찾기

- 메모를 편집하고 태그로 정리하기

- 필요 없는 메모를 삭제하기
<!-- design-md:claim-end -->

### Design direction

- 차분한 화이트 캔버스와 파란색 인터랙션 컬러 하나로 시선을 모은다

- 장식적인 그림자나 그라디언트 대신 여백과 위계로 구조를 만든다

- 짧고 직접적인 문장으로 다음 행동을 항상 먼저 알려준다

### Principles

- 한 화면에서 한 번에 이해되는 단순한 흐름을 유지한다

- 다음 행동이 항상 명확한 화면을 만든다

- 비어있음, 로딩, 에러 상태를 감추지 않고 구체적으로 보여준다

- 인터랙션 컬러는 실제 동작이 있는 요소에만 사용한다

### Avoid

- 불필요한 장식(그림자, 그라디언트, 장식용 아이콘 타일)

- 모호한 안내 문구와 번역투 표현

- 한 화면에 너무 많은 기능을 눌러 담는 과밀한 레이아웃

- 브랜드 근거 없는 카드형 UI의 남용

<!-- design-md:section foundations -->
## 2. Foundations

<!-- design-md:claim foundations kind=rules-or-constraints lang=en -->
### Semantic tokens

- **color-body**: `#4e5968` — 본문 텍스트.
- **color-border**: `#e5e8eb` — 구분선, 옅은 아웃라인.
- **color-canvas**: `#ffffff` — 기본 배경.
- **color-danger**: `#e42939` — 삭제/에러 등 파괴적 액션과 에러 상태.
- **color-foreground**: `#191f28` — 본문 제목 등 가장 강한 텍스트.
- **color-muted**: `#8b95a1` — 보조 텍스트, 타임스탬프 등.
- **color-on-primary**: `#ffffff` — primary 배경 위 텍스트.
- **color-overlay**: `rgba(25, 31, 40, 0.5)` — 모달/다이얼로그 백드롭 오버레이. color-foreground(#191f28)를 50% 알파로 낮춘 값.
- **color-primary**: `#3182f6` — 메모 작성/저장 등 핵심 액션 색상. Toss TDS 인터랙션 블루를 참고.
- **color-primary-hover**: `#2272eb` — primary 액션의 hover/pressed 강조 색상.
- **color-surface**: `#f2f4f6` — 메모 카드/입력 필드의 조용한 배경 레이어.
- **color-weak-background**: `#e8f3ff` — 보조 강조 배경(태그, 선택 상태).
- **color-weak-foreground**: `#1b64da` — weak-background 위 텍스트/아이콘.
- **font-family-sans**: `["Pretendard","-apple-system","system-ui","sans-serif"]` — Toss Product Sans는 재배포 권한이 확인되지 않아 오픈소스 한글 폰트 Pretendard(SIL OFL)로 대체하고 시스템 폰트로 안전하게 폴백한다.
- **radius-button**: `16px` — 주요 액션 버튼 radius.
- **radius-card**: `12px` — 메모 카드 radius. Toss xlarge 버튼(16px)과 marketing CTA(7px) 사이에서 카드 표면에 맞게 조정한 값.
- **radius-md**: `6px` — 입력 필드 등 중간 표면.
- **radius-sm**: `4px` — 옅은 칩/뱃지 등 작은 표면.
- **spacing-lg**: `16px`
- **spacing-md**: `8px`
- **spacing-sm**: `6px`
- **spacing-xl**: `24px`
- **spacing-xs**: `4px`
- **spacing-xxl**: `32px`
- **typography-body**: `{"lineHeight":"24px","size":"16px","weight":400}` — 메모 본문, 입력 필드 기본 텍스트.
- **typography-body-heading**: `{"lineHeight":"30px","size":"20px","weight":600}` — 메모 본문 안의 소제목(## 마커로 확정). h3(카드 제목)보다 한 단계 작고 본문보다 큼.
- **typography-body-small**: `{"lineHeight":"21px","size":"14px","weight":400}` — 타임스탬프, 도움말, 보조 텍스트.
- **typography-h1**: `{"lineHeight":"54px","size":"36px","weight":700}` — 메모 상세/편집 화면 제목.
- **typography-h2**: `{"lineHeight":"45px","size":"30px","weight":600}` — 목록/설정 등 섹션 제목.
- **typography-h3**: `{"lineHeight":"36px","size":"24px","weight":600}` — 메모 카드 제목.

### Contrast pairs

- color-foreground on color-canvas: minimum 4.5:1
- color-body on color-canvas: minimum 4.5:1
- color-on-primary on color-primary: minimum 3:1
- color-weak-foreground on color-weak-background: minimum 4.5:1

### Reduced motion

Required.

### Foundation rules

- color-primary는 실제 동작이 있는 인터랙션 요소에만 사용한다

- color-surface/color-border는 콘텐츠 계층 구분 용도로만 사용하고 장식으로 남용하지 않는다

- font-family-sans가 로드되지 않을 경우 시스템 폰트 스택으로 즉시 폴백한다

- color-on-primary/color-primary 조합은 Toss 검증값을 그대로 이식한 결과 실측 대비 3.71:1로 텍스트 AA 기준(4.5:1)에는 못 미치고 UI 컴포넌트 대비 기준(3:1)만 충족한다. 버튼 라벨은 17px 이상 굵은 글자만 사용하고, 더 낮은 대비가 필요한 곳에는 재사용하지 않는다
<!-- design-md:claim-end -->

<!-- design-md:section typography-assets -->
## 3. Typography & Assets

### Type roles

| Role | Usage | Family | Size | Weight | Line height |
|---|---|---|---|---|---|
| h1 | 메모 편집/상세 화면 제목 | font-family-sans | 36px | 700 | 54px |
| h2 | 목록·설정 섹션 제목 | font-family-sans | 30px | 600 | 45px |
| h3 | 메모 카드 제목 | font-family-sans | 24px | 600 | 36px |
| body | 메모 본문 및 입력 필드 | font-family-sans | 16px | 400 | 24px |
| body-small | 타임스탬프, 도움말, 보조 텍스트 | font-family-sans | 14px | 400 | 21px |
| body-heading | 메모 본문 안의 소제목 (## 마커를 Tab으로 확정한 줄) | font-family-sans | 20px | 600 | 30px |

### Assets

| Asset | Kind | Source status | License status | Source | Notes |
|---|---|---|---|---|---|
| pretendard | font | licensed-sourced | verified | https://github.com/orioncactus/pretendard (SIL OFL 1.1) | Toss Product Sans는 공식 재배포 권한이 확인되지 않아 채택하지 않고, 유사한 굵기감의 오픈소스 한글 웹폰트로 대체. |

### Rules

- 본문/헤딩 모두 font-family-sans 토큰을 통해서만 폰트를 참조한다

- 숫자가 포함된 타임스탬프/카운트에는 고정폭 숫자(tabular numerals)를 우선 검토한다

<!-- design-md:section components-states -->
## 4. Components & States

### Component: button-primary

**Semantics:** 새 메모 만들기 등 화면의 단일 주요 액션.

- Anatomy: label, optional-leading-icon, loading-spinner-slot
- Variants: fill, weak
- States: default, hover, focus-visible, disabled, loading, pressed
- Token references: color-primary, color-primary-hover, color-on-primary, radius-button, typography-body

- Interaction kind: interactive

#### State applicability

| State | Applicability | Reason |
|---|---|---|
| default | applicable |  |
| hover | applicable |  |
| focus-visible | applicable |  |
| disabled | applicable |  |
| loading | applicable |  |
| error | not-applicable | 버튼 자체는 에러 상태를 갖지 않고, 실패는 화면의 에러 배너/토스트로 전달한다 |
| success | not-applicable | 성공은 화면 전환이나 토스트로 전달하고 버튼 자체 상태로 표시하지 않는다 |

### Component: text-field

**Semantics:** 메모 제목과 본문을 입력하는 필드.

- Anatomy: label, input, help-or-error-text
- Variants: title, body, search
- States: default, focus-visible, error, disabled, read-only
- Token references: color-surface, color-border, color-foreground, color-danger, radius-md, typography-body

- Interaction kind: interactive

#### State applicability

| State | Applicability | Reason |
|---|---|---|
| default | applicable |  |
| hover | not-applicable | 텍스트 입력 필드는 별도 hover 스타일을 정의하지 않는다 |
| focus-visible | applicable |  |
| disabled | applicable |  |
| loading | not-applicable | 입력 필드 자체는 로딩 상태를 갖지 않는다 |
| error | applicable |  |
| success | not-applicable | 저장 성공은 화면 단위 피드백으로 전달한다 |

### Component: tag

**Semantics:** 메모를 분류하는 라벨. 클릭하면 해당 태그를 노트 목록의 활성 필터로 토글한다.

- Anatomy: label
- Variants: fill, weak
- States: default, selected
- Token references: color-weak-background, color-weak-foreground, radius-sm, typography-body-small

- Interaction kind: interactive

#### State applicability

| State | Applicability | Reason |
|---|---|---|
| default | applicable |  |
| hover | not-applicable | text-field와 마찬가지로 별도 hover 스타일을 정의하지 않는다 |
| focus-visible | applicable |  |
| disabled | not-applicable | 노트 카드에 보이는 태그는 항상 필터로 클릭 가능하며 비활성화 상태를 갖지 않는다 |
| loading | not-applicable | 태그 필터 토글은 로컬 상태 변경이며 비동기 상태를 갖지 않는다 |
| error | not-applicable | 태그 필터 토글은 실패하지 않는 로컬 상태 변경이다 |
| success | not-applicable | 필터 적용은 목록이 즉시 갱신되는 것으로 전달되며 별도 성공 상태를 표시하지 않는다 |

### Component: note-card

**Semantics:** 메모 목록에서 각 메모를 나타내는 카드. 클릭하면 상세/편집 화면으로 이동한다.

- Anatomy: title, preview-text, timestamp, tag-list
- Variants: default
- States: default, hover, focus-visible, selected
- Token references: color-canvas, color-border, color-foreground, color-muted, radius-card, typography-h3, typography-body-small

- Interaction kind: interactive

#### State applicability

| State | Applicability | Reason |
|---|---|---|
| default | applicable |  |
| hover | applicable |  |
| focus-visible | applicable |  |
| disabled | not-applicable | 메모 카드는 비활성화 상태를 갖지 않는다 |
| loading | not-applicable | 개별 카드는 로딩 상태를 갖지 않고 목록 전체의 로딩/빈 상태로 처리한다 |
| error | not-applicable | 개별 카드는 에러 상태를 갖지 않고 목록 전체의 에러 상태로 처리한다 |
| success | not-applicable | 카드 자체는 성공 상태를 표시하지 않는다 |

### Component: confirm-dialog

**Semantics:** 파괴적 액션(삭제 등)을 실행하기 전 사용자에게 명시적으로 확인받는 모달 다이얼로그.

- Anatomy: title, message, cancel-action, confirm-action
- Variants: destructive
- States: default, focus-visible
- Token references: color-danger, color-overlay, radius-md, radius-card, typography-body, typography-h3

- Interaction kind: interactive

#### State applicability

| State | Applicability | Reason |
|---|---|---|
| default | applicable |  |
| hover | not-applicable | 다이얼로그 자체는 hover 대상이 아니고 내부 버튼이 hover를 갖는다 |
| focus-visible | applicable |  |
| disabled | not-applicable | 다이얼로그는 비활성화 상태를 갖지 않는다 |
| loading | not-applicable | 다이얼로그 자체는 비동기 상태를 갖지 않는다. 확인 액션의 결과(성공/실패)는 다이얼로그가 닫힌 뒤 대상 화면에서 표시한다 |
| error | not-applicable | 다이얼로그 자체는 에러 상태를 갖지 않는다 |
| success | not-applicable | 다이얼로그 자체는 성공 상태를 갖지 않는다 |

### Component: link

**Semantics:** 메모 본문에서 URL 형태 텍스트(http://, https://, www.)를 감지해 만드는 인라인 atomic 링크. 라벨과 목표 주소가 같은 문자열이며, Cmd/Ctrl+클릭으로 열린다.

- Anatomy: label
- States: default, hover, focus-visible
- Token references: color-primary, color-primary-hover, typography-body

- Interaction kind: interactive

#### State applicability

| State | Applicability | Reason |
|---|---|---|
| default | applicable |  |
| hover | applicable |  |
| focus-visible | applicable |  |
| disabled | not-applicable | 링크는 텍스트 안에서 감지되는 즉시 존재하거나(atomic) Backspace로 통째로 삭제되며, 비활성화 상태를 갖지 않는다 |
| loading | not-applicable | 링크 자체는 비동기 상태를 갖지 않는다 |
| error | not-applicable | 링크는 에러 상태를 갖지 않는다 |
| success | not-applicable | 링크는 성공 상태를 표시하지 않는다 |

### Component: tag-input

**Semantics:** 메모에 태그를 추가/삭제하는 칩 입력기. 텍스트를 입력해 Enter로 태그를 확정하거나, 다른 메모에서 이미 쓰인 태그의 자동완성 제안을 선택해 추가한다.

- Anatomy: chip-list, chip-remove-control, text-input, suggestion-list
- States: default, focus-visible, has-suggestions
- Token references: color-weak-background, color-weak-foreground, radius-sm, typography-body-small, color-surface, color-border, radius-md, typography-body, color-primary

- Interaction kind: interactive

#### State applicability

| State | Applicability | Reason |
|---|---|---|
| default | applicable |  |
| hover | not-applicable | text-field와 마찬가지로 입력기 자체에는 별도 hover 스타일을 정의하지 않는다 |
| focus-visible | applicable |  |
| disabled | not-applicable | 메모 편집 화면에 있는 동안은 항상 입력 가능한 상태로만 존재한다 |
| loading | not-applicable | 태그 변경은 기존 메모 자동저장 파이프라인을 그대로 타므로 입력기 자체는 별도 로딩 상태를 갖지 않는다 |
| error | not-applicable | 태그 추가/삭제 자체는 실패하지 않는 로컬 상태 변경이며, 저장 실패는 화면의 저장-상태 메시지로 전달된다 |
| success | not-applicable | 성공은 칩이 즉시 나타나는 것으로 전달되며 별도 성공 상태를 표시하지 않는다 |

### Rules

- 모든 인터랙티브 컴포넌트는 disabled, loading, error 중 실제로 발생 가능한 상태만 명시적으로 정의한다

- 삭제 같은 파괴적 액션은 color-danger로만 표시하고 fill 버튼의 기본 색으로 재사용하지 않는다

<!-- design-md:section layout-platforms -->
## 5. Layout & Platforms

### Responsive constraints

- Minimum supported width: 320px
- Reflow target: 200% zoom

### Layout rules

- 터치 타깃은 최소 44px 높이를 확보한다

- 모바일 웹을 기준으로 우선 설계하고 데스크톱은 목록/상세 2단 레이아웃으로 확장한다

- 메모 목록과 편집 화면은 항상 320px 폭에서 가로 스크롤 없이 재배치된다

### Platform: web

- 반응형 웹 애플리케이션으로 구현하며 네이티브 앱 셀 규격을 강제하지 않는다

<!-- design-md:section content-locales -->
## 6. Content & Locales

### Voice

- 짧고 직접적인 문장으로 쓴다

- 다음 행동을 항상 먼저 이해할 수 있게 쓴다

- 모호한 안내나 번역투 표현을 피한다

- 빈 화면, 로딩, 에러는 상태와 다음 행동을 함께 설명한다

### Locale: ko (supported)

- 기본 언어. 모든 UI 카피의 기준 locale.

<!-- design-md:section governance -->
## 7. Governance

<!-- design-md:claim authority kind=project-system lang=en -->
### Authority

This document is the project design contract for the declared scope.
<!-- design-md:claim-end -->

<!-- design-md:claim application-priority order=prompt-fact,repository-fact,system-contract,reference-inspiration lang=en -->
### Application priority

1. Direct user instructions for the requested scope.
2. Repository facts.
3. This system contract.
4. Reference inspiration.
<!-- design-md:claim-end -->

<!-- design-md:claim unknowns policy=absent-at-smallest-unresolved-boundary lang=en -->
### Unknowns

Omit only the smallest unresolved value or group. Do not replace it with a plausible default.
<!-- design-md:claim-end -->

<!-- design-md:claim changes policy=review-record-validate-before-adoption lang=en -->
### Changes

Record, review, and validate changes before adoption.
<!-- design-md:claim-end -->

### Project priority details

1. accessibility

2. clarity

3. adopted-toss-tone-consistency

### Additional change rules

- 토큰/컴포넌트 변경은 이 System Graph draft를 수정하고 canonical compiler를 통해 재발행하는 경로로만 이루어진다

- DESIGN.md 본문과 claim marker는 컴파일러 출력만 신뢰하고 직접 수정하지 않는다

### Decision provenance

- /identity/name — prompt-fact; evidence: 사용자가 '메모 앱 만들건데'라고 직접 지칭함
- /identity/scope — agent-proposed-greenfield-decision; evidence: 사용자가 Toss 레퍼런스를 프로젝트 디자인 시스템으로 채택하기로 확정함
- /experience — agent-proposed-greenfield-decision; evidence: 프로젝트 사실(이름/시대/테제/타겟)은 사용자가 skip 응답, 구체 브랜드 사실 없이 메모 앱 도메인에 맞춘 그린필드 제안
- /foundations/tokens — verified-reference-inspiration; evidence: .claude/data/references/toss/DESIGN.md verification_v2 (2026-07-11, computed-style + 공식 TDS 문서)
- /foundations/rules — agent-proposed-greenfield-decision; evidence: Toss 토큰의 오용을 막기 위한 운영 규칙, Toss 레퍼런스의 Do/Don't 섹션을 메모 도메인에 맞게 재서술
- /typography_assets/assets/0 — agent-proposed-greenfield-decision; evidence: Toss Product Sans는 재배포 권한 미확인(레퍼런스 §3 Unresolved)이므로 오픈소스 대체 폰트로 그린필드 결정
- /components_states/components — agent-proposed-greenfield-decision; evidence: Toss TDS 버튼/텍스트필드/뱃지 상태 계약을 메모 도메인 컴포넌트(button-primary/text-field/tag/note-card)로 재구성
- /layout_platforms — agent-proposed-greenfield-decision; evidence: Toss TDS가 모바일 지향임을 참고했지만 반응형 웹 최소 320px 기준은 별도 그린필드 결정
- /content_locales/voice — agent-proposed-greenfield-decision; evidence: Toss 레퍼런스 §10 Voice & Tone(Easy to answer / Value first)를 메모 도메인 문구 원칙으로 재서술
- /components_states/components/0/semantics — repository-fact; evidence: 자동저장 도입(add-note-autosave)으로 명시적 저장 버튼과 onSave가 제거됨 (src/lib/components/NoteEditPanel.svelte), button-primary는 현재 새 메모 만들기에만 쓰임
- /components_states/components/4 — agent-proposed-greenfield-decision; evidence: window.confirm()는 DESIGN.md 톤을 입힐 수 없어 네이티브 <dialog> 기반 confirm-dialog 컴포넌트로 대체 (openspec/changes/use-dialog-for-delete-confirm/design.md)
- /foundations/tokens/color-overlay — agent-proposed-greenfield-decision; evidence: Toss 레퍼런스에 backdrop/overlay 토큰 없음. color-foreground 50% 알파로 그린필드 결정 (openspec/changes/use-dialog-for-delete-confirm/design.md)
- /components_states/components/1/variants — agent-proposed-greenfield-decision; evidence: 메모 목록 검색 입력을 위해 text-field에 search variant 추가 (openspec/changes/add-note-search/design.md)
- /typography_assets/roles/5 — agent-proposed-greenfield-decision; evidence: openspec/changes/add-note-body-formatting/design.md
- /components_states/components/5 — agent-proposed-greenfield-decision; evidence: URL 형태 텍스트를 감지해 만드는 인라인 링크 컴포넌트, button-primary와 동일한 color-primary/color-primary-hover 토큰 쌍 재사용 (openspec/changes/add-note-link-formatting/design.md)
- /components_states/components/6 — agent-proposed-greenfield-decision; evidence: 메모에 태그를 부여하는 칩 입력기. 기존 tag는 non-interactive로 못박혀 있어 재사용 불가하여 별도 인터랙티브 컴포넌트로 추가 (openspec/changes/add-note-tags/design.md)
- /components_states/components/2 — agent-proposed-greenfield-decision; evidence: 노트 카드의 태그 칩이 클릭 가능한 필터 토글이 되면서 tag 컴포넌트의 Interaction kind를 non-interactive에서 interactive로, selected state를 load-bearing으로 변경 (openspec/changes/add-note-tag-search/design.md)
