import { Eye, Home, LayoutFreeform, Menu, RotateCcw, Undo2, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import AccountDetails from "./AccountDetails";
import makeFormLogo from "~/assests/makeForm_logo.png";

type HeaderProps = {
    viewPage?: toggleBtn;
    count?: number;
    preview?: boolean;
    onPreview?: () => void;
    onEdit?: () => void;
    onReset?: () => void;
    onUndo?: () => void;
    canUndo?: boolean;
};

export default function Header({ viewPage, count, preview, onPreview, onEdit, onReset, onUndo, canUndo }: HeaderProps) {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();
    const current = viewPage ?? (pathname === "/live-preview" || preview ? "LivePreview" : pathname === "/form-builder" ? "FormBuilder" : pathname === "/" ? "Home" : undefined);
    const closeMenu = () => setOpen(false);
    const links = [
        { label: "Home", page: "Home", to: "/", Icon: Home },
        { label: "Form Builder", page: "FormBuilder", to: "/form-builder", Icon: LayoutFreeform, action: onEdit },
        { label: "Live Preview", page: "LivePreview", to: "/live-preview", Icon: Eye, action: onPreview },
    ];
    const navigation = () => links.map(({ label, page, to, Icon, action }) => {
        const active = current === page;
        const className = "justify-start rounded-md text-xs " + (active ? "bg-white text-emerald-700 shadow-sm" : "text-gray-600 hover:bg-white");
        const content = <><Icon className="size-4" />{label}{page === "FormBuilder" && count !== undefined && <span className="rounded bg-emerald-100 px-1.5 text-[10px] text-emerald-800">{count}</span>}</>;
        return action ? <Button key={page} variant="ghost" className={className} aria-pressed={active} onClick={() => { action(); closeMenu(); }}>{content}</Button>
            : <Button key={page} asChild variant="ghost" className={className}><Link to={to} aria-current={active ? "page" : undefined} onClick={closeMenu}>{content}</Link></Button>;
    });
    const actions = <>
        {onUndo && <Button type="button" size="icon-sm" variant="outline" onClick={onUndo} disabled={!canUndo} aria-label="Undo last edit" title="Undo last edit"><Undo2 className="size-4" /></Button>}
        {onReset && <Button type="button" size="icon-sm" variant="outline" onClick={onReset} aria-label="Reset to template" title="Reset to template"><RotateCcw className="size-4" /></Button>}
        <AccountDetails onNavigate={closeMenu} />
    </>;
    return <header className="app-header sticky top-0 z-40 w-full border-b border-[#E2E8E4] bg-[#f9f6f0]/95 px-3 py-2 backdrop-blur sm:px-5">
        <nav aria-label="Main navigation" className="mx-auto flex min-h-14 w-full items-center justify-between gap-3">
            <Link to="/" onClick={closeMenu} className="shrink-0" aria-label="makeForm home"><img className="h-14 w-32 object-contain" src={makeFormLogo} alt="makeForm" /></Link>
            <div className="hidden items-center gap-1 rounded-lg border border-[#E2E8E4] bg-[#FAF9F6] p-1 lg:flex">{navigation()}</div>
            <div className="hidden items-center gap-2 lg:flex">{actions}</div>
            <Button type="button" size="icon" variant="outline" className="lg:hidden" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
        </nav>
        {open && <div className="mt-2 border-t border-[#E2E8E4] pt-2 lg:hidden"><div className="grid gap-1">{navigation()}</div><div className="mt-2 flex flex-wrap items-center gap-2 border-t border-[#E2E8E4] pt-2">{actions}</div></div>}
    </header>;
}
