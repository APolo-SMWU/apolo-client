import AppWindow from "@/components/AppWindow";
import Button from "@/components/common/Button";
import { useNavigate } from "react-router-dom";

export default function CreateModal() {
  const navigate = useNavigate();
  return (
    <AppWindow
      className="relative z-10 w-[500px]"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-heading-01 font-bold text-ink leading-[1.0]">
          Create Your<br />
          Personal Online Card
        </h1>
        <p className="text-body-02 text-placeholder">
          자신만의 온라인 명함을 만들어보세요
        </p>
      </div>
      <div className="flex w-full items-center justify-end">
        <Button onClick={() => navigate("/create")}>
          Create
        </Button>
      </div>
    </AppWindow>
  )
}
