import { useEffect, useRef, useState } from "react";
import { useBlocker, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import CardSideNavigation from "@/pages/portfolio/components/CardSideNavigation";
import ModeButton from "@/pages/portfolio/components/ModeButton";
import ProfileBlock from "@/pages/portfolio/components/ProfileBlock";
import BlockRenderer from "@/pages/portfolio/components/BlockRenderer";
import { mockPortfolio } from "@/data/mockPortfolio";
import { isProfileFieldVisible, profileFieldOptions, requiredProfileKinds } from "@/pages/portfolio/components/profileFieldOptions";
import type { ContentBlock, ProfileFieldKind, PortfolioDocument } from "@/types/portfolio";
import AddIcon from "@/assets/portfolio/Add.svg?react";
import Modal from "@/components/common/Modal";
import { updatePortfolio, uploadPortfolioAvatar } from "@/api/portfolio";
import { buildPortfolioUpdateRequest, hasDocumentChanged } from "./editorDocument";
import { createClientId } from "./editor/editorUtils";
import { BlockEditor } from "./editor/BlockEditor";
import { EditableFrontCard, ProfilePreviewCard } from "./editor/EditableFrontCard";
import { EditableProfile } from "./editor/EditableProfile";

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
  const navigate = useNavigate();
  const location = useLocation();
  const editorState = (location.state as {
    document?: PortfolioDocument;
    side?: "front" | "back";
  } | null) ?? null;
  const forceMockDocument = import.meta.env.DEV && new URLSearchParams(location.search).get("mock") === "1";
  const sourceDocument = forceMockDocument ? mockPortfolio : editorState?.document ?? mockPortfolio;
  const initialDocument = normalizeEditorDocument(sourceDocument);
  const [side, setSide] = useState<"front" | "back">(editorState?.side ?? "back");
  const [originalDocument, setOriginalDocument] = useState<PortfolioDocument>(initialDocument);
  const [draftDocument, setDraftDocument] = useState<PortfolioDocument>(initialDocument);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [newBlockType, setNewBlockType] = useState<ContentBlock["type"]>("experience");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [saveError, setSaveError] = useState("");
  const allowNavigationRef = useRef(false);
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
      const message =
        typeof error === "object" && error !== null && "message" in error && typeof error.message === "string"
          ? error.message
          : "프로필 사진을 업로드하지 못했어요.";
      setSaveError(message);
    } finally {
      setIsUploadingAvatar(false);
    }
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
    if (!isDirty) {
      if (shouldNavigate) {
        allowNavigationRef.current = true;
        navigate("/preview", { state: { document: draftDocument, side }, replace: true });
      }
      return true;
    }

    setIsSaving(true);
    setSaveError("");
    try {
      const saved = await updatePortfolio(
        draftDocument.id,
        buildPortfolioUpdateRequest(originalDocument, draftDocument),
      );
      setOriginalDocument(saved);
      setDraftDocument(saved);
      setIsDirty(false);
      if (shouldNavigate) {
        allowNavigationRef.current = true;
        navigate("/preview", { state: { document: saved, side }, replace: true });
      }
      return true;
    } catch (error) {
      const message =
        typeof error === "object" && error !== null && "message" in error && typeof error.message === "string"
          ? error.message
          : "저장하지 못했어요. 수정 내용은 유지됩니다.";
      setSaveError(message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  function moveBlock(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;
    updateDraft((current) => {
      const sourceIndex = current.blocks.findIndex((block) => block.id === sourceId);
      const targetIndex = current.blocks.findIndex((block) => block.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return current;
      const blocks = [...current.blocks];
      const [moved] = blocks.splice(sourceIndex, 1);
      blocks.splice(targetIndex, 0, moved);
      return { ...current, blocks };
    });
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

  function addBlock() {
    const block = createEmptyBlock(newBlockType);
    updateDraft((current) => ({ ...current, blocks: [...current.blocks, block] }));
    setSelectedBlockId(block.id);
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
                    themeId={draftDocument.cardDesignId}
                  />
                ) : (
                  <ProfileBlock profile={draftDocument.profile} userType={draftDocument.userType} />
                )}
              </div>
              <div className={`flex min-w-0 flex-1 flex-col gap-6 ${isSaving ? "pointer-events-none opacity-60" : ""}`}>
                {draftDocument.blocks.map((block) => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData("text/plain", block.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      moveBlock(event.dataTransfer.getData("text/plain"), block.id);
                    }}
                    className="cursor-grab active:cursor-grabbing"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedBlockId(block.id);
                    }}
                    onPointerDown={(event) => {
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
                        themeId={draftDocument.cardDesignId}
                      />
                    ) : (
                      <BlockRenderer block={block} themeId={draftDocument.cardDesignId} />
                    )}
                  </div>
                ))}
                <div className="flex items-center justify-end gap-2 rounded-xl border border-dashed border-placeholder p-3">
                  <label className="sr-only" htmlFor="new-block-type">추가할 블록</label>
                  <select
                    id="new-block-type"
                    className="rounded-md border border-placeholder bg-white px-2 py-1 text-caption-01"
                    value={newBlockType}
                    onChange={(event) => setNewBlockType(event.target.value as ContentBlock["type"])}
                  >
                    <option value="about">About</option>
                    <option value="education">Education</option>
                    <option value="experience">Experience</option>
                    <option value="activities">Activities</option>
                    <option value="awards">Awards</option>
                    <option value="certification">Certification</option>
                    <option value="works">Projects</option>
                    <option value="skills">Skills</option>
                  </select>
                  <button type="button" className="inline-flex items-center gap-1 text-caption-01 text-primary" onClick={addBlock}>
                    <AddIcon className="size-5" aria-hidden="true" />
                    블록 추가
                  </button>
                </div>
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
