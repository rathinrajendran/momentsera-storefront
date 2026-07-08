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

/* ---------------- SCHEMA ---------------- */

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.string().regex(/^\d+$/, "Please enter a valid age"),
  event_date: z.string().min(1, "Please select a date"),
});

type FormData = z.infer<typeof schema>;

/* ---------------- COMPONENT ---------------- */

export default function BirthdayForm({ inviteKey }: { inviteKey: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const now = new Date();
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      age: "",
      event_date: localDateTime,
    },
  });

  /* ---------------- SUBMIT ---------------- */

  async function onSubmit(values: FormData) {
    setLoading(true);

    const eventDateIso = values.event_date ? new Date(values.event_date).toISOString() : null;

    const formPayload = {
      stage: "onboarding",
      data: {
        translation: {
          banner: {
            celebrant: { name: values.name },
          },
        },
        functions: [
          {
            function_key: "birthday",
            start_datetime: eventDateIso,
            end_datetime: null,
            location: null,
            location_map: null,
            display_order: 1,
            metadata: {
              age: values.age,
            },
          },
        ],
      },
    };

    try {
      const result = await submitOnboarding(
        {
          invite_key: inviteKey,
          event_type: "birthday",
        },
        formPayload,
      );

      router.replace(`/editor/${result.event_key}`);
    } catch {
      form.setError("root", {
        type: "manual",
        message: "Failed to save event. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthday Person Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="John" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Age */}
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age Turning</FormLabel>
              <FormControl>
                <Input {...field} placeholder="25" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date */}
        <FormField
          control={form.control}
          name="event_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Date</FormLabel>
              <FormControl>
                <Input {...field} type="datetime-local" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form-level error */}
        {form.formState.errors.root && <p className="text-sm text-red-600">{form.formState.errors.root.message}</p>}

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-[5px] bg-yellow-400 text-black transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}
