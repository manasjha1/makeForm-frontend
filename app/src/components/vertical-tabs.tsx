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
  const sectionRef = useRef<HTMLElement | null>(null);

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  useEffect(() => {
    let frame = 0;

    const updateActiveTab = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollDistance = rect.height - window.innerHeight;
      const progress =
        scrollDistance > 0
          ? Math.min(1, Math.max(0, -rect.top / scrollDistance))
          : 0;
      const nextIndex = Math.min(
        items.length - 1,
        Math.max(0, Math.floor(progress * items.length)),
      );
      setActiveIndex(nextIndex);
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
      ref={sectionRef}
      className={cn(
        "relative w-screen max-w-none ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] overflow-hidden border-y border-border bg-white",
        className,
      )}
      style={{ height: `${items.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col mx-auto w-full max-w-7xl overflow-hidden border-x border-border">
        <header className="shrink-0 px-6 py-8 sm:px-10 sm:py-10 lg:px-16 lg:py-12">
          {eyebrow && (
            <p className="mb-5 text-sm font-medium text-[#5c64ff]">
              {eyebrow.replace(/[()]/g, "")}
            </p>
          )}
          <h2 className="max-w-245 text-balance text-3xl font-medium leading-[1.06] tracking-[-0.035em] text-[#858b99] md:text-5xl lg:text-[3.8rem]">
            <span className="text-[#191c1d]">{title} </span>
            From templates to publishing, every part of your form stays in one
            clear workspace.
          </h2>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 border-t border-border md:grid-cols-[18rem_minmax(0,1fr)] lg:grid-cols-[20rem_minmax(0,1fr)]">
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
                    "relative flex w-full items-center gap-3 border-b border-border px-6 py-5 text-left text-base transition-colors last:border-b-0 md:min-h-18 md:px-8",
                    isActive
                      ? "font-semibold text-[#191c1d]"
                      : "font-medium text-[#9a9da7] hover:text-[#505254]",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="vertical-tab-marker"
                      className="absolute bottom-3 left-0 top-3 w-0.5 rounded-full bg-[#5c64ff]"
                    />
                  )}
                  <span>{service.title}</span>
                </button>
              );
            })}
          </div>

          <div className="flex min-h-72 items-start px-6 py-10 sm:px-10 sm:py-12 md:min-h-96 md:items-center md:px-12 lg:px-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                className="max-w-190"
              >
                <h3 className="text-balance text-2xl font-semibold leading-[1.12] tracking-tight text-[#191c1d] sm:text-3xl md:text-[2.6rem]">
                  {active.title}.{" "}
                  <span className="font-medium text-[#858b99]">
                    {active.description}
                  </span>
                </h3>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
