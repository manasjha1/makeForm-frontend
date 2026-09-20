import { useEffect, useState } from "react";
import { Link } from "react-router";
import Header from "~/src/components/Headers";
import FormPreview from "~/src/components/FormPreview";
import { Button } from "~/src/components/ui/button";
import { readDraft } from "~/src/lib/form-draft";
import type { FormTemplate } from "~/src/lib/form-types";

export default function LivePreview() {
    const [form, setForm] = useState<FormTemplate | null>(null);
    const [ready, setReady] = useState(false);
    useEffect(() => { setForm(readDraft()); setReady(true); }, []);
    return <div className="min-h-screen bg-[#faf8f5]">
        <Header viewPage="LivePreview" />
        <main className="mx-auto max-w-2xl space-y-6 px-4 py-10">
            <h1 className="text-2xl font-bold text-gray-900">Live preview</h1>
            {!ready ? <p role="status">Loading draft…</p> : form ? <>
                <div className="flex flex-wrap items-center justify-between gap-3"><Button asChild variant="outline"><Link to="/form-builder">Back to editor</Link></Button><p className="text-xs text-gray-500">Draft saved for this browser tab</p></div>
                <FormPreview form={form} />
            </> : <section className="rounded-xl border border-gray-200 bg-white p-8 text-center"><h2 className="text-lg font-semibold">Your next form starts here</h2><p className="my-3 text-sm text-gray-500">Choose a template, customize it, then save your draft to preview it here.</p><Button asChild><Link to="/form-builder">Browse templates</Link></Button></section>}
        </main>
    </div>;
}
