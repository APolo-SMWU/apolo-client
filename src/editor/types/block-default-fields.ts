// ============================================================
// APolo Portfolio - Block Default Fields
// 블록 타입별 기본 fields 정의
// loadFromAI 시 fields가 없는 블록에 자동으로 주입됨
// ============================================================

import type { BlockField, BlockType } from "./block.types";

export const BLOCK_DEFAULT_FIELDS: Partial<Record<BlockType, BlockField[]>> = {

  // ─── Hero ───
  hero: [
    { key: "headline", label: "헤드라인", input: "text", group: "content", placeholder: "안녕하세요, 디자이너 OOO입니다", validation: { required: true } },
    { key: "subheadline", label: "서브 헤드라인", input: "textarea", group: "content", placeholder: "한 줄 소개를 입력하세요" },
    { key: "heroImage", label: "배경 이미지", input: "imageUpload", group: "content" },
    { key: "ctaLabel", label: "버튼 텍스트", input: "text", group: "content", placeholder: "작업물 보기" },
    { key: "ctaLink", label: "버튼 링크", input: "text", group: "content", placeholder: "#work" },
  ],

  // ─── Profile ───
  profile: [
    { key: "name", label: "이름", input: "text", group: "content", placeholder: "홍길동", validation: { required: true } },
    { key: "role", label: "직무", input: "text", group: "content", placeholder: "Visual / UX Designer" },
    { key: "intro", label: "자기소개", input: "textarea", group: "content", placeholder: "간략한 자기소개를 입력하세요" },
    { key: "profileImage", label: "프로필 이미지", input: "imageUpload", group: "content" },
    { key: "location", label: "위치", input: "text", group: "content", placeholder: "Seoul, Korea" },
    { key: "links", label: "링크 목록", input: "linkList", group: "content" },
  ],

  // ─── Project ───
  project: [
    { key: "title", label: "프로젝트 이름", input: "text", group: "content", placeholder: "프로젝트 제목", validation: { required: true } },
    { key: "summary", label: "한 줄 설명", input: "textarea", group: "content", placeholder: "프로젝트에 대한 간략한 설명" },
    { key: "role", label: "역할", input: "text", group: "content", placeholder: "Visual Designer" },
    { key: "period", label: "기간", input: "dateRange", group: "content" },
    { key: "techStack", label: "사용 툴/기술", input: "toggleTagSelector", group: "content", allowCustom: true },
    { key: "links", label: "관련 링크", input: "linkList", group: "content" },
    { key: "thumbnail", label: "썸네일 이미지", input: "imageUpload", group: "content" },
  ],

  // ─── Skills ───
  skills: [
    { key: "category", label: "카테고리", input: "text", group: "content", placeholder: "Tools / Frontend / etc" },
    { key: "items", label: "스킬 목록", input: "toggleTagSelector", group: "content", allowCustom: true },
  ],

  // ─── Experience ───
  experience: [
    { key: "organization", label: "소속", input: "text", group: "content", placeholder: "회사 / 학교 / 활동명", validation: { required: true } },
    { key: "role", label: "역할", input: "text", group: "content", placeholder: "인턴 / 팀원 등" },
    { key: "period", label: "기간", input: "dateRange", group: "content" },
    { key: "description", label: "설명", input: "textarea", group: "content", placeholder: "담당 업무 및 설명" },
    { key: "achievements", label: "주요 성과", input: "repeater", group: "content" },
  ],

  // ─── Contact ───
  contact: [
    { key: "email", label: "이메일", input: "text", group: "content", placeholder: "your@email.com" },
    { key: "github", label: "GitHub", input: "link", group: "content" },
    { key: "blog", label: "블로그 / Behance", input: "link", group: "content" },
    { key: "notion", label: "Notion", input: "link", group: "content" },
  ],

  // ─── Text ───
  text: [
    { key: "title", label: "제목", input: "text", group: "content", placeholder: "섹션 제목 (선택)" },
    { key: "body", label: "본문", input: "textarea", group: "content", placeholder: "내용을 입력하세요", validation: { required: true } },
  ],

  // ─── Image ───
  image: [
    { key: "image", label: "이미지", input: "imageUpload", group: "content", validation: { required: true } },
    { key: "alt", label: "이미지 설명 (alt)", input: "text", group: "content", placeholder: "이미지 설명" },
    { key: "caption", label: "캡션", input: "text", group: "content", placeholder: "이미지 하단 설명 (선택)" },
  ],

  // ─── Paper ───
  paper: [
    { key: "title", label: "논문 제목", input: "text", group: "content", placeholder: "논문 제목", validation: { required: true } },
    { key: "authors", label: "저자", input: "text", group: "content", placeholder: "Author, A. et al." },
    { key: "venue", label: "학회/저널", input: "text", group: "content", placeholder: "Conference / Journal" },
    { key: "year", label: "연도", input: "text", group: "content", placeholder: "2024" },
    { key: "topic", label: "주제", input: "text", group: "content", placeholder: "논문 주제" },
    { key: "summary", label: "핵심 요약", input: "textarea", group: "content", placeholder: "논문의 핵심 내용을 2~3문장으로 정리" },
    { key: "takeaway", label: "읽고 이해한 점", input: "textarea", group: "content", placeholder: "내가 이해한 기여점, 방법론, 한계" },
    { key: "followUpQuestion", label: "후속 질문", input: "textarea", group: "content", placeholder: "더 탐구하고 싶은 질문" },
    { key: "link", label: "논문 링크", input: "link", group: "content" },
  ],

  // ─── Gallery ───
  gallery: [
    { key: "title", label: "작업물 제목", input: "text", group: "content", placeholder: "작업물 제목", validation: { required: true } },
    { key: "description", label: "작업 설명", input: "textarea", group: "content", placeholder: "컨셉, 역할, 결과를 간략히 작성" },
    { key: "images", label: "갤러리 이미지", input: "imageList", group: "content", helperText: "작업물 이미지를 필요한 만큼 추가할 수 있습니다." },
    { key: "alt", label: "이미지 설명", input: "text", group: "content", placeholder: "작업물 이미지 설명" },
    { key: "caption", label: "캡션", input: "text", group: "content", placeholder: "이미지 하단 설명" },
  ],

  // ─── Troubleshooting ───
  troubleshooting: [
    { key: "title", label: "트러블슈팅 제목", input: "text", group: "content", placeholder: "예: 중복 예약 발생 문제 해결", validation: { required: true } },
    { key: "context", label: "상황", input: "textarea", group: "content", placeholder: "문제가 발생한 맥락" },
    { key: "problem", label: "문제", input: "textarea", group: "content", placeholder: "발생한 문제" },
    { key: "cause", label: "원인", input: "textarea", group: "content", placeholder: "분석한 원인" },
    { key: "solution", label: "해결", input: "textarea", group: "content", placeholder: "적용한 해결 방법" },
    { key: "result", label: "결과", input: "textarea", group: "content", placeholder: "개선 결과 또는 배운 점" },
  ],

  // ─── Process ───
  process: [
    { key: "title", label: "과정 제목", input: "text", group: "content", placeholder: "예: Brand Identity Design Process", validation: { required: true } },
    { key: "overview", label: "개요", input: "textarea", group: "content", placeholder: "프로젝트가 어떤 흐름으로 진행되었는지 요약" },
    { key: "research", label: "리서치", input: "textarea", group: "content", placeholder: "사용자/시장/레퍼런스 조사 내용" },
    { key: "direction", label: "방향 설정", input: "textarea", group: "content", placeholder: "컨셉, 디자인 방향, 의사결정 기준" },
    { key: "execution", label: "실행", input: "textarea", group: "content", placeholder: "시안 제작, 구현, 반복 개선 과정" },
    { key: "outcome", label: "결과", input: "textarea", group: "content", placeholder: "최종 결과와 배운 점" },
  ],

  // ─── Architecture ───
  architecture: [
    { key: "title", label: "구조 제목", input: "text", group: "content", placeholder: "예: 서비스 아키텍처", validation: { required: true } },
    { key: "summary", label: "요약", input: "textarea", group: "content", placeholder: "전체 구조를 간단히 설명" },
    { key: "frontend", label: "프론트엔드", input: "textarea", group: "content", placeholder: "화면, 상태관리, 라우팅, API 연동 구조" },
    { key: "backend", label: "백엔드", input: "textarea", group: "content", placeholder: "API 서버, 인증, 비즈니스 로직 구조" },
    { key: "database", label: "데이터/저장소", input: "textarea", group: "content", placeholder: "DB, 스토리지, 주요 데이터 흐름" },
    { key: "deployment", label: "배포", input: "textarea", group: "content", placeholder: "배포 환경, CI/CD, 운영 방식" },
    { key: "diagramImage", label: "구조 이미지", input: "imageUpload", group: "content" },
  ],

  // ─── Metric ───
  metric: [
    { key: "title", label: "성과 제목", input: "text", group: "content", placeholder: "예: 사용성 개선 결과", validation: { required: true } },
    { key: "value", label: "대표 수치", input: "text", group: "content", placeholder: "예: 32%" },
    { key: "label", label: "수치 설명", input: "text", group: "content", placeholder: "예: 작업 시간 단축" },
    { key: "description", label: "설명", input: "textarea", group: "content", placeholder: "성과가 어떤 의미인지 설명" },
    { key: "evidence", label: "근거", input: "textarea", group: "content", placeholder: "측정 방식, 테스트 결과, 피드백 등" },
  ],
};

/**
 * 블록에 fields가 없으면 기본값으로 채워주는 유틸
 */
export function injectDefaultFields<T extends { type: BlockType; fields?: import("./block.types").BlockField[] }>(
  block: T
): T {
  if (block.fields && block.fields.length > 0) return block;
  const defaults = BLOCK_DEFAULT_FIELDS[block.type];
  if (!defaults) return block;
  return { ...block, fields: defaults };
}
