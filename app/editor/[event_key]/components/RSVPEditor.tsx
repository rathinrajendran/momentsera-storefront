"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Save, Plus, Trash2 } from "lucide-react";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Switch } from "../../../../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { CustomDatePicker } from "../../../../components/ui/CustomDatePicker";
import { Textarea } from "../../../../components/ui/textarea";
import { LabelForm } from "../../../../components/ui/LabelForm";
const DEFAULT_QUESTIONS = [
  {
    id: crypto.randomUUID(),
    label: "Guest Name",
    type: "text",
    required: true,
  },
  {
    id: crypto.randomUUID(),
    label: "Will you be attending?",
    type: "boolean",
    required: true,
  },
  {
    id: crypto.randomUUID(),
    label: "Number of Guests",
    type: "number",
    required: true,
  },
];
/* ---------------- SCHEMA ---------------- */
const customQuestionSchema = z.object({
  id: z.string(),
  label: z.string().trim().min(1, "Question is required"),
  type: z.enum(["text", "textarea", "boolean", "select", "number"]),
  required: z.boolean(),
});

const schema = z.object({
  rsvp_deadline: z.string().min(1),
  allow_plus_one: z.boolean(),
  max_plus_ones: z.coerce.number().optional(),
  collect_dietary: z.boolean(),
  collect_meal_preference: z.boolean(),
  custom_rsvp_note: z.string().optional(),
  custom_questions: z.array(customQuestionSchema),
});

type FormValues = z.infer<typeof schema>;

/* ---------------- COMPONENT ---------------- */
export default function RSVPEditor({ onBack, eventKey }: { onBack: () => void; eventKey: string }) {
  // Hooks
  const { draft, updateSection, resetDraft, refreshEvent } = usePreviewDraft();
  const eventId = draft.invite.id;
  const mutation = useSaveEventSection(eventKey, eventId);

  // Derived initial data structure with fallback mapping[cite: 2]
  const rsvpData = {
    rsvp_deadline: draft?.rsvp?.rsvp_deadline ?? "",
    allow_plus_one: draft?.rsvp?.allow_plus_one ?? false,
    max_plus_ones: draft?.rsvp?.max_plus_ones ?? 1,
    collect_dietary: draft?.rsvp?.collect_dietary ?? false,
    collect_meal_preference: draft?.rsvp?.collect_meal_preference ?? false,
    custom_rsvp_note: draft?.rsvp?.custom_rsvp_note ?? "",
    custom_questions: draft?.rsvp?.custom_questions?.length ? draft.rsvp.custom_questions : DEFAULT_QUESTIONS,
  };
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: rsvpData,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "custom_questions",
  });

console.log("form data", form);


  return (
    // <div>
    //   <Button
    //     type="button"
    //     variant="outline"
    //     onClick={() =>
    //       append({
    //         id: crypto.randomUUID(),
    //         label: "",
    //         type: "text",
    //         required: false,
    //       })
    //     }
    //   >
    //     <Plus className="mr-2 h-4 w-4" />
    //     Add Question
    //   </Button>
    //   {fields.map((field, index) => (
    //     <div key={field.id} className="space-y-4 rounded-xl border bg-slate-50 p-5">
    //       <div className="flex items-center justify-between">
    //         <h4 className="text-sm font-semibold">Question {index + 1}</h4>

    //         <Button size="icon" variant="ghost" type="button" onClick={() => remove(index)}>
    //           <Trash2 className="h-4 w-4 text-red-500" />
    //         </Button>
    //       </div>

    //       <FormField
    //         control={form.control}
    //         name={`custom_questions.${index}.label`}
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Question</FormLabel>
    //             <FormControl>
    //               <Input {...field} placeholder="Enter question" />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />

    //       <FormField
    //         control={form.control}
    //         name={`custom_questions.${index}.type`}
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Answer Type</FormLabel>

    //             <Select value={field.value} onValueChange={field.onChange}>
    //               <FormControl>
    //                 <SelectTrigger>
    //                   <SelectValue />
    //                 </SelectTrigger>
    //               </FormControl>

    //               <SelectContent>
    //                 <SelectItem value="text">Short Text</SelectItem>

    //                 <SelectItem value="textarea">Paragraph</SelectItem>

    //                 <SelectItem value="boolean">Yes / No</SelectItem>

    //                 <SelectItem value="number">Number</SelectItem>

    //                 <SelectItem value="select">Dropdown</SelectItem>
    //               </SelectContent>
    //             </Select>
    //           </FormItem>
    //         )}
    //       />

    //       <FormField
    //         control={form.control}
    //         name={`custom_questions.${index}.required`}
    //         render={({ field }) => (
    //           <div className="flex items-center justify-between rounded-lg border p-3">
    //             <span className="text-sm">Required Question</span>

    //             <Switch checked={field.value} onCheckedChange={field.onChange} />
    //           </div>
    //         )}
    //       />
    //     </div>
    //   ))}
    // </div>
    <Form {...form}>
      <form className="flex h-full flex-col justify-between">
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          {/* RSVP Deadline */}
          <section className="space-y-4">
            <FormField
              control={form.control}
              name="rsvp_deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <CustomDatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          {/* Guest Options */}
          <section className="space-y-4">
            <FormField
              control={form.control}
              name="allow_plus_one"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allow Plus One</p>
                    <p className="text-xs text-slate-500">Let guests bring additional people.</p>
                  </div>

                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </div>
              )}
            />

            {form.watch("allow_plus_one") && (
              <FormField
                control={form.control}
                name="max_plus_ones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Additional Guests</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={10} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </section>

          {/* Preferences */}
          <section className="space-y-4">
            <FormField
              control={form.control}
              name="collect_dietary"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dietary Restrictions</p>
                    <p className="text-xs text-slate-500">Ask about allergies and food restrictions.</p>
                  </div>

                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="collect_meal_preference"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Meal Preference</p>
                    <p className="text-xs text-slate-500">Ask guests to choose their meal.</p>
                  </div>

                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </div>
              )}
            />
          </section>

          {/* RSVP Note */}
          <section className="space-y-4">
            <FormField
              control={form.control}
              name="custom_rsvp_note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="We kindly request your response before the RSVP deadline..."
                      className="min-h-24 border-slate-200 bg-white text-sm focus-visible:ring-1 focus-visible:ring-slate-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          {/* Questions */}
          <section className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="group relative space-y-4">
                <div className="flex justify-between items-center">
                  <h6 className="font-bold text-xs uppercase">Question {index + 1}</h6>
                  <Button
                    size="icon"
                    type="button"
                    variant="ghost"
                    onClick={() => remove(index)}
                    className="relative opacity-0 transition group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-1">
                  <FormField
                    control={form.control}
                    name={`custom_questions.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter question" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`custom_questions.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Answer Type</FormLabel>

                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectItem value="text">Short Text</SelectItem>

                            <SelectItem value="textarea">Paragraph</SelectItem>

                            <SelectItem value="boolean">Yes / No</SelectItem>

                            <SelectItem value="number">Number</SelectItem>

                            <SelectItem value="select">Dropdown</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`custom_questions.${index}.required`}
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <div>
                        <LabelForm className="font-medium">Required Question</LabelForm>
                        <p className="text-xs text-slate-500">Guests must answer this question.</p>
                      </div>

                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )}
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  id: crypto.randomUUID(),
                  label: "",
                  type: "text",
                  required: false,
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between border-t bg-white p-5">
          <Button variant="ghost" type="button">
            <X className="mr-2 h-4 w-4" />
            Discard
          </Button>

          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
