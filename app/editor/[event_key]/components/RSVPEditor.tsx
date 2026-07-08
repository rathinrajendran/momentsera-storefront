"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Save, CalendarDays, Users2, UtensilsCrossed, Settings2, HelpCircle, Plus, Trash2 } from "lucide-react";
import { usePreviewDraft } from "../PreviewDraftContext";
import { useSaveEventSection } from "../../../../hooks/useEvents";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Switch } from "../../../../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { CustomDatePicker } from "../../../../components/ui/CustomDatePicker";
import EditorHeader from "./EditorHeader";
import { SectionHeader } from "./MusicEditor";

/* ---------------- SCHEMA ---------------- */
const customQuestionSchema = z.object({
  id: z.string().optional(),
  label: z.string().trim().min(1, "Question text is required"),
  type: z.enum(["text", "textarea", "boolean"]),
  required: z.boolean(),
});

const schema = z.object({
  id: z.string().optional(),
  rsvp_deadline: z.string({ message: "RSVP Deadline is required" }).min(1, "RSVP Deadline is required"),
  allow_plus_one: z.boolean(),
  max_plus_ones: z.coerce.number().min(1, "Must allow at least 1 extra guest").max(10, "Maximum limit reached").optional(),
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
  const rsvpData = draft?.rsvp ?? {};

  
  return (
    <div>dfsdfsdf</div>
  );
}
