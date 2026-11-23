import { useNavigate } from "react-router";
import Footer from "~/src/components/Footer";
import Header from "~/src/components/Headers";
import TemplateGallery from "~/src/components/TemplateGallery";
import type { FormTemplate } from "~/src/lib/form-types";

export function meta() {
  return [
    { title: "Form Templates | makeForm" },
    {
      name: "description",
      content: "Browse and select ready-to-use makeForm templates.",
    },
  ];
}

export default function TemplatesRoute() {
  const navigate = useNavigate();

  const selectTemplate = (template: FormTemplate) => {
    navigate(`/form-builder?template=${encodeURIComponent(template.id)}`);
  };

  return (
    <div className="relative min-h-screen bg-white">
      <Header viewPage="Templates" />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <TemplateGallery onSelect={selectTemplate} />
      </main>
      <Footer />
    </div>
  );
}
