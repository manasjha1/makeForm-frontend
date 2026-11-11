import {
  CalendarDays,
  CheckCircle,
  FileText,
  MessageSquareText,
  MoveRight,
  Stars,
  UsersRound,
} from "lucide-react";

import Header from "~/src/components/Headers";
import { Button } from "~/src/components/ui/button";
import formImage from "~/assests/formImg.png";
import { Link } from "react-router";
import Footer from "~/src/components/Footer";
import DotField from "~/src/components/DotField";

import ScrollStackDeck, {
  type ProjectItem,
} from "~/src/components/scroll-stack-deck";
import { findTemplate } from "~/src/data/form-templates";

const featuredTemplates = [
  {
    id: "client-onboarding",
    description:
      "Gather a new client’s goals, timeline, and budget before your first project meeting.",
  },
  {
    id: "event-registration",
    description:
      "Collect attendee details, session preferences, and dietary needs in one quick sign-up.",
  },
  {
    id: "customer-feedback",
    description:
      "Measure customer satisfaction and give people room to share what could be better.",
  },
  {
    id: "appointment-request",
    description:
      "Let people request a convenient date and time, with space to explain what they need.",
  },
]
  .map(({ id, description }) => {
    const template = findTemplate(id);
    return template ? { template, description } : null;
  })
  .filter((item) => item !== null);

const categoryIcons = {
  Business: UsersRound,
  Events: CalendarDays,
  Feedback: MessageSquareText,
  Personal: CalendarDays,
} as const;

export function meta() {
  return [
    { title: "makeForm | Visual Form Builder" },
    {
      name: "description",
      content:
        "Build forms from templates with validation, conditional logic, and live previews.",
    },
  ];
}

export default function Home() {
  const templateProjects: ProjectItem[] = featuredTemplates.map(
    ({ template, description }, index) => ({
      id: template.id,
      tabTitle: `${String(index + 1).padStart(2, "0")} · ${template.category}`,
      title: template.title,
      description,
      image: "",
      color: "#f1f0ff",
    }),
  );

  return (
    <div className="relative min-h-screen">
      <Header viewPage="Home" />
      <main className="home-content min-h-full">
        {/* Hero section with interactive DotField background */}
        <section className="relative overflow-hidden px-4 sm:px-6">
          <div
            className="pointer-events-none absolute inset-0 z-0 mask-[linear-gradient(to_bottom,black_80%,transparent_100%)]"
            aria-hidden="true"
          >
            <DotField
              dotRadius={2}
              dotSpacing={16}
              bulgeStrength={36}
              glowRadius={0}
              sparkle={false}
              waveAmplitude={0}
            />
          </div>

          <div className="home-hero relative z-10 mx-auto w-full max-w-4xl">
            <div className="flex items-center justify-center gap-2 w-fit max-w-full mx-auto px-3.5 py-1.5 rounded-full bg-primary-fixed border border-[#c3c0ff] text-on-primary-fixed text-xs font-bold mb-6 shadow-xs motion-safe:animate-pulse">
              <Stars className="w-3.5 h-3.5 text-[#3525cd]" />
              <span>Next-Gen Drag & Drop Form Studio</span>
            </div>
            <h1 className="home-title text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#191c1d] text-center tracking-tight max-w-4xl mx-auto leading-[1.12]">
              Build intelligent, high-converting forms with{" "}
              <span className="text-[#3525cd] underline decoration-[#c3c0ff] underline-offset-8">
                effortless elegance
              </span>
              .
            </h1>

            {/* Short Description */}
            <p className="mt-6 text-base sm:text-lg text-on-surface-variant text-center max-w-2xl mx-auto font-normal leading-relaxed">
              Design and customize forms with live validation, conditional logic,
              and an interactive preview—no code required.
            </p>
            <div className="home-cta flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 mx-auto my-6">
              <Button
                asChild
                className="bg-primary hover:bg-primary-container transition-all flex items-center gap-1 p-5 text-white text-sm font-semibold rounded-lg shadow-[0_4px_14px_0_rgba(79,70,229,0.35)] hover:shadow-[0_6px_20px_0_rgba(79,70,229,0.45)] capitalize"
              >
                <Link to="/form-builder">
                  Launch your form{" "}
                  <MoveRight className="w-3.5 h-3.5 text-white mx-2" />
                </Link>
              </Button>
              <Button
                asChild
                className="bg-white group hover:bg-surface-container-low border border-[#e1e3e4] p-5 text-[#191c1d] text-sm font-medium rounded-lg shadow-xs hover:shadow-sm capitalize transition-all"
              >
                <Link to="/form-builder?view=templates">
                  Explore prebuilt templates
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mx-auto mt-10">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle className="w-3.5 h-3.5 text-[#3525cd]" />
                <p className="text-xs text-on-surface-variant font-normal capitalize">
                  3-column editing workspace
                </p>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle className="w-3.5 h-3.5 text-[#3525cd]" />
                <p className="text-xs text-on-surface-variant font-normal capitalize">
                  conditional field logic
                </p>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle className="w-3.5 h-3.5 text-[#3525cd]" />
                <p className="text-xs text-on-surface-variant font-normal capitalize">
                  ready-to-use form templates
                </p>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle className="w-3.5 h-3.5 text-[#3525cd]" />
                <p className="text-xs text-on-surface-variant font-normal capitalize">
                  mobile responsive preview
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="px-4 sm:px-6">
          <section className="w-full max-w-6xl mx-auto my-5">
            <img
              className="h-auto w-full rounded-xl object-contain border border-[#e1e3e4] shadow-[0_20px_40px_-15px_rgba(25,28,29,0.12),0_4px_12px_-2px_rgba(25,28,29,0.04)]"
              src={formImage}
              alt="makeForm studio with field palette, form canvas, and settings"
            />
          </section>
          <hr className="w-full max-w-6xl mx-auto my-5 border-[#e1e3e4]" />
          <section className="w-full max-w-6xl mx-auto my-5">
            <ScrollStackDeck
              projects={templateProjects}
              title="Start with a prebuilt form"
              subtitle="Browse ready-to-use forms, then customize the fields and preview your form."
              scrollIndicatorText="Scroll to explore templates"
              showFooter={false}
              enableLenis={false}
              className="min-h-0! bg-transparent!"
              renderCard={(project, index) => {
                const featured = featuredTemplates[index];
                if (!featured) return null;
                const { template, description } = featured;
                const CategoryIcon = categoryIcons[template.category];

                return (
                  <article className="relative w-full pt-12 sm:pt-14">
                    <div className="absolute left-0 top-0 flex h-12 w-48 items-center gap-2 rounded-t-2xl bg-[#e7e5ff] px-4 text-sm font-semibold text-[#3525cd] sm:h-14 sm:w-60 sm:px-6">
                      <FileText aria-hidden="true" className="size-4" />
                      <span className="truncate">{project.tabTitle}</span>
                    </div>
                    <div className="grid min-h-112 gap-6 overflow-hidden rounded-b-2xl rounded-tr-2xl border border-[#e1e3e4] bg-white p-5 shadow-[0_16px_40px_-20px_rgba(25,28,29,0.28)] sm:p-8 md:min-h-132 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.85fr)] md:items-center md:gap-10">
                      <div className="flex flex-col items-start">
                        <span className="flex items-center gap-1.5 rounded-full border border-[#e1e3e4] bg-[#f8f9fa] px-3 py-1 text-xs font-semibold text-[#5b5e60]">
                          <CategoryIcon aria-hidden="true" className="size-3.5" />
                          {template.category} template
                        </span>
                        <h3 className="mt-4 text-2xl font-bold tracking-tight text-[#191c1d] sm:text-3xl">
                          {template.title}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-[#5b5e60] sm:text-base">
                          {description}
                        </p>
                        <p className="mt-3 text-xs font-medium text-[#777a7c]">
                          {template.fields.length} ready-to-customize fields
                        </p>
                        <Button
                          asChild
                          className="mt-6 min-h-11 bg-[#3525cd] font-semibold text-white hover:bg-primary-container"
                        >
                          <Link
                            to={`/form-builder?template=${encodeURIComponent(template.id)}`}
                          >
                            Use this template
                            <MoveRight
                              aria-hidden="true"
                              className="ml-2 size-4"
                            />
                          </Link>
                        </Button>
                      </div>
                      <div
                        role="img"
                        aria-label={`Image preview of the ${template.title} form`}
                        className="rounded-xl border border-[#d6d9da] bg-[#f8f9fa] p-3 shadow-inner sm:p-5"
                      >
                        <div
                          aria-hidden="true"
                          className="mx-auto max-w-sm rounded-lg border border-[#e1e3e4] bg-white p-4 shadow-sm sm:p-5"
                        >
                          <div className="mb-4 border-b border-[#e1e3e4] pb-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#3525cd]">
                              makeForm
                            </p>
                            <p className="mt-1 text-base font-bold text-[#191c1d]">
                              {template.title}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-[#5b5e60]">
                              {template.description}
                            </p>
                          </div>
                          <div className="space-y-3">
                            {template.fields.slice(0, 3).map((field) => (
                              <div key={field.id} className="space-y-1">
                                <p className="text-[11px] font-medium text-[#383b3c]">
                                  {field.label}
                                  {field.required && (
                                    <span className="text-[#b42318]"> *</span>
                                  )}
                                </p>
                                <div
                                  className={`flex items-center rounded-md border border-[#d6d9da] bg-white px-2.5 text-[10px] text-[#9a9d9e] ${
                                    field.type === "textarea"
                                      ? "h-12 items-start py-2"
                                      : "h-7"
                                  }`}
                                >
                                  <span className="truncate">
                                    {field.placeholder ||
                                      (field.options?.[0] ??
                                        `Enter ${field.label.toLowerCase()}`)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex h-8 items-center justify-center rounded-md bg-[#3525cd] text-[10px] font-semibold text-white">
                            Submit form
                          </div>
                          {template.fields.length > 3 && (
                            <p className="mt-2 text-center text-[10px] text-[#777a7c]">
                              + {template.fields.length - 3} more fields
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }}
            />
            <div className="mt-8 flex justify-center">
              <Button
                asChild
                variant="outline"
                className="min-h-11 border-[#d6d9da] bg-white px-5 font-semibold text-[#191c1d]"
              >
                <Link to="/form-builder?view=templates">
                  Browse all templates
                  <MoveRight aria-hidden="true" className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
