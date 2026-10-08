import React from "react";
import { Dialog } from "./ui/dialog";
import { ConsultationFlow } from "./consultation-flow";

interface ConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialBhk?: "1 BHK" | "2 BHK" | "3 BHK" | "4 BHK / Villa";
}

export function ConsultationModal({
  open,
  onOpenChange,
  initialBhk = "2 BHK",
}: ConsultationModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-4xl max-h-[92vh] overflow-y-auto p-4 sm:p-7"
    >
      <ConsultationFlow
        initialBhk={initialBhk}
        onSuccessClose={() => onOpenChange(false)}
      />
    </Dialog>
  );
}
