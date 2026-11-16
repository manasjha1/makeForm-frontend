import {
  CalendarDays,
  CheckCircle,
  Dot,
  Eye,
  FileText,
  GitBranch,
  Layers,
  MessageSquareText,
  MoveRight,
  Smartphone,
  SlidersHorizontal,
  Stars,
  UsersRound,
  ShieldCheck,
} from "lucide-react";

import Header from "~/src/components/Headers";
import { Button } from "~/src/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/src/components/ui/accordion";
import appointmentFormImage from "~/assests/appointmentForm2.jpeg";
import eventFormImage from "~/assests/eventForm2.jpeg";
import feedbackFormImage from "~/assests/feedbackForm2.jpeg";
import formImage from "~/assests/formImg.png";
import onboardingFormImage from "~/assests/onboardingForm2.jpeg";
import statsBackground from "~/assests/stats_background.png";
import statImage1 from "~/assests/stat_img1.jpeg";
import statImage2 from "~/assests/stat_img2.jpeg";
import statImage3 from "~/assests/stat_img3.jpeg";
import statImage4 from "~/assests/stat_img4.jpeg";
import statImage5 from "~/assests/stat_img5.jpeg";
import statImage6 from "~/assests/stat-img6.jpeg";
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
    image: onboardingFormImage,
    imageAlt: "Client onboarding form with a welcome message and project detail fields",
    description:
      "Gather a new client’s goals, timeline, and budget before your first project meeting.",
  },
  {
    id: "event-registration",
    image: eventFormImage,
    imageAlt: "Event registration form with attendee details and an event date",
    description:
      "Collect attendee details, session preferences, and dietary needs in one quick sign-up.",
  },
  {
    id: "customer-feedback",
    image: feedbackFormImage,
    imageAlt: "Customer feedback form with a star rating and experience field",
    description:
      "Measure customer satisfaction and give people room to share what could be better.",
  },
  {
    id: "appointment-request",
    image: appointmentFormImage,
    imageAlt: "Appointment request form with name, email, and preferred date fields",
    description:
      "Let people request a convenient date and time, with space to explain what they need.",
  },
]
  .map(({ id, image, imageAlt, description }) => {
    const template = findTemplate(id);
    return template ? { template, description, image, imageAlt } : null;
  })
  .filter((item) => item !== null);

const categoryIcons = {
  Business: UsersRound,
  Events: CalendarDays,
  Feedback: MessageSquareText,
  Personal: CalendarDays,
} as const;

const featureStats = [
  {
    icon: SlidersHorizontal,
    image: statImage1,
    imageAlt: "Illustration of a form with a cursor",
    stat: "No code",
    title: "Visual form builder",
    description:
      "Create polished forms with an intuitive drag-and-drop editing workspace.",
  },
  {
    icon: Eye,
    image: statImage2,
    imageAlt: "Illustration of a form preview on a screen",
    stat: "Live",
    title: "Preview as you build",
    description:
      "See how your form looks while you shape its fields and layout.",
  },
  {
    icon: GitBranch,
    image: statImage3,
    imageAlt: "Illustration of a branching form workflow",
    stat: "If / then",
    title: "Conditional logic",
    description:
      "Show relevant questions based on each respondent’s answers.",
  },
  {
    icon: ShieldCheck,
    image: statImage4,
    imageAlt: "Illustration of a shield with a check mark",
    stat: "Built in",
    title: "Field validation",
    description:
      "Use configurable validation to help keep form submissions complete.",
  },
  {
    icon: Layers,
    image: statImage5,
    imageAlt: "Illustration of stacked form templates",
    stat: `${featuredTemplates.length} featured`,
    title: "Ready-to-use templates",
    description:
      "Start with a template and customize its fields to fit your needs.",
  },
  {
    icon: Smartphone,
    image: statImage6,
    imageAlt: "Illustration of a completed form on a phone",
    stat: "Responsive",
    title: "Mobile-friendly forms",
    description:
      "Give respondents a comfortable form experience on any screen size.",
  },
];

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
    ({ template, description, image }, index) => ({
      id: template.id,
      tabTitle: `${String(index + 1).padStart(2, "0")} · ${template.category}`,
      title: template.title,
      description,
      image,
      color: "#f1f0ff",
    }),
  );

  return (
    <div className="relative min-h-screen">
      <Header viewPage="Home" />
      <main className="home-content min-h-full">
        {/* Hero section with interactive DotField background */}
        <section className="relative overflow-hidden px-4 sm:px-6"

        >
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
          <hr className="w-full max-w-6xl mx-auto my-10 border-[#e1e3e4]" />
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
                const { template, description, image, imageAlt } = featured;
                const CategoryIcon = categoryIcons[template.category];

                return (
                  // template cards
                  <article className="relative rounded-xl w-full">
                    <div className="grid min-h-112 gap-6 overflow-hidden rounded-2xl border border-[#e1e3e4] bg-white p-4 shadow-[0_16px_40px_-20px_rgba(25,28,29,0.28)] sm:p-8 md:min-h-112 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.85fr)] md:items-center md:gap-10">
                      <div className="flex flex-col items-start">
                        <span className="flex items-center gap-1.5 rounded-full border border-[#4f23a6] bg-[#d3c5f6] px-3 py-1 text-xs font-semibold text-[#4f23a6]">
                          <CategoryIcon aria-hidden="true" className="size-3.5" />
                          {template.category} template
                        </span>
                        <h3 className="mt-4 text-2xl font-bold tracking-tight text-[#191c1d] sm:text-5xl">
                          {template.title}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-[#505254] sm:text-base">
                          {description}
                        </p>
                        <p className="flex items-center gap-1 mt-3 text-xs font-medium text-[#505253]">
                          <Layers className="size-4" /> {template.fields.length} fields <Dot className="p-0" /> <SlidersHorizontal className="size-4" /> Fully cutomizable
                        </p>
                        <div className="mt-6 flex items-center gap-2">
                          <Button
                            asChild
                            variant="outline"
                            className="min-h-11 border-[#d6d9da] bg-white px-5 font-semibold text-[#191c1d] rounded-lg"
                          >
                            <Link to="/live-preview?view=templates">
                              <Eye aria-hidden="true" className="ml-2 size-4" />
                              Preview
                            </Link>
                          </Button>
                          <Button
                            asChild
                            className="min-h-11 bg-[#3525cd] font-semibold text-white hover:bg-primary rounded-lg"
                          >
                            <Link
                              to={`/form-builder?template=${encodeURIComponent(template.id)}`}
                            >
                              Use this template
                              <MoveRight
                                aria-hidden="true"
                                className="transition-all size-4"
                              />
                            </Link>
                          </Button>
                        </div>
                      </div>
                      <div className="overflow-hidden rounded-xl border border-[#e1e3e4] bg-[#f8f9fa] shadow-inner">
                        <img
                          src={image}
                          alt={imageAlt}
                          className="block h-full w-full object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  </article>
                );
              }}
            />
            <div className="flex justify-center">
              <Button
                asChild
                variant="outline"
                className="min-h-11 border-[#d6d9da] bg-white px-5 font-semibold text-[#191c1d]"
              >
                <Link to="/form-builder?view=templates">
                  Browse all templates
                  {/* <MoveRight aria-hidden="true" className="ml-2 size-4" /> */}
                </Link>
              </Button>
            </div>
          </section>
        </div>
        <section
          className="relative my-16 w-full overflow-hidden px-4 py-12 sm:px-6 sm:py-14 lg:my-24 lg:px-8 lg:py-16"
          aria-labelledby="home-features-title"
          style={{
            backgroundImage: `url(${statsBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="relative z-10">
            <div className="mx-auto max-w-7xl">
              <div className="mx-auto max-w-4xl text-center">
                <p className="inline-flex items-center gap-3 rounded-full bg-[#e7e5ff]/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#3525cd] sm:gap-5 sm:px-5 sm:text-sm">
                  <span className="hidden h-px w-8 bg-[#c3c0ff] sm:block" />
                  Made for better forms
                  <span className="hidden h-px w-8 bg-[#c3c0ff] sm:block" />
                </p>
                <h2
                  id="home-features-title"
                  className="mt-4 text-2xl font-extrabold tracking-tight text-[#191c1d] sm:text-3xl lg:text-4xl"
                >
                  Everything you need to build with{" "}
                  <span className="text-[#4933e6]">confidence</span>
                </h2>
                <p className="mx-auto mt-4 max-w-4xl text-sm leading-6 text-[#505778] sm:text-base sm:leading-7">
                  From a quick start to a polished final form, makeForm keeps the
                  tools you need in one simple workspace.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {featureStats.map(
                  ({ icon: Icon, image, imageAlt, stat, title, description }) => (
                    <article
                      key={title}
                      className="grid min-h-48 grid-cols-[minmax(5.5rem,0.78fr)_minmax(0,1.22fr)] items-center gap-3 rounded-2xl border border-white/80 bg-white/80 px-3 shadow-[0_8px_24px_-12px_rgba(74,61,163,0.2)] backdrop-blur-[2px] transition-colors hover:border-[#9b8cff] sm:min-h-52 sm:gap-4 sm:px-4"
                    >
                      <img
                        src={image}
                        alt={imageAlt}
                        className="w-full min-w-0 object-contain mix-blend-multiply"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="min-w-0 py-2">
                        <div className="flex items-center justify-end gap-2">

                          <span className="rounded-full bg-[#eeecff] px-2.5 py-1 text-[0.65rem] font-bold leading-tight text-[#4933e6] sm:px-3 sm:text-xs">
                            {stat}
                          </span>
                        </div>
                        <h3 className="mt-4 text-base font-bold leading-snug tracking-tight text-[#191c1d] sm:mt-5 sm:text-lg">
                          {title}
                        </h3>
                        <p className="mt-2 text-xs leading-5 text-[#505778] sm:text-sm sm:leading-6">
                          {description}
                        </p>
                      </div>
                    </article>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
        <section
          className="mx-auto my-16 w-full max-w-4xl px-4 sm:px-6 lg:my-24"
          aria-labelledby="home-faq-title"
        >
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3525cd] sm:text-sm">
              Frequently asked questions
            </p>
            <h2
              id="home-faq-title"
              className="mt-3 text-2xl font-extrabold tracking-tight text-[#191c1d] sm:text-3xl lg:text-4xl"
            >
              Questions about makeForm
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#505778] sm:text-base sm:leading-7">
              Learn how to build, customize, and preview your forms.
            </p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="mt-8 rounded-2xl border border-[#e1e3e4] bg-white px-5 shadow-[0_8px_24px_-18px_rgba(25,28,29,0.28)] sm:mt-10 sm:px-7"
          >
            <AccordionItem value="create-forms">
              <AccordionTrigger>What can I create with makeForm?</AccordionTrigger>
              <AccordionContent>
                Build custom forms for things like client onboarding, event
                registration, feedback, and appointment requests. Start from a
                blank form or customize a ready-to-use template.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="coding">
              <AccordionTrigger>Do I need coding experience?</AccordionTrigger>
              <AccordionContent>
                No. The visual form builder lets you add and arrange fields in
                an editing workspace without writing code.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="preview">
              <AccordionTrigger>Can I preview my form while I build it?</AccordionTrigger>
              <AccordionContent>
                Yes. Use the live preview to see how your form looks as you
                adjust its fields and layout.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="conditional-logic">
              <AccordionTrigger>Can forms show different questions based on answers?</AccordionTrigger>
              <AccordionContent>
                Yes. Add conditional logic to show relevant questions based on
                the answers a respondent selects.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="validation">
              <AccordionTrigger>How do I help ensure form responses are complete?</AccordionTrigger>
              <AccordionContent>
                Configure field validation to guide respondents and help keep
                submissions complete.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
      <Footer />
    </div>
  );
}
