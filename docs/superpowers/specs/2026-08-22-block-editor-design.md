# Block Editor Design

## Goal

Port the functional block editor from `apolo-components` into `apolo-client` while preserving the existing editor header and AI request footer. The middle section will provide a block list, editable portfolio canvas, and block settings panel.

## API Flow

1. `PromptPage` sends the user's generation inputs to `POST /portfolios`.
2. It calls `POST /portfolios/:portfolioId/generate` with authentication.
3. The generated `portfolio` response initializes the editor and the app navigates to `/block-editor/:portfolioId`.
4. Until a portfolio detail endpoint exists, direct page reloads cannot restore the editor state. The generated response is passed through navigation state.

## Editor Data

The editor reads `currentContentJson.portfolioTemplate`. Each server block is normalized with `BLOCK_REGISTRY` using its `type`, supplying the client-only category, label, field definitions, defaults, and edit permissions.

When `portfolioContent` is absent, the loader generates editable values from each field's placeholder or a Korean fallback such as `제목을 입력해주세요` and `내용을 입력해주세요`. If a future AI response includes `portfolioContent.values`, those values take precedence without changing the editor UI.

## Components

- Copy the block types, registry, defaults, renderers, editor controls, and Zustand store from `apolo-components`, adapting imports and project styling.
- Add the required editor dependencies: Zustand, zundo, Immer, and dnd-kit.
- Keep the existing `BlockEditorPage` header and AI request footer.
- Replace only the empty middle section with a three-column editor workspace.
- Render the left block list inside the existing design system component:

  `WindowCard` with `label="BLOCK_LIST"`, `variant="black"`, `className="relative z-10 w-[300px]"`, and `bodyClassName="flex flex-col px-6 py-9"`.

## Editing Behavior

The initial release supports selection, field editing, block add/delete/duplicate, visibility toggle, drag reorder, and local undo/redo. Since no persistence endpoint is currently specified, the save action reports local editor state only; API persistence is intentionally deferred.

## Verification

Validate the API adapter with generated portfolio fixtures, block normalization with missing metadata, placeholder content creation, and editor interactions. Run lint and production build after integration.
