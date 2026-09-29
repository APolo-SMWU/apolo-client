# EditorPage 구조 리팩토링 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 기존 동작을 유지하면서 1,478줄의 `EditorPage.tsx`를 역할별 editor 컴포넌트로 분리한다.

**Architecture:** `EditorPage`는 draft/original 상태, 저장, 라우팅, block collection 조작만 담당한다. 편집 UI는 `src/pages/portfolio/editor/` 아래의 Profile, FrontCard, About, Timeline, Works, Skills, BlockEditor 컴포넌트로 이동하며 API를 직접 호출하지 않는다.

**Tech Stack:** React 19, TypeScript, React Router, Vite, Tailwind CSS.

**Spec:** `docs/superpowers/specs/2026-09-29-editor-page-refactor-design.md`

## Global Constraints

- 기존 사용자 동작과 Portfolio v2 API 계약을 변경하지 않는다.
- 기존 block/item `id`와 `entityId`를 유지한다.
- 새 client id는 PATCH payload에 포함하지 않는다.
- API/타입/정규화 public interface는 유지한다.
- 별도 테스트 파일은 추가하지 않는다.

## Review Focus

- Editor 진입 시 location state/mock fallback과 기존 initial document normalization이 유지되는가 — Task 4 build 및 diff review.
- block/item 추가·삭제·reorder 시 callback이 원래 collection을 정확히 갱신하는가 — Task 3 build 및 수동 코드 검토.
- About/Timeline/Works/Skills의 타입별 필드가 이동 중 누락되지 않는가 — Task 1~3 build.
- 저장 성공/실패, navigation blocker, avatar upload가 Page orchestration에 남아 있는가 — Task 4 build.
- visible toggle와 client id 생성이 기존 PATCH payload 흐름을 계속 사용하는가 — Task 3~4 diff review.

### Task 1: Editor shared primitives and profile/card components

**Files:**
- Create: `src/pages/portfolio/editor/EditorShared.tsx`, `src/pages/portfolio/editor/editorUtils.ts`
- Create: `src/pages/portfolio/editor/EditableProfile.tsx`
- Create: `src/pages/portfolio/editor/EditableFrontCard.tsx`
- Create: `src/pages/portfolio/editor/ProfilePreviewCard.tsx`
- Modify: `src/pages/portfolio/EditorPage.tsx`

**Interfaces:**
- `EditorShared.tsx` exports shared editor input helpers. `editorUtils.ts` exports `inputClass`, `panelClass`, `createClientId`, and profile field helpers.
- `EditableProfile` consumes `PortfolioDocument` and profile/avatar callbacks.
- `EditableFrontCard` consumes `PortfolioDocument` and profile/card field callbacks.
- `ProfilePreviewCard` consumes `PortfolioDocument`.

- [ ] Move shared constants, client id generation, `getField`, `HugInput`, `profileIcons`, `EditableProfile`, `EditableFrontCard`, and `ProfilePreviewCard` without changing callback signatures.
- [x] Replace the definitions in `EditorPage.tsx` with imports from the new files.
- [ ] Run `npm run build` and `npm run lint`; expected: exit 0.

### Task 2: Block-specific editor components

**Files:**
- Create: `src/pages/portfolio/editor/EditableAbout.tsx`
- Create: `src/pages/portfolio/editor/EditableTimeline.tsx`
- Create: `src/pages/portfolio/editor/EditableWorks.tsx`
- Create: `src/pages/portfolio/editor/EditableSkills.tsx`
- Modify: `src/pages/portfolio/EditorPage.tsx`

**Interfaces:**
- Components consume their corresponding `Extract<ContentBlock, ...>` block and receive selection, update, remove, reorder, and theme callbacks currently defined inline.
- `EditableSkills` continues to edit `SkillItem.name` while preserving item ids/entityIds.
- `EditableTimeline` continues to distinguish range dates from award/certification single dates.

- [ ] Move each block-specific editor and its local drag/selection state into its named file.
- [ ] Preserve `client-*` id creation for new timeline/work/category/item entities.
- [x] Replace the moved definitions in `EditorPage.tsx` with imports.
- [ ] Run `npm run build` and `npm run lint`; expected: exit 0.

### Task 3: BlockEditor and page-level collection controls

**Files:**
- Create: `src/pages/portfolio/editor/BlockEditor.tsx`
- Modify: `src/pages/portfolio/EditorPage.tsx`

**Interfaces:**
- `BlockEditor` consumes a `ContentBlock`, `onSelect`, `onChange`, `onRemove`, and `themeId`.
- It owns block title mapping and dispatches to the block-specific editor components.
- `EditorPage` retains `createEmptyBlock`, `addBlock`, `removeBlock`, `moveBlock`, and `updateBlock`.

- [x] Move block title map, block header controls, block visible toggle, block delete, block-specific dispatch, and empty block creation helpers into the appropriate editor boundary while leaving collection mutation callbacks in `EditorPage`.
- [ ] Ensure block add/delete/reorder and visible updates still produce the same `ContentBlock` collection.
- [ ] Run `npm run build` and `npm run lint`; expected: exit 0.

### Task 4: Reduce EditorPage to orchestration and verify

**Files:**
- Modify: `src/pages/portfolio/EditorPage.tsx`
- Modify: `docs/superpowers/plans/2026-09-29-editor-page-refactor.md`

- [x] Remove all remaining editor UI definitions from `EditorPage.tsx`, leaving imports, page state/effects, callbacks, and layout composition.
- [x] Confirm `EditorPage.tsx` is focused on route/draft/save/navigation orchestration and no API call moved into child components.
- [ ] Run `npm test` (expected: no test files, exit 0), `npm run build`, `npm run lint`, and `git diff --check`.
- [ ] Review the final diff against the design spec and record the verification result.
