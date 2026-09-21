import { useEffect, useRef } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";

export default function PreviewSuccess({ response, onRestart }: { response: Record<string, unknown>; onRestart: () => void }) {
    const heading = useRef<HTMLHeadingElement>(null);
    useEffect(() => { heading.current?.focus(); }, []);
    return <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
        <span className="mb-4 inline-flex rounded-full bg-emerald-100 p-3"><CheckCircle2 size={28} /></span>
        <h3 ref={heading} tabIndex={-1} className="text-lg font-bold outline-none">Your form passed validation</h3>
        <p className="mb-5 mt-2 text-sm leading-relaxed">Everything looks good. This was a test; no response was sent or saved.</p>
        <details className="rounded-lg border border-emerald-200 bg-white/70 p-3"><summary className="cursor-pointer text-xs font-semibold">View test response · {Object.keys(response).length} fields</summary><pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-all text-xs">{JSON.stringify(response, null, 2)}</pre></details>
        <Button type="button" variant="outline" className="mt-4 border-emerald-200 bg-white text-emerald-800" onClick={onRestart}><RotateCcw size={14} />Test another response</Button>
    </section>;
}
