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
  couple_names: z.string().min(1, "Couple names are required"),
  years: z.string().regex(/^\d+$/, "Please enter a valid number of years"),
  event_date: z.string().min(1, "Please select a date"),
  location: z.string().min(1, "Location is required"),
});

type FormData = z.infer<typeof schema>;

export default function AnniversaryForm({ inviteKey }: { inviteKey: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const now = new Date();
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      couple_names: "",
      years: "",
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
          couple: { names: values.couple_names },
          years: values.years,
        },
        schedule: [
          {
            title: `${values.years}th Anniversary Celebration`,
            date: eventDateIso,
            locationName: values.location,
            isPrimary: true,
          },
        ],
      },
    };

    try {
      const result = await submitOnboarding({ invite_key: inviteKey, event_type: "anniversary" }, formPayload);
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
          name="couple_names"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Couple Names</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Jane & John Doe" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="years"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years Celebrating</FormLabel>
              <FormControl>
                <Input {...field} placeholder="25" />
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
                <Input {...field} placeholder="The Grand Ballroom" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && <p className="text-sm text-red-600">{form.formState.errors.root.message}</p>}
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-[5px] bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}
