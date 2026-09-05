import type {
  ChangeEventHandler,
  FormEventHandler,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import { useLayoutEffect, useRef } from "react";
import AppWindow from "../AppWindow";
import AuthInput from "../AuthInput";
import PhotoUploader from "../PhotoUploader";
import CTAButton from "./CTAButton";
import {
  areRequiredProfileFieldsComplete,
  type ProfileFormValues,
} from "./profileForm";

export type { ProfileFormValues } from "./profileForm";

export type ProfileFormField = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name" | "value" | "onChange"
> & {
  name: string;
  label: string;
  errorMessage?: string;
  halfWidth?: boolean;
};

type ProfileFormCardProps = {
  title?: ReactNode;
  windowTitle?: string;
  description?: ReactNode;
  fields: ProfileFormField[];
  values: ProfileFormValues;
  onFieldChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  submitLabel?: string;
  submitDisabled?: boolean;
  photoUploader?: ReactNode;
  className?: string;
  animateFieldChanges?: boolean;
};

export default function ProfileFormCard({
  title,
  windowTitle,
  description,
  fields,
  values,
  onFieldChange,
  onSubmit,
  submitLabel = "저장하기",
  submitDisabled = false,
  photoUploader = <PhotoUploader />,
  className,
  animateFieldChanges = false,
}: ProfileFormCardProps) {
  const requiredFieldsComplete = areRequiredProfileFieldsComplete(fields, values);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const previousLayout = useRef<{ height: number; tops: Map<string, number> } | null>(null);
  const fieldKey = fields.map((field) => field.name).join(",");

  useLayoutEffect(() => {
    const container = fieldsRef.current;
    if (!container || !animateFieldChanges) return;

    const currentHeight = container.getBoundingClientRect().height;
    container.getAnimations().forEach((animation) => animation.cancel());
    const items = Array.from(container.children) as HTMLElement[];
    items.forEach((item) => item.getAnimations().forEach((animation) => animation.cancel()));

    const nextLayout = {
      height: container.getBoundingClientRect().height,
      tops: new Map(items.map((item) => [item.dataset.field!, item.offsetTop])),
    };
    const previous = previousLayout.current;
    previousLayout.current = nextLayout;
    if (!previous || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timing = { duration: 1000, easing: "cubic-bezier(0.22, 1, 0.36, 1)" };
    // Animate actual height so the save button and window edge move with the fields.
    const fromHeight = currentHeight === nextLayout.height ? previous.height : currentHeight;
    container.animate([{ height: `${fromHeight}px` }, { height: `${nextLayout.height}px` }], timing);

    items.forEach((item) => {
      const previousTop = previous.tops.get(item.dataset.field!);
      const isNew = previousTop === undefined;
      const offset = isNew ? -6 : previousTop - item.offsetTop;
      if (!isNew && offset === 0) return;
      item.animate([
        { opacity: isNew ? 0 : 1, transform: `translateY(${offset}px)` },
        { opacity: 1, transform: "translateY(0)" },
      ], timing);
    });
  }, [fieldKey, animateFieldChanges]);

  return (
    <AppWindow className={className} title={windowTitle}>
      {title || description ? (
        <div className="flex flex-col gap-2">
          {title ? (
            <h1 className="text-heading-01 font-bold leading-[1.0] text-ink">{title}</h1>
          ) : null}
          {description ? (
            <p className="text-body-02 text-placeholder">{description}</p>
          ) : null}
        </div>
      ) : null}

      <form className="flex w-full flex-col gap-3" onSubmit={onSubmit}>
        {photoUploader}
        <div ref={fieldsRef} className="relative grid w-full grid-cols-2 content-start gap-x-2.5 gap-y-4">
        {fields.map(({ label, errorMessage, halfWidth, ...inputProps }) => (
          <div key={inputProps.name} data-field={inputProps.name} className={halfWidth ? "col-span-1 min-w-0" : "col-span-2 min-w-0"}>
          <AuthInput
            {...inputProps}
            className={halfWidth ? `w-full! ${inputProps.className ?? ""}` : inputProps.className}
            label={label}
            errorMessage={errorMessage}
            value={values[inputProps.name] ?? ""}
            onChange={onFieldChange}
          />
          </div>
        ))}
        </div>
        <div className="mt-3 flex w-full items-center justify-end">
          <CTAButton
            type="submit"
            disabled={!requiredFieldsComplete || submitDisabled}
          >
            {submitLabel}
          </CTAButton>
        </div>
      </form>
    </AppWindow>
  );
}
