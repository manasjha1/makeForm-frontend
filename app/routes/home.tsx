import {
  CalendarDays,
  Eye,
  GitBranch,
  Layers,
  MessageSquareText,
  Smartphone,
  SlidersHorizontal,
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

import { findTemplate } from "~/src/data/form-templates";
import { Logos19 } from "~/src/components/logos19";
import { Hero195 } from "~/src/components/hero195";
import VerticalTabs from "~/src/components/vertical-tabs";

const HomeVerticalTabs = VerticalTabs as (props: {
  title: string;
  eyebrow: string;
  className: string;
  items: {
    id: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  }[];
}) => ReturnType<typeof VerticalTabs>;

const featuredTemplates = [
  {
    id: "client-onboarding",
    image: onboardingFormImage,
    imageAlt:
      "Client onboarding form with a welcome message and project detail fields",
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
    imageAlt:
      "Appointment request form with name, email, and preferred date fields",
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
    description: "Show relevant questions based on each respondent’s answers.",
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

const homeMetrics = [
  {
    value: "4,000+",
    label: "product teams plan in Ondrel",
  },
  {
    value: "38%",
    label: "fewer status meetings in the first quarter",
  },
  {
    value: "2.4x",
    label: "faster from request to release",
  },
  {
    value: "99.99%",
    label: "uptime over the last 12 months",
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
  return (
    <div className="relative min-h-screen bg-white">
      <Header viewPage="Home" />
      <main className="home-content min-h-full mx-auto bg-white">
        <Hero195
          className="bg-white"
          heading="Build high-converting forms with effortless elegance."
          description="Design and customize forms with live validation, conditional logic, and an interactive preview—no code required."
          buttons={{
            primary: {
              text: "Launch your form",
              url: "/form-builder",
              className:
                "min-h-11 rounded-full border border-gray-300 bg-white px-6 py-4 text-sm font-medium text-gray-900 hover:bg-white hover:text-primary",
            },
            secondary: {
              text: "Explore prebuilt templates",
              url: "/form-builder?view=templates",
              className:
                "min-h-11 rounded-full border-black bg-black px-6 py-4 text-sm font-medium text-white hover:bg-primary hover:text-white",
            },
          }}
          tabs={[
            {
              title: "Studio",
              image: {
                src: formImage,
                alt: "makeForm studio with field palette, form canvas, and settings",
              },
            },
            {
              title: "Dashboard",
              image: {
                src: onboardingFormImage,
                alt: "Dashboard preview",
              },
            },
            {
              title: "Live Preview",
              image: {
                src: eventFormImage,
                alt: "Live Preview",
              },
            },
          ]}
        />

        <div className="">
          <div className="my-5">
            <Logos19 className="w-full md:w-[80%] mx-auto" />
          </div>
          <div className="w-full border-y border-[#e1e3e4]">
            <VerticalTabs />
          </div>
        </div>
        <div className="">
          <section
            className="w-full border-y border-[#e1e3e4] bg-white px-4 sm:px-6"
            aria-label="makeForm product metrics"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {homeMetrics.map((metric, index) => (
                <article
                  key={metric.value}
                  className={`flex min-h-36 flex-col justify-center px-6 py-8 sm:min-h-44 sm:px-10 lg:min-h-48 lg:px-12 ${index % 2 !== 0 ? "border-l border-[#e1e3e4]" : ""
                    } ${index >= 2 ? "border-t border-[#e1e3e4] lg:border-t-0" : ""
                    } ${index > 0 ? "lg:border-l lg:border-l-[#e1e3e4]" : ""}`}
                >
                  <p className="text-4xl font-medium leading-none tracking-tight text-[#191c1d] sm:text-5xl">
                    {metric.value}
                  </p>
                  <p className="mt-4 max-w-56 text-sm font-medium leading-5 text-[#505254] sm:text-base sm:leading-6">
                    {metric.label}
                  </p>
                </article>
              ))}
            </div>
          </section>
          <section className="mx-auto my-16 w-full max-w-6xl lg:my-24">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-[#3525cd]">Templates</p>
                <h2 className="mt-3 max-w-3xl text-3xl font-medium leading-[1.05] tracking-tight text-[#191c1d] sm:text-4xl lg:text-5xl">
                  Start faster.{" "}
                  <span className="text-[#7d8489]">
                    Choose a ready-to-use form.
                  </span>
                </h2>
              </div>
              <Link
                to="/form-builder?view=templates"
                className="hidden shrink-0 text-sm font-medium text-[#191c1d] transition-colors hover:text-[#3525cd] sm:block"
              >
                All templates →
              </Link>
            </div>

            <div className="mt-10 flex flex-col gap-5 md:flex-row md:items-stretch">
              {featuredTemplates.slice(0, 3).map((featured) => {
                const { template, description, image, imageAlt } = featured;
                const CategoryIcon = categoryIcons[template.category];

                return (
                  <article
                    key={template.id}
                    className="group flex min-w-0 flex-1 overflow-hidden rounded-2xl border border-[#e1e3e4] bg-white transition-all duration-300 hover:scale-110"
                  >
                    <Link
                      to={`/form-builder?template=${encodeURIComponent(template.id)}`}
                      className="flex w-full flex-col"
                    >
                      <div className="m-2.5 overflow-hidden rounded-xl bg-[#f1f3f4]">
                        <img
                          src={image}
                          alt={imageAlt}
                          className="block aspect-[1.65/1] h-full w-full object-cover transition-all duration-300"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>

                      <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5 text-sm font-semibold text-[#191c1d]">
                            <CategoryIcon
                              aria-hidden="true"
                              className="size-4"
                            />
                            {template.title}
                          </span>
                          <span className="shrink-0 rounded-full bg-[#f1f2f3] px-2.5 py-1 text-xs font-medium text-[#687177]">
                            {template.category}
                          </span>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-[#505254]">
                          {description}
                        </p>

                        <p className="mt-auto pt-5 text-sm font-medium text-[#3525cd]">
                          {template.fields.length} fields
                          <span className="text-[#7d8489]">
                            {" "}· {template.category} form
                          </span>
                        </p>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center sm:hidden">
              <Button asChild variant="outline" className="min-h-11 border-[#d6d9da] bg-white px-5 font-semibold text-[#191c1d]">
                <Link to="/form-builder?view=templates">
                  Browse all templates
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
                  From a quick start to a polished final form, makeForm keeps
                  the tools you need in one simple workspace.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {featureStats.map(
                  ({
                    icon: Icon,
                    image,
                    imageAlt,
                    stat,
                    title,
                    description,
                  }) => (
                    <article
                      key={title}
                      className="grid min-h-48 grid-cols-[minmax(5.5rem,0.78fr)_minmax(0,1.22fr)] items-center gap-3 rounded-2xl border border-white/80 bg-white/80 px-3 backdrop-blur-[2px] transition-colors hover:border-[#9b8cff] sm:min-h-52 sm:gap-4 sm:px-4"
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
            className="mt-8 rounded-2xl border border-[#e1e3e4] bg-white px-5 sm:mt-10 sm:px-7"
          >
            <AccordionItem value="create-forms">
              <AccordionTrigger>
                What can I create with makeForm?
              </AccordionTrigger>
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
              <AccordionTrigger>
                Can I preview my form while I build it?
              </AccordionTrigger>
              <AccordionContent>
                Yes. Use the live preview to see how your form looks as you
                adjust its fields and layout.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="conditional-logic">
              <AccordionTrigger>
                Can forms show different questions based on answers?
              </AccordionTrigger>
              <AccordionContent>
                Yes. Add conditional logic to show relevant questions based on
                the answers a respondent selects.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="validation">
              <AccordionTrigger>
                How do I help ensure form responses are complete?
              </AccordionTrigger>
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
