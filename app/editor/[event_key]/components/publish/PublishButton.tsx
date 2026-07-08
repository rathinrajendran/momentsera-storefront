"use client";

import { useRouter } from "next/navigation";
import { InviteStatus, PaymentStatus } from "../../../../../types/invitation";
import { usePreviewDraft } from "../../PreviewDraftContext";

type Props = {
  className?: string;
};

export function PublishButton({ className }: Props) {
  const router = useRouter();

  const { draft } = usePreviewDraft();
  const { invite } = draft;


  const buttonLabel =
    invite.payment_status !== PaymentStatus.PAID
      ? "unlock & publish"
      : invite.status === InviteStatus.DRAFT
        ? "Publish Invite"
        : "Update Invite";

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

  return (
    <button
      onClick={handleClick}
      className={`h-auto w-auto cursor-pointer rounded-md bg-black px-5 py-2 text-[0.6rem] font-bold tracking-widest text-white uppercase transition-all hover:bg-slate-800 md:h-10 md:w-auto ${className}`}
    >
      {buttonLabel}
    </button>
  );
}
