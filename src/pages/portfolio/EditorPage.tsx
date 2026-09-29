import { useEffect, useRef, useState } from "react";
import { Navigate, useBlocker, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import CardSideNavigation from "@/pages/portfolio/components/CardSideNavigation";
import ModeButton from "@/pages/portfolio/components/ModeButton";
import ProfileBlock from "@/pages/portfolio/components/ProfileBlock";
import BlockRenderer from "@/pages/portfolio/components/BlockRenderer";
import { isProfileFieldVisible, profileFieldOptions, requiredProfileKinds } from "@/pages/portfolio/components/profileFieldOptions";
import type { ContentBlock, ProfileFieldKind, PortfolioDocument } from "@/types/portfolio";
import AddIcon from "@/assets/portfolio/Add.svg?react";
import Modal from "@/components/common/Modal";
import { updatePortfolio, uploadPortfolioAvatar, uploadPortfolioWorkImage } from "@/api/portfolio";
import { buildPortfolioUpdateRequest, hasDocumentChanged, resolveSavedWorkItemId } from "./editorDocument";
import { createClientId } from "./editor/editorUtils";
import { BlockEditor } from "./editor/BlockEditor";
import { EditableFrontCard, ProfilePreviewCard } from "./editor/EditableFrontCard";
import { EditableProfile } from "./editor/EditableProfile";
import { usePendingWorkImages } from "./editor/usePendingWorkImages";

const blockTypeOptions: Array<{ type: ContentBlock["type"]; label: string }> = [
  { type: "about", label: "About" },
  { type: "education", label: "Education" },
  { type: "experience", label: "Experiences" },
  { type: "activities", label: "Activities" },
  { type: "awards", label: "Awards" },
  { type: "certification", label: "Certification" },
  { type: "works", label: "Projects" },
  { type: "skills", label: "Skills" },
];

function normalizeEditorDocument(document: PortfolioDocument) {
  if (document.profile.title || !document.card.headline) return document;

  return {
    ...document,
    profile: {
      ...document.profile,
      title: document.card.headline,
    },
  };
}

function getEditorErrorMessage(error: unknown, fallback: string) {
  if (typeof error !== "object" || error === null) return fallback;
  const apiError = error as { message?: unknown; status?: unknown };
  if (apiError.status === 401) return "로그인이 만료되었어요. 다시 로그인해주세요.";
  if (apiError.status === 404) return "포트폴리오 또는 프로젝트를 찾을 수 없어요.";
  if (apiError.status === 422) return "이미지 형식이나 요청 내용을 확인해주세요.";
  return typeof apiError.message === "string" ? apiError.message : fallback;
}

function createEmptyBlock(type: ContentBlock["type"]): ContentBlock {
  const id = createClientId(`${type}-block`);
  if (type === "about") return { id, type, visible: true, description: "" };
  if (type === "skills") return { id, type, visible: true, categories: [] };
  if (type === "works") return { id, type, visible: true, items: [] };
  if (type === "awards" || type === "certification") {
    return { id, type, visible: true, items: [] };
  }
  return { id, type, visible: true, items: [] };
}

export default function EditorPage() {
  const location = useLocation();
  const editorState = (location.state as {
    document?: PortfolioDocument;
    side?: "front" | "back";
  } | null) ?? null;
  if (!editorState?.document) return <Navigate to="/home" replace />;

  return (
    <EditorPageContent
      initialDocument={normalizeEditorDocument(editorState.document)}
      initialSide={editorState.side ?? "back"}
    />
  );
}

function EditorPageContent({
  initialDocument,
  initialSide,
}: {
  initialDocument: PortfolioDocument;
  initialSide: "front" | "back";
}) {
  const navigate = useNavigate();
  const [side, setSide] = useState<"front" | "back">(initialSide);
  const [originalDocument, setOriginalDocument] = useState<PortfolioDocument>(initialDocument);
  const [draftDocument, setDraftDocument] = useState<PortfolioDocument>(initialDocument);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isBlockMenuOpen, setIsBlockMenuOpen] = useState(false);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadingWorkImageId, setUploadingWorkImageId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");
  const { files: pendingWorkImages, previews: workImagePreviews, select: selectWorkImage, remove: removePendingWorkImage } = usePendingWorkImages();
  const allowNavigationRef = useRef(false);
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const blocker = useBlocker(() => isDirty && !isSaving && !allowNavigationRef.current);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!selectedBlockId || selectedBlockId === "profile") return;
    blockRefs.current[selectedBlockId]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedBlockId]);

  function updateDraft(updater: (current: PortfolioDocument) => PortfolioDocument) {
    const nextDocument = updater(draftDocument);
    setDraftDocument(nextDocument);
    setIsDirty(hasDocumentChanged(originalDocument, nextDocument));
  }

  function updateProfileValue(key: "name" | "title", value: string) {
    updateDraft((current) => ({ ...current, profile: { ...current.profile, [key]: value } }));
  }

  function updateAddress(value: string) {
    updateDraft((current) => ({
      ...current,
      card: { ...current.card, organizationAddress: value || null },
    }));
  }

  async function handleAvatarChange(file: File) {
    if (!draftDocument.id || isUploadingAvatar) return;
    setIsUploadingAvatar(true);
    setSaveError("");
    try {
      const savedDocument = await uploadPortfolioAvatar(draftDocument.id, file);
      setOriginalDocument((current) => ({
        ...current,
        profile: { ...current.profile, avatarUrl: savedDocument.profile.avatarUrl },
      }));
      setDraftDocument((current) => ({
        ...current,
        profile: { ...current.profile, avatarUrl: savedDocument.profile.avatarUrl },
      }));
    } catch (error) {
      const message = getEditorErrorMessage(error, "프로필 사진을 업로드하지 못했어요.");
      setSaveError(message);
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  function handleWorkImageSelect(itemId: string, file: File) {
    const validationError = selectWorkImage(itemId, file);
    if (validationError) {
      setSaveError(validationError);
      return;
    }

    setSaveError("");
    setIsDirty(true);
  }

  function handleWorkImageDelete(itemId: string) {
    removePendingWorkImage(itemId);
    updateDraft((current) => ({
      ...current,
      blocks: current.blocks.map((block) =>
        block.type !== "works"
          ? block
          : {
              ...block,
              items: block.items.map((item) =>
                item.id === itemId ? { ...item, imageUrl: null } : item,
              ),
            },
      ),
    }));
  }

  function updateField(kind: ProfileFieldKind, value: string) {
    updateDraft((current) => {
      if (kind === "tel") {
        return {
          ...current,
          card: { ...current.card, tel: value || null },
        };
      }

      const existingField = current.profile.fields.find((field) => field.kind === kind);

      if (existingField) {
        return {
          ...current,
          profile: {
            ...current.profile,
            fields: current.profile.fields.map((field) =>
              field.kind === kind ? { ...field, value } : field,
            ),
          },
        };
      }

      const option = profileFieldOptions.find((field) => field.kind === kind);
      if (!option) return current;

      return {
        ...current,
        profile: {
          ...current.profile,
          fields: [
            ...current.profile.fields,
            { kind, label: option.label, value },
          ],
        },
      };
    });
  }

  function addField(kind: ProfileFieldKind) {
    const option = profileFieldOptions.find((field) => field.kind === kind);
    if (!option) return;
    updateDraft((current) => ({ ...current, profile: { ...current.profile, fields: [...current.profile.fields, { kind, label: option.label, value: "" }] } }));
  }

  function removeField(kind: ProfileFieldKind) {
    if (requiredProfileKinds.includes(kind)) return;
    updateDraft((current) => ({ ...current, profile: { ...current.profile, fields: current.profile.fields.filter((field) => field.kind !== kind) } }));
  }

  function reorderField(sourceKind: ProfileFieldKind, targetKind: ProfileFieldKind) {
    if (sourceKind === targetKind) return;
    updateDraft((current) => {
      const isVisibleField = (kind: ProfileFieldKind) =>
        isProfileFieldVisible(kind, current.userType) && (current.userType !== "student" || kind !== "tel");
      const visibleKinds = current.profile.fields
        .filter((field) => isVisibleField(field.kind))
        .map((field) => field.kind);
      const sourceIndex = visibleKinds.indexOf(sourceKind);
      const targetIndex = visibleKinds.indexOf(targetKind);
      if (sourceIndex < 0 || targetIndex < 0) return current;

      const reorderedKinds = [...visibleKinds];
      const [movedKind] = reorderedKinds.splice(sourceIndex, 1);
      reorderedKinds.splice(targetIndex, 0, movedKind);
      let visibleIndex = 0;
      const fields = current.profile.fields.map((field) => {
        if (!isVisibleField(field.kind)) return field;
        const nextKind = reorderedKinds[visibleIndex++];
        return current.profile.fields.find((candidate) => candidate.kind === nextKind) ?? field;
      });
      return { ...current, profile: { ...current.profile, fields } };
    });
  }

  async function saveDocument(shouldNavigate = true) {
    const hasPendingWorkImages = Object.keys(pendingWorkImages).length > 0;
    if (!isDirty && !hasPendingWorkImages) {
      if (shouldNavigate) {
        allowNavigationRef.current = true;
        navigate("/preview", { state: { document: draftDocument, side }, replace: true });
      }
      return true;
    }

    setIsSaving(true);
    setSaveError("");
    let savedDocument = draftDocument;
    try {
      if (isDirty) {
        savedDocument = await updatePortfolio(
          draftDocument.id,
          buildPortfolioUpdateRequest(originalDocument, draftDocument),
        );
        setOriginalDocument(savedDocument);
        setDraftDocument(savedDocument);
        setIsDirty(false);
      }

      for (const [itemId, file] of Object.entries(pendingWorkImages)) {
        setUploadingWorkImageId(itemId);
        const savedItemId = resolveSavedWorkItemId(draftDocument, savedDocument, itemId);
        savedDocument = await uploadPortfolioWorkImage(savedDocument.id, savedItemId, file);
        setOriginalDocument(savedDocument);
        setDraftDocument(savedDocument);
        removePendingWorkImage(itemId);
      }

      setIsDirty(false);
      if (shouldNavigate) {
        allowNavigationRef.current = true;
        navigate("/preview", { state: { document: savedDocument, side }, replace: true });
      }
      return true;
    } catch (error) {
      setIsDirty(true);
      const message = getEditorErrorMessage(error, "저장하지 못했어요. 수정 내용은 유지됩니다.");
      setSaveError(message);
      return false;
    } finally {
      setUploadingWorkImageId(null);
      setIsSaving(false);
    }
  }

  function moveBlock(sourceId: string, targetId: string) {
    if (sourceId === targetId) {
      setDraggedBlockId(null);
      setDragOverBlockId(null);
      return;
    }
    updateDraft((current) => {
      const sourceIndex = current.blocks.findIndex((block) => block.id === sourceId);
      const targetIndex = current.blocks.findIndex((block) => block.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return current;
      const blocks = [...current.blocks];
      const [moved] = blocks.splice(sourceIndex, 1);
      blocks.splice(targetIndex, 0, moved);
      return { ...current, blocks };
    });
    setDraggedBlockId(null);
    setDragOverBlockId(null);
  }

  function updateBlock(nextBlock: ContentBlock) {
    updateDraft((current) => ({
      ...current,
      blocks: current.blocks.map((currentBlock) =>
        currentBlock.id === nextBlock.id ? nextBlock : currentBlock,
      ),
    }));
  }

  function removeBlock(blockId: string) {
    updateDraft((current) => ({
      ...current,
      blocks: current.blocks.filter((block) => block.id !== blockId),
    }));
    setSelectedBlockId((current) => current === blockId ? null : current);
  }

  const availableBlockTypes = blockTypeOptions.filter(
    ({ type }) => !draftDocument.blocks.some((block) => block.type === type),
  );

  function addBlock(type: ContentBlock["type"]) {
    if (draftDocument.blocks.some((block) => block.type === type)) return;

    const block = createEmptyBlock(type);
    updateDraft((current) => ({ ...current, blocks: [...current.blocks, block] }));
    setSelectedBlockId(block.id);
    setIsBlockMenuOpen(false);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <Header />
      <main
        className={`relative flex min-h-0 flex-1 flex-col overflow-hidden text-ink ${side === "front" ? "bg-apolo px-6 pt-8 pb-0" : "bg-white"}`}
        onClick={() => setSelectedBlockId(null)}
      >
        <div className={`flex min-h-0 flex-1 flex-col overflow-auto ${side === "back" ? "p-4" : ""}`}>
          {side === "front" ? (
            <div className="flex flex-1 items-center justify-center">
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedBlockId("profile");
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  setSelectedBlockId("profile");
                }}
              >
                {selectedBlockId === "profile" ? (
                  <EditableFrontCard document={draftDocument} onProfileChange={updateProfileValue} onChange={updateField} onAddressChange={updateAddress} />
                ) : (
                  <ProfilePreviewCard document={draftDocument} />
                )}
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col items-start gap-6 md:flex-row">
              <div
                className="shrink-0"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedBlockId("profile");
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  setSelectedBlockId("profile");
                }}
              >
                {selectedBlockId === "profile" ? (
                  <EditableProfile
                    document={draftDocument}
                    isSelected
                    onSelect={() => setSelectedBlockId("profile")}
                    onProfileChange={updateProfileValue}
                    onFieldChange={updateField}
                    onFieldAdd={addField}
                    onFieldRemove={removeField}
                    onFieldReorder={reorderField}
                    onAvatarChange={(file) => void handleAvatarChange(file)}
                    isUploadingAvatar={isUploadingAvatar}
                    themeId={draftDocument.siteDesignId}
                  />
                ) : (
                  <ProfileBlock profile={draftDocument.profile} userType={draftDocument.userType} />
                )}
              </div>
              <div className={`flex min-w-0 flex-1 flex-col gap-6 ${isSaving ? "pointer-events-none opacity-60" : ""}`}>
                <div className="relative flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-body-02 text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => setIsBlockMenuOpen((current) => !current)}
                    disabled={availableBlockTypes.length === 0}
                    aria-expanded={isBlockMenuOpen}
                    aria-haspopup="menu"
                  >
                    <AddIcon className="size-6" aria-hidden="true" />
                    블록 추가
                  </button>
                  {isBlockMenuOpen && availableBlockTypes.length > 0 && (
                    <div
                      className="absolute right-0 top-full z-20 mt-2 flex min-w-44 flex-col rounded-lg border border-placeholder bg-white p-1 shadow-lg"
                      role="menu"
                      aria-label="추가할 블록"
                    >
                      {availableBlockTypes.map(({ type, label }) => (
                        <button
                          key={type}
                          type="button"
                          className="rounded-md px-3 py-2 text-left text-caption-01 hover:bg-focus"
                          onClick={() => addBlock(type)}
                          role="menuitem"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {draftDocument.blocks.map((block) => (
                  <div
                    key={block.id}
                    ref={(element) => {
                      blockRefs.current[block.id] = element;
                    }}
                    draggable
                    onDragStart={(event) => {
                      setDraggedBlockId(block.id);
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", block.id);
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragOverBlockId(block.id);
                    }}
                    onDragLeave={() => setDragOverBlockId(null)}
                    onDrop={(event) => {
                      event.preventDefault();
                      moveBlock(event.dataTransfer.getData("text/plain"), block.id);
                    }}
                    onDragEnd={() => {
                      setDraggedBlockId(null);
                      setDragOverBlockId(null);
                    }}
                    className={`cursor-grab rounded-xl active:cursor-grabbing ${draggedBlockId === block.id ? "opacity-60" : ""} ${dragOverBlockId === block.id ? "ring-2 ring-primary" : ""}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedBlockId(block.id);
                    }}
                  >
                    {selectedBlockId === block.id ? (
                      <BlockEditor
                        block={block}
                        isSelected
                        onSelect={() => setSelectedBlockId(block.id)}
                        onChange={updateBlock}
                        onRemove={() => removeBlock(block.id)}
                        onImageSelect={handleWorkImageSelect}
                        onImageDelete={handleWorkImageDelete}
                        imagePreviews={workImagePreviews}
                        uploadingItemId={uploadingWorkImageId}
                        themeId={draftDocument.siteDesignId}
                      />
                    ) : (
                      <BlockRenderer block={block} themeId={draftDocument.siteDesignId} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="relative sticky bottom-0 z-10 mx-auto flex w-full max-w-[1200px] shrink-0 items-center justify-center bg-transparent px-4 py-2">
            {saveError && <p role="alert" className="absolute bottom-full z-10 mb-3 rounded-full bg-danger/10 px-4 py-2 text-center text-caption-01 text-danger">{saveError}</p>}
            <div className="flex items-center justify-center gap-4">
              <CardSideNavigation side={side} onSideChange={setSide} />
              <ModeButton
                mode="edit"
                onClick={() => void saveDocument()}
                disabled={isSaving}
              />
            </div>
        </div>
      </main>
      {blocker.state === "blocked" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <Modal
            title="저장하지 않고 나가시겠습니까?"
            description="저장하지 않은 수정 내용은 사라집니다."
            onCancel={() => blocker.reset()}
            onConfirm={() => {
              allowNavigationRef.current = true;
              blocker.proceed();
            }}
          />
        </div>
      )}
    </div>
  );
}
