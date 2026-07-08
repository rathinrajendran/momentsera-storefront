"use client";

import React, { useMemo, useRef, useState, useCallback } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { Camera, Image as ImageIcon, X } from "lucide-react";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { useSubmitWish } from "../../../../../hooks/useWishes";

import { useThemeAnimation } from "../../../../../hooks/useThemeAnimations";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../../../components/ui/dialog";

import { Button } from "../../../../../components/ui/button";

import { Input } from "../../../../../components/ui/input";

import { Textarea } from "../../../../../components/ui/textarea";

import { Form, FormControl, FormField, FormItem, FormMessage } from "../../../../../components/ui/form";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

type WishType = "text" | "audio" | "video";

interface WishesConfig {
  enabled: boolean;

  title?: string;

  types: WishType[];

  limit: number;
}

interface WishesProps {
  wishes?: WishesConfig;

  eventKey: string;

  trigger: React.ReactNode;

  onSuccess?: () => void;

  container?: HTMLElement | null;

  rounded?: string;

  experience?: any;
}

/* ─────────────────────────────────────────────
   VALIDATION
───────────────────────────────────────────── */

const formSchema = z.object({
  from: z.string().min(2, "Name is required"),

  phone: z
    .string()
    .min(7, "Phone number is required")
    .regex(/^[0-9+\-\s()]{7,15}$/, "Enter valid phone number"),

  text: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

export default function Wishes({ wishes, eventKey, trigger, onSuccess, container, experience }: WishesProps) {
  /* ─────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────── */

  const [open, setOpen] = useState(false);

  const [type, setType] = useState<WishType>(() => wishes?.types?.[0] || "text");

  const [file, setFile] = useState<File | null>(null);

  /* ─────────────────────────────────────────────
     REFS
  ───────────────────────────────────────────── */

  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  /* ─────────────────────────────────────────────
     HOOKS
  ───────────────────────────────────────────── */

  const submitWish = useSubmitWish(eventKey);

  const { getMotionProps } = useThemeAnimation(experience);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      from: "",
      phone: "",
      text: "",
    },
  });

  /* ─────────────────────────────────────────────
     ANIMATION
  ───────────────────────────────────────────── */

  const { key: _dialogKey, ...dialogProps } = getMotionProps(0);

  const { key: _headerKey, ...headerProps } = getMotionProps(0.1);

  const { key: _contentKey, ...contentProps } = getMotionProps(0.2);

  const { key: _textKey, ...textProps } = getMotionProps(0.25);

  const { key: _uploadKey, ...uploadProps } = getMotionProps(0.25);

  /* ─────────────────────────────────────────────
     GUARD
  ───────────────────────────────────────────── */

  if (!wishes || !wishes.enabled) {
    return null;
  }

  /* ─────────────────────────────────────────────
     MEMOS
  ───────────────────────────────────────────── */

  const isTextType = type === "text";

  const showTabs = (wishes.types?.length ?? 0) > 1;

  const accept = useMemo(() => {
    if (type === "audio") {
      return "audio/*";
    }

    if (type === "video") {
      return "video/*";
    }

    return "";
  }, [type]);

  /* ─────────────────────────────────────────────
     STYLES
  ───────────────────────────────────────────── */

  const inputStyles = {
    borderColor: "var(--border)",
    color: "var(--primary)",
    fontFamily: "var(--font-primary)",
    borderRadius: "var(--radius-theme)",
  };

  const uploadButtonStyles = {
    borderColor: "var(--border)",
    color: "var(--primary)",
    borderRadius: "var(--radius-theme)",
  };

  /* ─────────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────────── */

  const resetForm = useCallback(() => {
    form.reset();

    setFile(null);

    setType(wishes?.types?.[0] || "text");
  }, [form, wishes]);

  const handleClose = useCallback(() => {
    setOpen(false);

    resetForm();
  }, [resetForm]);

  /* ─────────────────────────────────────────────
     SUBMIT
  ───────────────────────────────────────────── */

  const handleSubmit = async (values: FormValues) => {
    const trimmedText = values.text.trim();

    /* TEXT */

    if (isTextType) {
      if (!trimmedText) {
        form.setError("text", {
          type: "manual",
          message: "Wish message is required",
        });

        return;
      }

      submitWish.mutate(
        {
          wishesFrom: values.from.trim(),

          phone: values.phone.trim(),

          wishesType: "text",

          wishes: trimmedText,
        },
        {
          onSuccess: () => {
            handleClose();

            onSuccess?.();
          },

          onError: (error: any) => {
            form.setError("phone", {
              type: "server",

              message: error?.response?.data?.error || "Phone number already submitted a wish",
            });
          },
        },
      );

      return;
    }

    /* FILE */

    if (!file) {
      form.setError("text", {
        type: "manual",

        message: `Please upload ${type} file`,
      });

      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    submitWish.mutate(
      {
        wishesFrom: values.from.trim(),

        phone: values.phone.trim(),

        wishesType: type,

        formData,
      },
      {
        onSuccess: () => {
          handleClose();

          onSuccess?.();
        },

        onError: (error: any) => {
          form.setError("phone", {
            type: "server",

            message: error?.response?.data?.error || "Phone number already submitted a wish",
          });
        },
      },
    );
  };

  /* ─────────────────────────────────────────────
     UI
  ───────────────────────────────────────────── */

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);

        if (!v) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        container={container}
        className="overflow-hidden border-none p-0 sm:max-w-[500px]"
        style={{
          background: "var(--bg-page)",

          border: "1px solid var(--border)",

          color: "var(--primary)",

          borderRadius: "var(--radius-theme)",
        }}
      >
        <motion.div {...dialogProps} className="px-8 py-10 md:px-14 md:py-14">
          {/* HEADER */}

          <motion.div {...headerProps}>
            <DialogHeader>
              <DialogTitle
                className="text-center leading-[0.95]"
                style={{
                  color: "var(--accent)",

                  fontFamily: "var(--font-accent)",

                  fontSize: "calc(var(--font-size-accent) * 0.8)",
                }}
              >
                {wishes.title || "Send Your Wishes"}
              </DialogTitle>

              <p
                className="mt-6 text-center tracking-[0.35em] uppercase"
                style={{
                  color: "var(--secondary)",

                  fontFamily: "var(--font-secondary)",

                  fontSize: "calc(var(--font-size-secondary) * 0.5)",
                }}
              >
                Share your love and blessings
              </p>
            </DialogHeader>
          </motion.div>

          {/* FORM */}

          <Form {...form}>
            <motion.form {...contentProps} onSubmit={form.handleSubmit(handleSubmit)} className="pt-10">
              {/* INPUTS */}

              <div className="space-y-4">
                {/* NAME */}

                <FormField
                  control={form.control}
                  name="from"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter Name"
                          className="w-full border bg-transparent p-4 text-xs transition-all"
                          style={inputStyles}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PHONE */}

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          inputMode="tel"
                          maxLength={15}
                          placeholder="Enter Phone Number"
                          onChange={(e) => {
                            field.onChange(e.target.value.replace(/[^\d+\-\s()]/g, ""));
                          }}
                          className="w-full border bg-transparent p-4 text-xs transition-all"
                          style={inputStyles}
                        />
                      </FormControl>
                      <p className="text-left text-xs">Your phone number will not be publicly visible.</p>
                      <FormMessage className="text-left" />
                    </FormItem>
                  )}
                />
              </div>

              {/* TABS */}

              {showTabs && (
                <div className="pt-8">
                  <div className="flex gap-5">
                    {wishes.types.map((t) => {
                      const active = type === t;

                      return (
                        <Button
                          key={t}
                          type="button"
                          onClick={() => {
                            setType(t);

                            setFile(null);

                            form.setValue("text", "");

                            form.clearErrors();
                          }}
                          className="relative p-0 pb-2 text-xs tracking-[0.1em] uppercase transition-all"
                          style={
                            active
                              ? {
                                  color: "var(--secondary)",

                                  borderBottom: "1px solid var(--secondary)",
                                }
                              : {
                                  color: "var(--secondary)",
                                }
                          }
                        >
                          {t}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CONTENT */}

              <div className="pt-4">
                <AnimatePresence mode="wait">
                  {isTextType ? (
                    <motion.div key="text" {...textProps}>
                      <FormField
                        control={form.control}
                        name="text"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Write your wishes..."
                                className="min-h-[140px] w-full border bg-transparent p-4 text-xs transition-all"
                                style={inputStyles}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  ) : (
                    <motion.div key="upload" {...uploadProps} className="space-y-6">
                      {/* HIDDEN */}

                      <input
                        ref={galleryInputRef}
                        type="file"
                        accept={accept}
                        className="hidden"
                        onChange={(e) => {
                          setFile(e.target.files?.[0] ?? null);

                          form.clearErrors("text");
                        }}
                      />

                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept={accept}
                        capture={type === "video" ? "environment" : undefined}
                        className="hidden"
                        onChange={(e) => {
                          setFile(e.target.files?.[0] ?? null);

                          form.clearErrors("text");
                        }}
                      />

                      {/* ACTIONS */}

                      <div className="grid grid-cols-2 gap-6 pt-4">
                        <Button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="flex flex-col items-center justify-center gap-4 border py-12 transition-all duration-300 hover:opacity-80"
                          style={uploadButtonStyles}
                        >
                          <Camera size={24} strokeWidth={1} />

                          <span
                            className="text-xs tracking-[0.2em] uppercase"
                            style={{
                              fontFamily: "var(--font-primary)",
                            }}
                          >
                            Camera
                          </span>
                        </Button>

                        <Button
                          type="button"
                          onClick={() => galleryInputRef.current?.click()}
                          className="flex flex-col items-center justify-center gap-4 border py-12 transition-all duration-300 hover:opacity-80"
                          style={uploadButtonStyles}
                        >
                          <ImageIcon size={24} strokeWidth={1} />

                          <span
                            className="text-xs tracking-[0.2em] uppercase"
                            style={{
                              fontFamily: "var(--font-primary)",
                            }}
                          >
                            Gallery
                          </span>
                        </Button>
                      </div>

                      {/* FILE */}

                      {file && (
                        <div
                          className="flex items-center justify-between border-b py-5"
                          style={{
                            borderColor: "var(--border)",
                          }}
                        >
                          <p
                            className="truncate"
                            style={{
                              color: "var(--secondary)",

                              fontFamily: "var(--font-primary)",

                              fontSize: "calc(var(--font-size-primary) * 0.85)",
                            }}
                          >
                            {file.name}
                          </p>

                          <Button type="button" onClick={() => setFile(null)}>
                            <X size={18} strokeWidth={1} />
                          </Button>
                        </div>
                      )}

                      <FormMessage />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* FOOTER */}

              <div className="mt-8 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="rounded-md border border-slate-300 bg-white text-xs font-light text-slate-500 transition-all hover:bg-slate-300 hover:text-black"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={submitWish.isPending}
                  className="rounded-md border border-slate-900 bg-slate-900 text-xs font-light text-white transition-all hover:border-slate-700 hover:bg-slate-700"
                >
                  {submitWish.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </motion.form>
          </Form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
