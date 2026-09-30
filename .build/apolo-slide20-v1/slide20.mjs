import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const SKILL_DIR = "/Users/dain/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations";
const TMP_DIR = "/Users/dain/Desktop/workspace/apolo-client/.build/apolo-slide20-v1";
await fs.mkdir(TMP_DIR, { recursive: true });
const { resolvePresentationFont } = await import(pathToFileURL(path.join(SKILL_DIR, "container_tools/artifact_tool_utils.mjs")).href);
const font = resolvePresentationFont();
const deck = Presentation.create({ slideSize: { width: 1280, height: 720 } });
const slide = deck.slides.add();

const C = {
  bg: "#F7FAFF", navy: "#172B4D", blue: "#2F64FF", pale: "#E8F0FF",
  line: "#C6D7FF", muted: "#647592", white: "#FFFFFF", darkBlue: "#18345C",
};
slide.background.fill = C.bg;

function box({ geometry = "rect", left, top, width, height, fill = "none", lineFill = "none", lineWidth = 0, radius }) {
  const s = slide.shapes.add({ geometry, position: { left, top, width, height }, fill, line: { fill: lineFill, width: lineWidth } });
  if (radius) s.borderRadius = radius;
  return s;
}
function txt(value, { left, top, width, height, size = 20, color = C.navy, bold = false, align = "left" }) {
  const s = slide.shapes.add({ geometry: "textbox", position: { left, top, width, height }, fill: "none", line: { fill: "none", width: 0 } });
  s.text = value;
  s.text.style = { typeface: font, fontSize: size, color, bold, align, verticalAlignment: "mid", autoFit: "shrinkTextOnOverflow" };
  return s;
}

txt("CORE VALUE / NEXT VALIDATION", { left: 72, top: 44, width: 420, height: 28, size: 19, color: C.blue, bold: true });
txt("한 번 만든 문서가 아니라,\n계속 활용되는 경력 데이터", { left: 72, top: 78, width: 760, height: 92, size: 42, color: C.navy, bold: true });
txt("경험이 쌓일수록 더 많은 결과물과 기회로 연결됩니다.", { left: 76, top: 178, width: 660, height: 28, size: 19, color: C.muted });

// Core value path
const nodes = [
  { x: 92, title: "한 번 입력", body: "경험과 근거를\n하나의 구조로 정리" },
  { x: 350, title: "여러 번 활용", body: "명함·프로필·포트폴리오로\n목적에 맞게 변환" },
  { x: 608, title: "계속 갱신", body: "새로운 경험을 추가하면\n기존 결과물에도 반영" },
];
box({ left: 104, top: 285, width: 710, height: 4, fill: C.line, lineFill: C.line });
for (const [i, n] of nodes.entries()) {
  box({ geometry: "ellipse", left: n.x, top: 252, width: 70, height: 70, fill: C.blue, lineFill: C.blue });
  txt(String(i + 1).padStart(2, "0"), { left: n.x, top: 261, width: 70, height: 50, size: 22, color: C.white, bold: true, align: "center" });
  txt(n.title, { left: n.x - 42, top: 344, width: 154, height: 34, size: 22, color: C.navy, bold: true, align: "center" });
  txt(n.body, { left: n.x - 60, top: 386, width: 190, height: 52, size: 16, color: C.muted, align: "center" });
}
box({ left: 735, top: 227, width: 470, height: 235, fill: C.white, lineFill: C.line, lineWidth: 2, radius: "rounded-2xl" });
txt("APolo의 핵심 가치", { left: 768, top: 251, width: 320, height: 30, size: 20, color: C.blue, bold: true });
txt("경험을 한 번 정리하면,\n필요한 순간마다 다시 쓸 수 있습니다.", { left: 768, top: 294, width: 390, height: 76, size: 27, color: C.navy, bold: true });
txt("개인의 경력을 ‘제출용 문서’에서\n‘계속 살아있는 데이터’로 바꿉니다.", { left: 768, top: 389, width: 380, height: 48, size: 17, color: C.muted });

// Validation band
box({ left: 72, top: 520, width: 1136, height: 132, fill: C.darkBlue, lineFill: C.darkBlue, radius: "rounded-2xl" });
txt("NEXT VALIDATION", { left: 104, top: 540, width: 220, height: 24, size: 16, color: "#9DB7FF", bold: true });
txt("다음 검증 과제", { left: 104, top: 568, width: 220, height: 36, size: 25, color: C.white, bold: true });
const tests = [
  ["사용성", "사용자가 생성 후에도\n다시 편집·공유하는가"],
  ["품질", "경험과 근거를\n정확히 연결하는가"],
  ["확장성", "기관과 기업이 실제 업무에\n활용할 의향이 있는가"],
];
for (let i = 0; i < tests.length; i++) {
  const x = 394 + i * 255;
  box({ left: x, top: 548, width: 218, height: 80, fill: "#294A7B", lineFill: "#4D6FA8", lineWidth: 1, radius: "rounded-xl" });
  txt(tests[i][0], { left: x + 18, top: 558, width: 182, height: 24, size: 18, color: "#BFD0FF", bold: true, align: "center" });
  txt(tests[i][1], { left: x + 14, top: 586, width: 190, height: 38, size: 14, color: C.white, align: "center" });
}

slide.speakerNotes.textFrame.setText("핵심 가치: 한 번 만든 문서가 아니라 계속 활용되고 갱신되는 경력 데이터. 다음 검증 과제: 사용성, 생성 품질, 기관·기업 활용 가능성.");
const draft = path.join(TMP_DIR, "apolo-slide20-draft.pptx");
await (await PresentationFile.exportPptx(deck)).save(draft);
const preview = await deck.export({ slide, format: "png", scale: 1 });
await fs.writeFile(path.join(TMP_DIR, "slide20.png"), new Uint8Array(await preview.arrayBuffer()));
console.log(JSON.stringify({ preview: path.join(TMP_DIR, "slide20.png"), draft, font }, null, 2));
