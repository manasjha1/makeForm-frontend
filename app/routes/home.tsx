import { CheckCircle, MoveRight, Stars } from "lucide-react";

import Header from "~/src/components/Headers";
import { Button } from "~/src/components/ui/button";
import formImage from "~/assests/formImg.png";
import { Link } from "react-router";
import Footer from "~/src/components/Footer";

import TemplateGallery from "~/src/components/TemplateGallery";
import type { FormTemplate } from "~/src/lib/form-types";

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
    <div className="">
      <Header viewPage="Home" />
      <main className="home-content min-h-full px-4 sm:px-6">
        <section className="home-hero mx-auto w-full max-w-4xl">
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
        </section>
        <section className="w-full max-w-6xl mx-auto my-5">
          <img
            className="h-auto w-full rounded-xl object-contain border border-[#e1e3e4] shadow-[0_20px_40px_-15px_rgba(25,28,29,0.12),0_4px_12px_-2px_rgba(25,28,29,0.04)]"
            src={formImage}
            alt="makeForm studio with field palette, form canvas, and settings"
          />
        </section>
        <hr className="w-full max-w-6xl mx-auto my-5 border-[#e1e3e4]" />
        <section className="w-full max-w-6xl mx-auto my-5">
          <div className="flex-1 items-center justify-center mx-auto my-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#191c1d] text-center tracking-tight max-w-4xl mx-auto leading-[1.12]">
              Start with a prebuilt form
            </h2>
            <p className="mt-2 text-base sm:text-lg text-on-surface-variant text-center max-w-2xl mx-auto font-normal leading-relaxed">
              Choose a ready-to-use template, customize the fields, and preview
              your form.
            </p>
          </div>

          <TemplateGallery
            onSelect={function (template: FormTemplate): void {
              throw new Error("Function not implemented.");
            }}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
