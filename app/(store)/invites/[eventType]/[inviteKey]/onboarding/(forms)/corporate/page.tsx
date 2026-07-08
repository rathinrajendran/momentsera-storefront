// app/invites/[invite_key]/[event_key]/onboarding/forms/corporate/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { submitOnboarding } from "../../actions";

export default function CorporateOnboardingPage() {
  const form = useForm();
  const params = useParams();
  const router = useRouter();

  async function onSubmit(values: any) {
    const res = await submitOnboarding(
      {
        invite_key: params.invite_key as string,
        event_type: "corporate",
      },
      values,
    );

    router.replace(`/invites/${params.invite_key}/${res.event_key}`);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("company_name")} placeholder="Company Name" />
      <input {...form.register("event_title")} placeholder="Event Title" />
      <input type="date" {...form.register("event_date")} />
      <input {...form.register("location")} placeholder="Location" />

      <button type="submit">Continue</button>
    </form>
  );
}
