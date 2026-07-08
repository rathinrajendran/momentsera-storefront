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
import { CustomDatePicker } from "../../../../../../../components/ui/CustomDatePicker";
import { Switch } from "../../../../../../../components/ui/switch";

/* ---------------- SCHEMA ---------------- */

const schema = z
  .object({
    groom: z.string().min(1, "Groom name is required"),
    bride: z.string().min(1, "Bride name is required"),
    wedding_date: z.date().optional(),
    location: z.string().optional(),
    dateNotConfirmed: z.boolean(),
    locationNotConfirmed: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.dateNotConfirmed && !data.wedding_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["wedding_date"],
        message: "Wedding date is required",
      });
    }

    if (!data.locationNotConfirmed && (!data.location || data.location.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["location"],
        message: "Location is required",
      });
    }
  });

type FormData = z.infer<typeof schema>;

/* ---------------- COMPONENT ---------------- */

export default function WeddingForm({ eventType, inviteKey }: { eventType: string; inviteKey: string }) {
const router = useRouter();
const [loading, setLoading] = useState(false);
const fallbackDate = new Date().toISOString();

const form = useForm<FormData>({
  resolver: zodResolver(schema),
  mode: "onBlur",
  defaultValues: {
    groom: "",
    bride: "",
    wedding_date: undefined,
    location: "",
    dateNotConfirmed: false,
    locationNotConfirmed: false,
  },
});

const dateNotConfirmed = form.watch("dateNotConfirmed");
const locationNotConfirmed = form.watch("locationNotConfirmed");
  /* ---------------- SUBMIT ---------------- */

  async function onSubmit(values: FormData) {
    setLoading(true);

    // ✅ Convert Date → ISO ONLY here
    const weddingDateIso = values.wedding_date
      ? new Date(`${values.wedding_date.toISOString().split("T")[0]}T00:00:00`).toISOString()
      : null;

    const formPayload = {
      stage: "onboarding",
      data: {
        announcement: {
            groom: { name: values.groom },
            bride: { name: values.bride },
        },
        schedule: [
          {
            title: eventType,
            date: weddingDateIso ?? fallbackDate,
            startTime: weddingDateIso ?? fallbackDate,
            locationName: values.location || "",
            locationUrl: "",
            note: "",
            isPrimary: true,
          },
        ],
      },
    };

    try {
      const result = await submitOnboarding(
        {
          invite_key: inviteKey,
          event_type: eventType,
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
        {/* Groom */}
        <FormField
          control={form.control}
          name="groom"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-0 text-[0.6rem] tracking-wider text-[var(--text-secondary)] uppercase">Groom Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="John" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bride */}
        <FormField
          control={form.control}
          name="bride"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-0 text-[0.6rem] tracking-wider text-[var(--text-secondary)] uppercase">Bride Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Jane" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
          {/* Wedding Date */}
          <FormField
            control={form.control}
            name="wedding_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-0 flex items-center justify-between text-[0.6rem] tracking-wider text-[var(--text-secondary)] uppercase">
                  Date
                  <span className="flex items-center gap-2 capitalize">
                    Not Confirmed
                    <Switch
                      checked={dateNotConfirmed}
                      onCheckedChange={(checked) => {
                        form.setValue("dateNotConfirmed", checked);

                        if (checked) {
                          form.setValue("wedding_date", undefined);
                        }

                        form.trigger("wedding_date");
                      }}
                    />
                  </span>
                </FormLabel>

                <FormControl>
                  <CustomDatePicker value={field.value} onChange={(date) => field.onChange(date)} disabled={dateNotConfirmed} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-0 flex items-center justify-between text-[0.6rem] tracking-wider text-[var(--text-secondary)] uppercase">
                  Location
                  <span className="flex items-center gap-2 capitalize">
                    Not Confirmed
                    <Switch
                      checked={locationNotConfirmed}
                      onCheckedChange={(checked) => {
                        form.setValue("locationNotConfirmed", checked);

                        if (checked) {
                          form.setValue("location", "");
                        }

                        form.trigger("location");
                      }}
                    />
                  </span>
                </FormLabel>

                <FormControl>
                  <Input {...field} placeholder="Dubai, UAE" disabled={locationNotConfirmed} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root && <p className="text-sm text-red-600">{form.formState.errors.root.message}</p>}
        </div>
        {/* Submit */}
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
