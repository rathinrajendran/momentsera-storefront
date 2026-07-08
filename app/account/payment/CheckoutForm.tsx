"use client";

import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handlePay = async () => {
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/payment/success",
      },
    });

    if (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="mx-auto max-w-md p-4">
      <PaymentElement />
      <button onClick={handlePay} className="mt-4 w-full rounded bg-black py-2 text-white">
        Pay Now
      </button>
    </div>
  );
}
