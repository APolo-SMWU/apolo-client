import { useLayoutEffect, useRef, useState, type InputHTMLAttributes } from "react";
export function HugInput({
  value,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { value: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState<number>();

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const styles = window.getComputedStyle(input);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    context.font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
    const textWidth = context.measureText(value || " ").width;
    const horizontalPadding = Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight);

    setWidth(Math.ceil(textWidth + horizontalPadding + 2));
  }, [value, props.className]);

  return (
    <input
      {...props}
      ref={inputRef}
      value={value}
      style={{ ...props.style, width: width ?? "fit-content" }}
    />
  );
}
