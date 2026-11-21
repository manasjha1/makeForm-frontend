"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Hero195 } from "./hero195";

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

const slideTransition = {
  duration: 0.34,
  ease: [0.32, 0.72, 0, 1] as const,
};

const slideVariants = {
  enter: { y: "-100%" },
  center: { y: 0 },
  exit: { y: "100%" },
};

export default function VerticalTabs({
  title = "How it works",
  eyebrow,
  items,
  className,
}: VerticalTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleNext = () =>
    setActiveIndex((prev) => (prev + 1) % items.length);

  const handlePrev = () =>
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);

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
        const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      setActiveIndex(closestIndex);
    };
    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveTab);
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
    <div>
      <section className={cn("@container min-w-full mx-auto overflow-hidden bg-transparent py-8 md:py-16", className)}>
        <div className="mx-auto sticky top-0 w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-28 bg-white">
          <div className="grid grid-cols-1 items-start gap-10 @min-[720px]:grid-cols-12 @min-[720px]:gap-12">
            <div className="flex flex-col justify-center order-2 pt-4 @min-[720px]:col-span-5 @min-[720px]:order-1">
              <div className="space-y-1 mb-12  bg-white">
                {eyebrow && (
                  <span className="text-[10px] font-medium text-primary uppercase tracking-[0.3em] block ml-0.5">
                    {eyebrow}
                  </span>
                )}
                <h2 className="tracking-tighter text-balance text-3xl font-medium md:text-4xl lg:text-5xl text-foreground">
                  {title}
                </h2>

              </div>

              <div className="flex flex-col space-y-0">
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
                        "group relative flex cursor-pointer items-start gap-4 border-t border-border/50 py-6 text-left transition-[color] duration-150 ease-out first:border-0 md:py-8",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground/60 hover:text-foreground"
                      )}
                    >
                      <div className="absolute -left-4 md:-left-6 top-0 bottom-0 w-0.5 bg-muted">
                        {isActive && (
                          <motion.div
                            key={`active-${index}`}
                            className="absolute top-0 left-0 w-full bg-foreground origin-top"
                            initial={{ height: "0%" }}
                            animate={{ height: "100%" }}
                            transition={{ duration: 0.28, ease: "easeOut" }}
                          />
                        )}
                      </div>

                      <span className="text-[9px] md:text-[10px] font-medium mt-1 tabular-nums opacity-50">
                        /{service.id}
                      </span>

                      <div className="flex flex-col gap-2 flex-1">
                        <span
                          className={cn(
                            "text-2xl font-normal tracking-tight transition-colors duration-150 ease-out md:text-3xl @min-[720px]:text-4xl",
                            isActive ? "text-foreground" : ""
                          )}
                        >
                          {service.title}
                        </span>

                        <AnimatePresence mode="wait">
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{
                                duration: 0.3,
                                ease: [0.23, 1, 0.32, 1],
                              }}
                              className="overflow-hidden"
                            >
                              <p className="text-muted-foreground text-sm md:text-base font-normal leading-relaxed max-w-sm pb-2">
                                {service.description}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>

            <div className="flex h-full flex-col justify-end order-1 @min-[720px]:col-span-7 @min-[720px]:order-2">
              <div className="relative group/gallery">
                <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-border/40 bg-muted/30 md:aspect-4/3 md:rounded-[2.5rem] @min-[720px]:aspect-16/11">
                  <AnimatePresence initial={false}>
                    <GallerySlide
                      key={active.id}
                      service={active}
                      onClick={handleNext}
                    />
                  </AnimatePresence>

                  <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex gap-2 md:gap-3 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                      }}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 flex items-center justify-center text-foreground hover:bg-background transition-all active:scale-90"
                      aria-label="Previous"
                    >
                      <ArrowLeft className="size-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 flex items-center justify-center text-foreground hover:bg-background transition-all active:scale-90"
                      aria-label="Next"
                    >
                      <ArrowRight className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <span className="absolute -inset-x-1/5 top-0 -z-10 h-px bg-border mask-[linear-gradient(to_right,transparent_1%,black_10%,black_90%,transparent_99%)]"></span>
          <span className="absolute -inset-x-1/5 bottom-0 -z-10 h-px bg-border mask-[linear-gradient(to_right,transparent_1%,black_10%,black_90%,transparent_99%)]"></span>


          <span className="absolute -inset-y-1/5 left-22 w-px border-r border-border mask-[linear-gradient(to_bottom,transparent_1%,black_10%,black_90%,transparent_99%)]"></span>
          <span className="absolute -inset-y-1/5 right-22 w-px border-r border-border mask-[linear-gradient(to_bottom,transparent_1%,black_10%,black_90%,transparent_99%)]"></span>
        </div>

      </section>
    </div>
  );
}

function GallerySlide({
  service,
  onClick,
}: {
  service: VerticalTabItem;
  onClick: () => void;
}) {
  return (
    <motion.div
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={slideTransition}
      className="absolute inset-0 h-full w-full cursor-pointer"
      onClick={onClick}
    >
      <img
        src={service.image}
        alt={service.imageAlt}
        className="m-0! block size-full object-cover p-0!"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-60" />
    </motion.div>
  );
}
