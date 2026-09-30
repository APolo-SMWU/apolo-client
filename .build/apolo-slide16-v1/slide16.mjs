import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const { SKILL_DIR, TMP_DIR, FINAL_PPTX } = process.env;
if (!path.isAbsolute(SKILL_DIR ?? "") || !path.isAbsolute(TMP_DIR ?? "") || !path.isAbsolute(FINAL_PPTX ?? "")) {
  throw new Error("SKILL_DIR, TMP_DIR, and FINAL_PPTX must be absolute paths");
}

const { resolvePresentationFont } = await import(
  pathToFileURL(path.join(SKILL_DIR, "container_tools/artifact_tool_utils.mjs")).href,
);

await fs.mkdir(TMP_DIR, { recursive: true });
await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true });

const font = resolvePresentationFont();
const deck = Presentation.create({ slideSize: { width: 1280, height: 720 } });
const slide = deck.slides.add();

const C = {
  bg: "#F6FAFF",
  white: "#FFFFFF",
  navy: "#172B4D",
  blue: "#2F64FF",
  midBlue: "#7EA2FF",
  paleBlue: "#E8F0FF",
  line: "#C8D8FF",
  muted: "#66758F",
};

slide.background.fill = C.bg;

function shape({ geometry = "rect", left, top, width, height, fill = "none", lineFill = "none", lineWidth = 0, radius }) {
  const s = slide.shapes.add({
    geometry,
    position: { left, top, width, height },
    fill,
    line: { fill: lineFill, width: lineWidth },
  });
  if (radius) s.borderRadius = radius;
  return s;
}

function text(value, { left, top, width, height, size = 20, color = C.navy, bold = false, align = "left", valign = "mid" }) {
  const s = slide.shapes.add({
    geometry: "textbox",
    position: { left, top, width, height },
    fill: "none",
    line: { fill: "none", width: 0 },
  });
  s.text = value;
  s.text.style = {
    typeface: font,
    fontSize: size,
    color,
    bold,
    align,
    verticalAlignment: valign,
    autoFit: "shrinkTextOnOverflow",
  };
  return s;
}

// Header
text("USER VALUE", { left: 72, top: 46, width: 180, height: 26, size: 20, color: C.blue, bold: true });
text("정리된 경력 데이터는 필요한 순간에 다시 쓰입니다.", {
  left: 72, top: 78, width: 1070, height: 62, size: 40, color: C.navy, bold: true,
});
text("생성 이후에도 직접 편집하고, 목적에 맞게 공개하고, 경험이 쌓일수록 업데이트합니다.", {
  left: 74, top: 147, width: 900, height: 28, size: 19, color: C.muted,
});
text("APolo", { left: 1080, top: 52, width: 128, height: 32, size: 24, color: C.blue, bold: true, align: "right" });

// Main flow line
shape({ left: 154, top: 333, width: 972, height: 4, fill: C.line, lineFill: C.line, lineWidth: 0 });

const steps = [
  { x: 170, n: "01", title: "직접 편집", body: "AI 결과를 내 표현과\n목적에 맞게 다듬습니다." },
  { x: 430, n: "02", title: "공개 범위 선택", body: "필요한 경험만 골라\n나만의 페이지로 공개합니다." },
  { x: 690, n: "03", title: "링크·QR 공유", body: "지원과 네트워킹에서\n바로 전달할 수 있습니다." },
  { x: 950, n: "04", title: "계속 업데이트", body: "새로운 경험을 추가하면\n기존 결과물에도 반영됩니다." },
];

for (const step of steps) {
  shape({ geometry: "ellipse", left: step.x, top: 292, width: 84, height: 84, fill: C.blue, lineFill: C.blue, lineWidth: 0 });
  text(step.n, { left: step.x, top: 302, width: 84, height: 62, size: 24, color: C.white, bold: true, align: "center" });
  text(step.title, { left: step.x - 45, top: 404, width: 174, height: 34, size: 23, color: C.navy, bold: true, align: "center" });
  text(step.body, { left: step.x - 55, top: 446, width: 194, height: 54, size: 17, color: C.muted, align: "center" });
}

// Bottom takeaway band
shape({ left: 72, top: 590, width: 1136, height: 74, fill: C.navy, lineFill: C.navy, lineWidth: 0, radius: "rounded-2xl" });
text("문서 하나를 만드는 서비스가 아니라, 경력을 계속 사용하는 서비스입니다.", {
  left: 110, top: 603, width: 1060, height: 48, size: 24, color: C.white, bold: true, align: "center",
});

slide.speakerNotes.textFrame.setText("APolo 사용자 가치: 생성 이후 편집, 공개 범위 선택, 링크·QR 공유, 지속 업데이트가 이어진다.");

const draft = path.join(TMP_DIR, "apolo-slide16-draft.pptx");
await (await PresentationFile.exportPptx(deck)).save(draft);
const preview = await deck.export({ slide, format: "png", scale: 1 });
await fs.writeFile(path.join(TMP_DIR, "slide16.png"), new Uint8Array(await preview.arrayBuffer()));
const layout = await slide.export({ format: "layout" });
await fs.writeFile(path.join(TMP_DIR, "slide16.layout.json"), await layout.text());
console.log(JSON.stringify({ draft, preview: path.join(TMP_DIR, "slide16.png"), font, final: FINAL_PPTX }, null, 2));
