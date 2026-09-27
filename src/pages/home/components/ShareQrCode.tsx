import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Button from "@/components/common/Button";

type ShareQrCodeProps = {
  value: string;
};

export default function ShareQrCode({ value }: ShareQrCodeProps) {
  const [qrCode, setQrCode] = useState<{ value: string; dataUrl: string } | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!value) return () => {
      cancelled = true;
    };

    QRCode.toDataURL(value, {
      width: 180,
      margin: 2,
      errorCorrectionLevel: "M",
    })
      .then((nextDataUrl) => {
        if (!cancelled) setQrCode({ value, dataUrl: nextDataUrl });
      })
      .catch(() => {
        if (!cancelled) setQrCode(null);
      });

    return () => {
      cancelled = true;
    };
  }, [value]);

  const dataUrl = qrCode?.value === value ? qrCode.dataUrl : "";

  function downloadQrCode() {
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "online-card-qr.png";
    link.click();
  }

  if (!dataUrl) return null;

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <button
        type="button"
        aria-label="QR 이미지 저장"
        onClick={downloadQrCode}
        className="rounded-md focus-visible:outline-2 focus-visible:outline-primary"
      >
        <img
          src={dataUrl}
          alt="공유 링크 QR 코드"
          width={180}
          height={180}
          draggable={false}
          className="block size-[180px]"
        />
      </button>
      <Button type="button" onClick={downloadQrCode} className="w-50">
        QR 이미지 저장
      </Button>
    </div>
  );
}
