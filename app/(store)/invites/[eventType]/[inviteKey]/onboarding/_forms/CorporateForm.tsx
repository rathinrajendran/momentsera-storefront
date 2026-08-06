"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitOnboarding } from "../actions";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../../../../../components/ui/form";
import { Input } from "../../../../../../../components/ui/input";
import { Button } from "../../../../../../../components/ui/button";

const schema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  event_title: z.string().min(1, "Event title is required"),
  event_date: z.string().min(1, "Please select a date"),
  location: z.string().min(1, "Location is required"),
});

type FormData = z.infer<typeof schema>;

export default function CorporateForm({ inviteKey }: { inviteKey: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const now = new Date();
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      company_name: "",
      event_title: "",
      event_date: localDateTime,
      location: "",
    },
  });

  async function onSubmit(values: FormData) {
    setLoading(true);
    const eventDateIso = values.event_date ? new Date(values.event_date).toISOString() : null;

    const formPayload = {
      stage: "onboarding",
      data: {
        announcement: {
          organization: { name: values.company_name },
          event: { title: values.event_title },
        },
        schedule: [
          {
            title: values.event_title,
            date: eventDateIso,
            locationName: values.location,
            isPrimary: true,
          },
        ],
      },
    };

    try {
      const result = await submitOnboarding(
        { invite_key: inviteKey, event_type: "corporate" },
        formPayload
      );
      router.replace(`/editor/${result.event_key}`);
    } catch {
      form.setError("root", { type: "manual", message: "Failed to save event. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company / Organization Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Acme Corp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="event_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Annual Gala 2026" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="event_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Date & Time</FormLabel>
              <FormControl>
                <Input {...field} type="datetime-local" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Convention Center, Room A" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && <p className="text-sm text-red-600">{form.formState.errors.root.message}</p>}
        <Button type="submit" disabled={loading} className="w-full rounded-[5px] bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-60">
          {loading ? "Saving..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}