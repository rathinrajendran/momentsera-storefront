"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../utils/utils";

type Option = {
  label: string;
  value: string;
};

type Props = {
  id: string;
  label?: string;
  placeholder?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  openSelect: string | null;
  setOpenSelect: (value: string | null) => void;
  className?: string;
};

export function CustomSelect({
  id,
  label,
  placeholder = "Select",
  value,
  options,
  onChange,
  openSelect,
  setOpenSelect,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const isOpen = openSelect === id;

  const selected = options.find((item) => item.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenSelect]);

  return (
    <>
      {/* Mobile Backdrop */}

      {isOpen && (
        <div
          className="
      fixed
      z-[9999]
      mt-2
      w-[260px]
      rounded-2xl
      border
      border-slate-200
      bg-white
      p-2
      shadow-xl
      hidden
      md:block
    "
          style={{
            top: (ref.current?.getBoundingClientRect().bottom ?? 0) + 8,
            left: ref.current?.getBoundingClientRect().left ?? 0,
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpenSelect(null);
              }}
              className="
          flex
          w-full
          items-center
          justify-between
          rounded-xl
          px-3
          py-2.5
          text-left
          text-sm
          hover:bg-slate-100
        "
            >
              {option.label}

              {value === option.value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}

      <div ref={ref} className={cn("relative", className)}>
        <button
          type="button"
          onClick={() => setOpenSelect(isOpen ? null : id)}
          className="
            flex
            w-full
            items-center
            justify-between
            rounded-md
            bg-[#FAFAFA]
            px-4
            py-3
            text-left
          "
        >
          <div>
            {label && (
              <p
                className="
                  mb-1
                  text-[0.65rem]
                  font-light
                  text-gray-600
                "
              >
                {label}
              </p>
            )}

            <p
              className="
                text-xs
                font-medium
                capitalize
              "
            >
              {selected?.label ?? placeholder}
            </p>
          </div>

          <ChevronDown
            size={16}
            className={cn("transition-transform", isOpen && "rotate-180")}
          />
        </button>

        {/* Desktop Dropdown */}

        {isOpen && (
          <div
            className="
              absolute
              left-0
              top-full
              z-50
              mt-2
              hidden
              w-full
              rounded-xl
              border
              bg-white
              p-2
              shadow-lg
              md:block
            "
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpenSelect(null);
                }}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-lg
                  px-3
                  py-2
                  text-left
                  text-xs
                  hover:bg-slate-100
                "
              >
                {option.label}

                {value === option.value && <Check size={14} />}
              </button>
            ))}
          </div>
        )}

        {/* Mobile Modal */}

        {isOpen && (
          <div
            className="
              fixed
              left-1/2
              top-1/2
              z-50
              w-[calc(100vw-32px)]
              max-w-sm
              -translate-x-1/2
              -translate-y-1/2
              rounded-3xl
              bg-white
              p-4
              shadow-2xl
              md:hidden
            "
          >
            <h3 className="mb-4 text-sm font-semibold">
              {label || placeholder}
            </h3>

            <div className="space-y-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpenSelect(null);
                  }}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    text-sm
                    hover:bg-slate-100
                  "
                >
                  {option.label}

                  {value === option.value && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
