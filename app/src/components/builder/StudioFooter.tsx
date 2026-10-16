import { Link } from "react-router";
import { FileText, ArrowUpRight } from "lucide-react";
import makeFormLogo from "~/assests/makeForm_logo.png";

export default function StudioFooter({
    onTemplates,
    onPreview,
}: {
    onTemplates?: () => void;
    onPreview?: () => void;
}) {
    return (
        <footer className="studio-footer">
            <div className="studio-footer-grid">
                <div>
                    <Link to="/" className="shrink-0 w-fit" aria-label="makeForm home">
                        <img
                            className="h-14 w-32 object-contain"
                            src={makeFormLogo}
                            alt="makeForm"
                        />
                    </Link>
                    <p className="studio-muted max-w-xs">
                        Build thoughtful forms with a visual workspace. Shape every
                        question, fine-tune the details, and test the experience.
                    </p>
                </div>
                <div>
                    <h3>PRODUCT</h3>
                    <Link to="/">Landing Page</Link>
                    {onTemplates ? (
                        <button className="studio-footer-link" onClick={onTemplates}>
                            Form Templates
                        </button>
                    ) : (
                        <Link to="/form-builder?view=templates">Form Templates</Link>
                    )}
                    {onPreview ? (
                        <button className="studio-footer-link" onClick={onPreview}>
                            Live Preview
                        </button>
                    ) : (
                        <Link to="/live-preview">Live Preview</Link>
                    )}
                </div>

                <div>
                    <h3>DEVELOPER RESOURCES</h3>
                    <a
                        href="https://github.com/manasjha1/makeForm-frontend/blob/main/docs/form-studio.md"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Studio Guide <ArrowUpRight size={12} className="inline" />
                    </a>
                    <a
                        href="https://github.com/manasjha1/makeForm-frontend"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Source Code <ArrowUpRight size={12} className="inline" />
                    </a>
                    <a
                        href="https://github.com/manasjha1/makeForm-frontend/issues"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Report an Issue <ArrowUpRight size={12} className="inline" />
                    </a>
                </div>
                <div>
                    <h3>CONNECT</h3>
                    <Link to="https://github.com/manasjha1">GitHub</Link>
                    <Link to="https://www.linkedin.com/in/manas-jha-0310mk/">
                        LinkedIn
                    </Link>
                </div>
            </div>
            <div className="studio-status mt-7 px-0!">
                <span>
                    © {new Date().getFullYear()} makeForm. Build forms with clarity.
                </span>
                <span className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-600" />
                    Local draft workspace
                </span>
            </div>
        </footer>
    );
}
