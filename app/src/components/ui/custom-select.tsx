import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  required?: boolean;
}

export default function CustomSelect({
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Choose an option",
  disabled = false,
  error = false,
  className = "",
  required = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedDisplay = value || "";

  return (
    <div
      ref={containerRef}
      className={`relative w-full text-left font-sans ${className}`}
    >
      {/* Hidden input for HTML form validation and accessibility */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={value}
          required={required}
        />
      )}

      {/* Dropdown Trigger Button */}
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-[#FAF9F6] px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
          isOpen
            ? "border-emerald-700 bg-white ring-2 ring-emerald-700/20"
            : error
            ? "border-red-400 focus:ring-red-300"
            : "border-[#E2E8E4] hover:border-emerald-600 focus:border-emerald-700 focus:ring-emerald-100"
        } ${disabled ? "cursor-not-allowed opacity-60 bg-gray-100" : "cursor-pointer"}`}
      >
        <span
          className={`truncate font-normal ${
            selectedDisplay ? "text-[#1C2925] font-medium" : "text-gray-400"
          }`}
        >
          {selectedDisplay || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-emerald-700" : ""
          }`}
        />
      </button>

      {/* Floating Options Menu */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className="absolute left-0 top-full z-50 mt-1.5 max-h-60 w-full min-w-[180px] overflow-y-auto rounded-xl border border-[#E2E8E4] bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {/* Default / Clear choice */}
          <button
            type="button"
            role="option"
            aria-selected={!value}
            onClick={() => handleSelect("")}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
              !value
                ? "bg-emerald-50 text-emerald-800 font-semibold"
                : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <span className="italic">{placeholder}</span>
            {!value && <Check size={14} className="text-emerald-700" />}
          </button>

          {options.length > 0 && (
            <div className="my-1 border-t border-gray-100" />
          )}

          {options.map((option, index) => {
            const isSelected = value === option;
            return (
              <button
                key={index}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option)}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all ${
                  isSelected
                    ? "bg-emerald-50 text-emerald-900 font-semibold shadow-xs"
                    : "text-[#1C2925] hover:bg-emerald-50/60 hover:text-emerald-800"
                }`}
              >
                <span className="truncate">{option}</span>
                {isSelected && (
                  <Check
                    size={16}
                    className="shrink-0 text-emerald-700 animate-in zoom-in-50"
                  />
                )}
              </button>
            );
          })}

          {options.length === 0 && (
            <p className="px-3 py-3 text-center text-xs text-gray-400">
              No options available
            </p>
          )}
        </div>
      )}
    </div>
  );
}
