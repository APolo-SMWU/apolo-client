import type {
  ChangeEventHandler,
  FormEventHandler,
  InputHTMLAttributes,
  ReactNode,
} from "react";
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
}: ProfileFormCardProps) {
  const requiredFieldsComplete = areRequiredProfileFieldsComplete(fields, values);

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
        {fields.map(({ label, errorMessage, ...inputProps }) => (
          <AuthInput
            key={inputProps.name}
            {...inputProps}
            label={label}
            errorMessage={errorMessage}
            value={values[inputProps.name] ?? ""}
            onChange={onFieldChange}
          />
        ))}
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
