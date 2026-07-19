"use client";

import { useRouter } from "next/navigation";
import { InviteStatus, PaymentStatus } from "../../../../../types/invitation";
import { usePreviewDraft } from "../../PreviewDraftContext";
import { Rocket } from "lucide-react";

type Props = {
  className?: string;
  type?: "mobile" | "web";
  onClick?: () => void;
};

export function PublishButton({ className, type, onClick }: Props) {
  const router = useRouter();

  const { draft } = usePreviewDraft();
  const { invite } = draft;

  const buttonLabel =
    invite.payment_status !== PaymentStatus.PAID
      ? "Publish"
      : invite.status === InviteStatus.DRAFT
        ? "Publish"
        : "Update";

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
    <button
      type="button"
      onClick={clickHandler}
      className={`flex h-auto w-auto cursor-pointer items-center gap-2 rounded-md bg-black px-3 py-2 text-[0.6rem] font-bold tracking-widest text-white uppercase transition-all hover:bg-slate-800 md:h-9 md:w-auto ${className}`}
    >
      <Rocket
        className="h-5 w-5"
        width={15}
        strokeWidth={1.5}
        fill="#000000"
        stroke="#ffffff"
      />
      {buttonLabel}
    </button>
  );
}