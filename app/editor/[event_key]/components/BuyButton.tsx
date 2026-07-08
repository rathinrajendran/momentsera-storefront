"use client";

import { useRouter } from "next/navigation";

type Props = {
  inviteKey: string;
  isLoggedIn: boolean;
};

export default function BuyButton({ inviteKey, isLoggedIn }: Props) {
  const router = useRouter();

  const handleBuy = () => {
    if (!isLoggedIn) {
      router.push(`/account/login?redirect=/invites/${inviteKey}`);
      return;
    }

    // ✅ logged in → continue purchase
    router.push(`/checkout/${inviteKey}`);
  };

  return (
    <button onClick={handleBuy} className="mt-6 rounded bg-black px-6 py-3 text-white">
      Buy
    </button>
  );
}
