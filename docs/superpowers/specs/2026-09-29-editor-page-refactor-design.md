# EditorPage 구조 리팩토링 설계

## 목표

`src/pages/portfolio/EditorPage.tsx`의 편집 UI와 페이지 orchestration을 분리해, 기존 포트폴리오 편집 동작을 유지하면서 각 block 편집 로직을 독립적으로 읽고 수정할 수 있게 한다.

## 현재 문제

- `EditorPage.tsx`가 약 1,500줄이며 프로필 편집, 카드 편집, block별 편집, drag-and-drop, draft 상태, 저장, 라우팅을 모두 담당한다.
- block별 UI가 하나의 파일에 연속으로 배치되어 변경 영향 범위를 파악하기 어렵다.
- API/타입/정규화 경계는 이미 별도 파일로 분리되어 있으므로 이번 리팩토링에서 합치지 않는다.

## 설계

`EditorPage`는 다음 책임만 유지한다.

- route location에서 초기 문서를 선택하고 draft/original 상태를 관리한다.
- profile/card/block 변경을 하나의 draft 업데이트로 반영한다.
- block 이동, 추가, 삭제와 저장 후 navigation을 처리한다.
- 분리된 편집 컴포넌트에 데이터와 callback을 전달한다.

편집 UI는 `src/pages/portfolio/editor/` 아래로 이동한다.

- `EditorShared.tsx`: editor 전용 공통 입력 컴포넌트
- `editorUtils.ts`: input/panel class, client id 생성, profile field 조회 등 공통 유틸리티
- `EditableProfile.tsx`: 프로필 필드와 아바타 편집
- `EditableFrontCard.tsx`: front card 편집 및 정적 미리보기 카드
- `EditableAbout.tsx`: About description 편집
- `EditableTimeline.tsx`: education/experience/activities/awards/certification 편집
- `EditableWorks.tsx`: works item와 기술 tag 편집
- `EditableSkills.tsx`: skills category와 object item 편집
- `BlockEditor.tsx`: block header, visible toggle, block 삭제, block type별 editor 선택

기존 `editorDocument.ts`, `portfolioMapper.ts`, `types/portfolio.ts`, API 파일은 위치와 public interface를 유지한다. 새 컴포넌트는 `ContentBlock`, 각 block의 `Extract` 타입과 명시적인 callback만 소비하며, API를 직접 호출하지 않는다.

## 동작 보존 기준

- 기존 block/item id와 entityId는 draft 변경 중 유지된다.
- 새 client id는 화면의 React key와 drag-and-drop 식별에만 사용되고 PATCH payload에서는 제거된다.
- block/item 삭제는 전체 blocks 배열에서 제거된다.
- visible toggle, block reorder, item reorder, 날짜 null 처리, Skills object item 처리는 현재와 동일하게 동작한다.
- 저장 성공 시 Backend 응답 문서로 original/draft를 동시에 교체한다.

## 파일 이동 원칙

- 먼저 컴포넌트의 코드와 import를 이동하고, 동작 변경은 최소화한다.
- 각 파일은 하나의 편집 책임만 가진다.
- 작은 공통 컴포넌트나 API 파일을 파일 수 감소만을 위해 합치지 않는다.
- 순환 의존성을 피하기 위해 editor 컴포넌트 간 직접 import는 `EditorShared`, `editorUtils`와 타입으로 제한한다.

## 검증

- 파일 분리 후 `npm run build`로 TypeScript와 production bundle을 확인한다.
- `npm run lint`로 import/React Hook 오류를 확인한다.
- 기존 계약 검증은 `portfolioMapper`와 `editorDocument`의 public interface를 통해 유지한다.
- 별도 테스트 파일을 추가하지 않고, 이 저장소의 현재 테스트 파일 정리 상태를 유지한다.
