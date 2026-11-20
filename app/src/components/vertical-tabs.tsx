"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export interface VerticalTabItem {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface VerticalTabsProps {
  title?: string;
  eyebrow?: string;
  items: VerticalTabItem[];
  className?: string;
}

export default function VerticalTabs({
  title = "How it works",
  eyebrow,
  items,
  className,
}: VerticalTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  useEffect(() => {
    let frame = 0;

    const updateActiveTab = () => {
      frame = 0;
      const viewportCenter = window.innerHeight * 0.5;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      tabRefs.current.forEach((tab, index) => {
        if (!tab) return;
        const rect = tab.getBoundingClientRect();
        const tabCenter = rect.top + rect.height / 2;
        const distance = Math.abs(tabCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveTab);
    };

    updateActiveTab();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [items.length]);

  const active = items[activeIndex] ?? items[0];

  if (!active) return null;

  return (
    <section
      className={cn(
        "relative isolate w-screen max-w-none ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] overflow-hidden bg-white",
        className,
      )}
    >
      <div className="w-full min-w-0">
        <div className="relative mx-auto w-full border-x border-border">
          <header className="px-6 py-12 text-center sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            {eyebrow && (
              <p className="mb-5 text-sm font-medium text-primary">
                {eyebrow.replace(/[()]/g, "")}
              </p>
            )}
            <h2 className="mx-auto max-w-5xl text-balance text-3xl font-medium leading-[1.08] tracking-tight text-[#6f7482] md:text-5xl lg:text-[3.8rem]">
              <span className="text-[#191c1d]">{title} </span>
              From templates to publishing, every part of your form stays in one
              clear workspace.
            </h2>
          </header>

          <div className="grid min-w-0 grid-cols-1 border-t border-border md:grid-cols-[18rem_minmax(0,1fr)] lg:grid-cols-[21rem_minmax(0,1fr)]">
            <div className="border-b border-border md:border-r md:border-b-0">
              {items.map((service, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={service.id}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    onClick={() => handleTabClick(index)}
                    className={cn(
                      "relative flex w-full items-center gap-3 border-b border-border px-6 py-5 text-left text-lg transition-colors last:border-b-0 md:min-h-20 md:px-8",
                      isActive
                        ? "font-semibold text-[#191c1d]"
                        : "font-medium text-[#9a9da7] hover:text-[#505254]",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="vertical-tab-marker"
                        className="absolute bottom-3 left-0 top-3 w-0.5 rounded-full bg-primary"
                      />
                    )}
                    <span className="tabular-nums text-xs text-[#a5a8b1]">
                      /{service.id}
                    </span>
                    <span>{service.title}</span>
                  </button>
                );
              })}
            </div>
            <span className="pointer-events-none absolute -inset-x-1/5 top-20 -z-10 bg-border h-px mask-[linear-gradient(to_right,transparent_1%,black_10%,black_90%,transparent_99%)]" />
            <span className="pointer-events-none absolute -inset-x-1/5 bottom-20 -z-10 h-px mask-[linear-gradient(to_right,transparent_1%,black_10%,black_90%,transparent_99%)]" />
            <span className="pointer-events-none absolute -inset-x-1/5 top-32 h-px border-t border-dashed border-border mask-[linear-gradient(to_right,transparent_1%,black_10%,black_90%,transparent_99%)]" />
            <span className="pointer-events-none absolute -inset-x-1/5 bottom-32 h-px border-t border-dashed border-border mask-[linear-gradient(to_right,transparent_1%,black_10%,black_90%,transparent_99%)]" />
            <span className="pointer-events-none absolute -inset-y-1/5 left-1/5 w-px border-r bg-red-700 border-dashed border-border mask-[linear-gradient(to_bottom,transparent_1%,black_10%,black_90%,transparent_99%)]" />
            <span className="pointer-events-none absolute -inset-y-1/5 right-1/5 w-px border-r border-dashed border-border mask-[linear-gradient(to_bottom,transparent_1%,black_10%,black_90%,transparent_99%)]" />

            <div className="flex min-h-64 items-start px-6 py-10 sm:px-10 sm:py-12 md:min-h-96 md:items-center md:px-12 lg:px-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                  className="max-w-3xl text-balance"
                >
                  <h3 className="text-2xl font-semibold leading-tight tracking-tight text-[#191c1d] sm:text-3xl md:text-4xl lg:text-[2.75rem]">
                    {active.title}.{" "}
                    <span className="font-medium text-[#7f8491]">
                      {active.description}
                    </span>
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
