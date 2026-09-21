import { LayoutGrid, FileText, SlidersHorizontal } from "lucide-react";

export default function StudioPanelNav() {
    return <nav className="studio-panel-nav" aria-label="Jump to studio panel">{[
        { id: "studio-palette", label: "Fields", icon: LayoutGrid },
        { id: "studio-canvas", label: "Canvas", icon: FileText },
        { id: "studio-settings", label: "Settings", icon: SlidersHorizontal },
    ].map(({ id, label, icon: Icon }) => <button key={id} onClick={() => {
        const panel = document.getElementById(id);
        panel?.scrollIntoView({ block: "start" }); panel?.focus({ preventScroll: true });
    }}><Icon size={14} />{label}</button>)}</nav>;
}
