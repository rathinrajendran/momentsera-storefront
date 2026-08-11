"use client";

import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";

import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Image as ImageIcon,
  X,
} from "lucide-react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useSubmitWish } from "../../../../../hooks/useWishes";
import { useThemeAnimation } from "../../../../../hooks/useThemeAnimations";

import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../../../components/ui/form";

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

  onSuccess?: () => void;

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
    .regex(
      /^[0-9+\-\s()]{7,15}$/,
      "Enter valid phone number",
    ),

  text: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

export default function Wishes({
  wishes,
  eventKey,
  onSuccess,
  experience,
}: WishesProps) {
  /* ─────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────── */

  const [type, setType] = useState<WishType>(
    () => wishes?.types?.[0] || "text",
  );

  const [file, setFile] = useState<File | null>(null);

  /* ─────────────────────────────────────────────
     REFS
  ───────────────────────────────────────────── */

  const galleryInputRef =
    useRef<HTMLInputElement | null>(null);

  const cameraInputRef =
    useRef<HTMLInputElement | null>(null);

  /* ─────────────────────────────────────────────
     HOOKS
  ───────────────────────────────────────────── */

  const submitWish = useSubmitWish(eventKey);

  const { getMotionProps } =
    useThemeAnimation(experience);

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

  const { key: _headerKey, ...headerProps } =
    getMotionProps(0.1);

  const { key: _contentKey, ...contentProps } =
    getMotionProps(0.2);

  const { key: _textKey, ...textProps } =
    getMotionProps(0.25);

  const { key: _uploadKey, ...uploadProps } =
    getMotionProps(0.25);

  /* ─────────────────────────────────────────────
     GUARD
  ───────────────────────────────────────────── */


  /* ─────────────────────────────────────────────
     MEMOS
  ───────────────────────────────────────────── */

  const isTextType = type === "text";

  const showTabs =
    (wishes.types?.length ?? 0) > 1;

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

  /* ─────────────────────────────────────────────
     SUBMIT
  ───────────────────────────────────────────── */

  const handleSubmit = async (
    values: FormValues,
  ) => {
    const trimmedText = values.text.trim();

    /* ─────────────────────────────────────────
       TEXT WISH
    ───────────────────────────────────────── */

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
            resetForm();

            onSuccess?.();
          },

          onError: (error: any) => {
            form.setError("phone", {
              type: "server",

              message:
                error?.response?.data?.error ||
                "Phone number already submitted a wish",
            });
          },
        },
      );

      return;
    }

    /* ─────────────────────────────────────────
       FILE WISH
    ───────────────────────────────────────── */

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
          resetForm();

          onSuccess?.();
        },

        onError: (error: any) => {
          form.setError("phone", {
            type: "server",

            message:
              error?.response?.data?.error ||
              "Phone number already submitted a wish",
          });
        },
      },
    );
  };

  /* ─────────────────────────────────────────────
     UI
  ───────────────────────────────────────────── */

  return (
    <section
      className="w-full"
      style={{
        color: "var(--primary)",
      }}
    >
      <motion.div
        {...headerProps}
        className="mb-8"
      >
        <h3
          className="text-center leading-[0.95]"
          style={{
            color: "var(--accent)",
            fontFamily: "var(--font-accent)",
            fontSize:
              "calc(var(--font-size-accent) * 0.8)",
          }}
        >
          {wishes.title || "Send Your Wishes"}
        </h3>

        <p
          className="
            mt-4
            text-center
            uppercase
            tracking-[0.35em]
          "
          style={{
            color: "var(--secondary)",
            fontFamily: "var(--font-secondary)",
            fontSize:
              "calc(var(--font-size-secondary) * 0.5)",
          }}
        >
          Share your love and blessings
        </p>
      </motion.div>

      {/* FORM */}

      <Form {...form}>
        <motion.form
          {...contentProps}
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
        >
          {/* ─────────────────────────────────────
              BASIC INPUTS
          ───────────────────────────────────── */}

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
                      className="
                        w-full
                        border
                        bg-transparent
                        p-4
                        text-xs
                        transition-all
                      "
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
                        field.onChange(
                          e.target.value.replace(
                            /[^\d+\-\s()]/g,
                            "",
                          ),
                        );
                      }}
                      className="
                        w-full
                        border
                        bg-transparent
                        p-4
                        text-xs
                        transition-all
                      "
                      style={inputStyles}
                    />
                  </FormControl>

                  <p className="text-left text-xs">
                    Your phone number will not be
                    publicly visible.
                  </p>

                  <FormMessage className="text-left" />
                </FormItem>
              )}
            />
          </div>

          {/* ─────────────────────────────────────
              TYPE TABS
          ───────────────────────────────────── */}

          {showTabs && (
            <div className="pt-2">
              <div className="flex gap-5">
                {wishes.types.map((wishType) => {
                  const active =
                    type === wishType;

                  return (
                    <Button
                      key={wishType}
                      type="button"
                      onClick={() => {
                        setType(wishType);

                        setFile(null);

                        form.setValue(
                          "text",
                          "",
                        );

                        form.clearErrors();
                      }}
                      className="
                        relative
                        p-0
                        pb-2
                        text-xs
                        uppercase
                        tracking-[0.1em]
                        transition-all
                      "
                      style={
                        active
                          ? {
                              color:
                                "var(--secondary)",
                              borderBottom:
                                "1px solid var(--secondary)",
                            }
                          : {
                              color:
                                "var(--secondary)",
                            }
                      }
                    >
                      {wishType}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────
              CONTENT
          ───────────────────────────────────── */}

          <div>
            <AnimatePresence mode="wait">
              {isTextType ? (
                <motion.div
                  key="text"
                  {...textProps}
                >
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Write your wishes..."
                            className="
                              min-h-[140px]
                              w-full
                              resize-none
                              border
                              bg-transparent
                              p-4
                              text-xs
                              transition-all
                            "
                            style={inputStyles}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  {...uploadProps}
                  className="space-y-6"
                >
                  {/* HIDDEN GALLERY INPUT */}

                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={(e) => {
                      setFile(
                        e.target.files?.[0] ?? null,
                      );

                      form.clearErrors("text");
                    }}
                  />

                  {/* HIDDEN CAMERA INPUT */}

                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept={accept}
                    capture={
                      type === "video"
                        ? "environment"
                        : undefined
                    }
                    className="hidden"
                    onChange={(e) => {
                      setFile(
                        e.target.files?.[0] ?? null,
                      );

                      form.clearErrors("text");
                    }}
                  />

                  {/* UPLOAD ACTIONS */}

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      onClick={() =>
                        cameraInputRef.current?.click()
                      }
                      className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        gap-4
                        border
                        py-10
                        transition-all
                        duration-300
                        hover:opacity-80
                      "
                      style={uploadButtonStyles}
                    >
                      <Camera
                        size={24}
                        strokeWidth={1}
                      />

                      <span
                        className="
                          text-xs
                          uppercase
                          tracking-[0.2em]
                        "
                        style={{
                          fontFamily:
                            "var(--font-primary)",
                        }}
                      >
                        Camera
                      </span>
                    </Button>

                    <Button
                      type="button"
                      onClick={() =>
                        galleryInputRef.current?.click()
                      }
                      className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        gap-4
                        border
                        py-10
                        transition-all
                        duration-300
                        hover:opacity-80
                      "
                      style={uploadButtonStyles}
                    >
                      <ImageIcon
                        size={24}
                        strokeWidth={1}
                      />

                      <span
                        className="
                          text-xs
                          uppercase
                          tracking-[0.2em]
                        "
                        style={{
                          fontFamily:
                            "var(--font-primary)",
                        }}
                      >
                        Gallery
                      </span>
                    </Button>
                  </div>

                  {/* SELECTED FILE */}

                  {file && (
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        border-b
                        py-4
                      "
                      style={{
                        borderColor:
                          "var(--border)",
                      }}
                    >
                      <p
                        className="truncate"
                        style={{
                          color:
                            "var(--secondary)",
                          fontFamily:
                            "var(--font-primary)",
                          fontSize:
                            "calc(var(--font-size-primary) * 0.85)",
                        }}
                      >
                        {file.name}
                      </p>

                      <Button
                        type="button"
                        onClick={() =>
                          setFile(null)
                        }
                        className="shrink-0"
                      >
                        <X
                          size={18}
                          strokeWidth={1}
                        />
                      </Button>
                    </div>
                  )}

                  <FormMessage />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─────────────────────────────────────
              FOOTER
          ───────────────────────────────────── */}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="
                rounded-md
                border
                border-slate-300
                bg-white
                text-xs
                font-light
                text-slate-500
                transition-all
                hover:bg-slate-300
                hover:text-black
              "
            >
              Clear
            </Button>

            <Button
              type="submit"
              disabled={submitWish.isPending}
              className="
                rounded-md
                border
                border-slate-900
                bg-slate-900
                text-xs
                font-light
                text-white
                transition-all
                hover:border-slate-700
                hover:bg-slate-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {submitWish.isPending
                ? "Saving..."
                : "Send Wish"}
            </Button>
          </div>
        </motion.form>
      </Form>
    </section>
  );
}