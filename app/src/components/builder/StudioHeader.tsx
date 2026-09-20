import { Link } from "react-router";
import { FileText, Home, LayoutGrid, Eye, RotateCcw, Undo2 } from "lucide-react";
import AccountDetails from "../AccountDetails";

export default function StudioHeader({ count, preview, onPreview, onEdit, onReset, onUndo, canUndo }: { count: number; preview: boolean; onPreview: () => void; onEdit: () => void; onReset: () => void; onUndo: () => void; canUndo: boolean }) {
    return <header className="studio-header">
        <Link to="/" className="studio-brand" aria-label="makeForm home"><span className="studio-brand-mark"><FileText size={21} /></span><span><strong>make<span>Form</span></strong><small>Visual Form Architect</small></span><span className="studio-badge">PRO</span></Link>
        <nav className="studio-nav" aria-label="Form studio navigation"><Link to="/"><Home size={14} />Landing Page</Link><button className={!preview ? "active" : ""} onClick={onEdit} aria-pressed={!preview}><LayoutGrid size={14} />Form Builder<span className="studio-badge">{count}</span></button><button className={preview ? "active" : ""} onClick={onPreview} aria-pressed={preview}><Eye size={14} />Live Preview</button></nav>
        <div className="studio-actions"><button className="studio-icon-button" disabled={!canUndo} aria-label="Undo last edit" title="Undo last edit" onClick={onUndo}><Undo2 size={16} /></button><button className="studio-icon-button" aria-label="Reset to template" title="Reset to Template" onClick={onReset}><RotateCcw size={16} /></button><AccountDetails onNavigate={() => {}} /></div>
    </header>;
}
