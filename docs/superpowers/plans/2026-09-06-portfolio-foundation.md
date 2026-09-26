# Portfolio Foundation Implementation Plan

> **For agentic workers:** Implement this plan task-by-task with review checkpoints.

**Goal:** Establish a backend-ready portfolio document model and render the first Profile block in Preview without coupling its placement to a single design.

**Architecture:** `PortfolioDocument` owns profile data and ordered content blocks. A design renderer owns layout placement, while Profile field definitions own link behavior and editor availability. The first implementation uses local mock data and can later be replaced by an API adapter.

**Tech Stack:** React, TypeScript, React Router, existing Tailwind classes, existing SVG assets.

**Spec:** User-approved requirements in the conversation; the previously created design spec was removed at the user's request.

## Global Constraints

- Do not create test files.
- Profile is not permanently tied to a sidebar position.
- Email and GitHub are required Profile entries.
- Optional Profile entries are company, scholar, university, notion, blog, linkedin, and phone.
- Velog, blog, and Tistory share the `blog` kind.
- Existing entries must be excluded from the add-field menu.

### Task 1: Domain types and mock document

**Files:**
- Create: `src/types/portfolio.ts`
- Create: `src/data/mockPortfolio.ts`

- [ ] Define `ProfileData`, `ProfileField`, `ContentBlock`, `WorkItem`, and `PortfolioDocument` with discriminated unions.
- [ ] Define stable Profile field kinds and required/optional metadata.
- [ ] Create a mock document with onboarding-derived Profile values and the eight content block types.
- [ ] Verify with `npm run build`.

### Task 2: Profile view components

**Files:**
- Create: `src/components/portfolio/ProfileBlock.tsx`
- Create: `src/components/portfolio/ProfileFieldIcon.tsx`

- [ ] Render name and job title.
- [ ] Render required and available optional fields from data.
- [ ] Use `mailto:` for email, external links for link fields, and `tel:` for phone.
- [ ] Render non-link display fields as plain text.
- [ ] Verify with `npm run build` and `npm run lint`.

### Task 3: Preview shell

**Files:**
- Modify: `src/pages/portfolio/PreviewPage.tsx`
- Modify: `src/App.tsx`

- [ ] Render the front business card and back website view with a front/back state.
- [ ] Add bottom navigation arrows and preserve Header/Footer.
- [ ] Render Profile and mock content blocks in the back view.
- [ ] Add `/preview` route if it is not already connected.
- [ ] Verify with `npm run build` and `npm run lint`.

### Task 4: Editor-ready field contract

**Files:**
- Create: `src/components/portfolio/profileFieldOptions.ts`
- Create: `src/pages/portfolio/EditorPage.tsx`
- Modify: `src/App.tsx`

- [ ] Build the Profile editor from the same field definitions.
- [ ] Show only unused optional fields in the add menu.
- [ ] Support editing values and removing optional fields.
- [ ] Keep required Email and GitHub fields visible.
- [ ] Add `/editor` route.
- [ ] Verify with `npm run build` and `npm run lint`.
