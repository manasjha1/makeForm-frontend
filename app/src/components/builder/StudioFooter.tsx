import { Link } from "react-router";
import { FileText, ArrowUpRight } from "lucide-react";

export default function StudioFooter({ onTemplates, onPreview }: { onTemplates?: () => void; onPreview?: () => void }) {
    return <footer className="studio-footer">
        <div className="studio-footer-grid">
            <div><Link to="/" className="!flex items-center gap-2 !text-[#1c2925]"><span className="studio-brand-mark"><FileText size={20} /></span><strong className="text-base">makeForm</strong><span className="studio-badge">Form Studio</span></Link><p className="studio-muted mt-4 max-w-xs">Build thoughtful forms with a visual workspace. Shape every question, fine-tune the details, and test the experience.</p></div>
            <div><h3>PRODUCT</h3><Link to="/">Landing Page</Link>{onTemplates ? <button className="studio-footer-link" onClick={onTemplates}>Form Templates</button> : <Link to="/form-builder?view=templates">Form Templates</Link>}{onPreview ? <button className="studio-footer-link" onClick={onPreview}>Live Preview</button> : <Link to="/live-preview">Live Preview</Link>}</div>
            <div><h3>ACCOUNT</h3><Link to="/sign-in">Sign In</Link><Link to="/create-account">Create Account</Link></div>
            <div><h3>DEVELOPER RESOURCES</h3><a href="https://github.com/manasjha1/makeForm-frontend/blob/main/docs/form-studio.md" target="_blank" rel="noreferrer">Studio Guide <ArrowUpRight size={12} className="inline" /></a><a href="https://github.com/manasjha1/makeForm-frontend" target="_blank" rel="noreferrer">Source Code <ArrowUpRight size={12} className="inline" /></a><a href="https://github.com/manasjha1/makeForm-frontend/issues" target="_blank" rel="noreferrer">Report an Issue <ArrowUpRight size={12} className="inline" /></a></div>
        </div>
        <div className="studio-status mt-7 !px-0"><span>© {new Date().getFullYear()} makeForm. Build forms with clarity.</span><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-emerald-600" />Local draft workspace</span></div>
    </footer>;
}
