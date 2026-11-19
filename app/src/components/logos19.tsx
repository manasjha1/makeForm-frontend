import Marquee from "react-fast-marquee";
import type { ElementType } from "react";
import {
  GitBranch,
  Grip,
  Layers,
  Eye,
  ShieldCheck,
  Smartphone,
  WandSparkles,
  Share2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";

const resolveMarqueeComponent = (moduleValue: unknown): ElementType => {
  let resolved = moduleValue;

  for (
    let depth = 0;
    depth < 3 && typeof resolved === "object" && resolved !== null;
    depth++
  ) {
    if (!("default" in resolved)) break;
    resolved = (resolved as { default: unknown }).default;
  }

  return resolved as ElementType;
};

const MarqueeComponent = resolveMarqueeComponent(Marquee);

interface LogosSimpleStaticProps {
  features: { label: string; Icon: LucideIcon }[];
  className?: string;
}

type Props = Partial<LogosSimpleStaticProps>;

const defaultProps: LogosSimpleStaticProps = {
  features: [
    { label: "Drag & Drop", Icon: Grip },
    { label: "Live Preview", Icon: Eye },
    { label: "Conditional Logic", Icon: GitBranch },
    { label: "Field Validation", Icon: ShieldCheck },
    { label: "Templates", Icon: Layers },
    { label: "No-Code Builder", Icon: WandSparkles },
    { label: "Mobile Friendly", Icon: Smartphone },
    { label: "Easy Sharing", Icon: Share2 },
  ],
};

const Logos19 = (props: Props) => {
  const { features, className } = {
    ...defaultProps,
    ...props,
  };

  return (
    <section className={cn("py-10", className)}>
      <MarqueeComponent
        gradient
        gradientWidth={64}
        autoFill
        speed={50}
      >
        {features.map(({ label, Icon }, index) => (
          <div
            key={`${label}-${index}`}
            className="mx-5 flex h-10 items-center justify-center gap-2 sm:mx-7"
          >
            <Icon
              className="size-5 shrink-0 text-on-surface-variant"
              aria-hidden="true"
            />
            <span className="text-xl font-heading font-semibold text-on-surface-variant">
              {label}
            </span>
          </div>
        ))}
      </MarqueeComponent>
    </section>
  );
};

export { Logos19 };
