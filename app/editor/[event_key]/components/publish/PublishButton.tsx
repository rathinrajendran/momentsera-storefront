"use client";

import { useRouter } from "next/navigation";
import { InviteStatus, PaymentStatus } from "../../../../../types/invitation";
import { usePreviewDraft } from "../../PreviewDraftContext";
import { Rocket } from "lucide-react";

type Props = {
  className?: string;
  label?: boolean;
  type?: "mobile" | "web";
  onClick?: () => void;
};

export function PublishButton({ className, type, onClick, label }: Props) {
  const router = useRouter();

  const { draft } = usePreviewDraft();
  const { invite } = draft;

  const buttonLabel =
    invite.payment_status !== PaymentStatus.PAID ? "Publish" : invite.status === InviteStatus.DRAFT ? "Publish" : "Update";

  const handleClick = () => {
    if (invite.payment_status !== PaymentStatus.PAID) {
      router.push("/account/checkout");
      return;
    }

    if (invite.status === InviteStatus.DRAFT) {
      // publishInvite(invite);
      return;
    }

    // updateInvite(invite);
  };

  const clickHandler = onClick ?? handleClick;

  if (type === "mobile") {
    return (
      <button
        type="button"
        onClick={clickHandler}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg bg-[#84a59d] px-3 py-2"
      >
        <Rocket className="h-5 w-5" width={15} strokeWidth={1.5} fill="#ffffff" stroke="#ffffff" />
        <span className="text-[0.6rem] font-semibold text-white">Publish</span>
      </button>
    );
  }

  return (
    <button type="button" onClick={clickHandler} className={`flex h-9 items-center justify-center gap-2 ${className}`}>
      {label ? buttonLabel : ""}
      <Rocket className="w-[15px]" strokeWidth={1.3} stroke="#ffffff" />
    </button>
  );
}
