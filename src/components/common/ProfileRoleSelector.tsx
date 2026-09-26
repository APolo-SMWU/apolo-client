import PhotoUploader from "@/components/PhotoUploader";
import { roles, type Role } from "./profileRoles";

type ProfileRoleSelectorProps = {
  role: Role | null;
  onRoleChange: (role: Role) => void;
  showPhoto?: boolean;
};

export default function ProfileRoleSelector({ role, onRoleChange, showPhoto = true }: ProfileRoleSelectorProps) {
  return (
    <div className="mb-1 flex flex-wrap items-end justify-between gap-4">
      {showPhoto && <PhotoUploader className="size-20! shrink-0" />}
      <fieldset className={`min-w-0 flex-1 ${showPhoto ? "basis-[310px] sm:w-[312px] sm:flex-none" : "w-full"}`}>
        <legend className="mb-2 text-caption-01 text-ink">
          Role <span className="text-danger">*</span>
        </legend>
        <div className="flex gap-2">
          {roles.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={role === option}
              onClick={() => onRoleChange(option)}
              className={`h-10 min-w-0 flex-1 rounded-ml border px-2 text-body-02 transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                role === option
                  ? "border-focus bg-primary text-white"
                  : "border-placeholder bg-white text-placeholder"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
