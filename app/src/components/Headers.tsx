import {
    Eye,
    Home,
    LayoutFreeform,
    LucideForm,
    Menu,
    RotateCcw,
    X,
    UserRound,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Link } from "react-router";

interface formProps {
    viewPage: toggleBtn;
    setViewPage: React.Dispatch<React.SetStateAction<toggleBtn>>;
}

export default function Header({ viewPage }: formProps) {
    const [isPageOpen, setIsPageOpen] = useState(false);

    const closeMenu = () => setIsPageOpen(false);

    return (
        <header className="sticky top-0 z-40 w-full border-b border-[#E2E8E4] bg-[#f9f6f0]/95 px-3 py-2 backdrop-blur sm:px-5">
            <nav className="mx-auto flex min-h-12 w-full max-w-6xl items-center justify-between gap-3">
                <Link to="/" onClick={closeMenu} className="flex shrink-0 items-center gap-2" aria-label="makeForm home">
                    <span className="rounded-md bg-emerald-700 p-1.5 shadow-sm">
                        <LucideForm className="size-5 text-white" />
                    </span>
                    <span className="flex flex-col items-start leading-none">
                        <span className="text-lg font-bold tracking-tight text-black">
                            make<span className="text-emerald-700">Form</span>
                        </span>
                        <span className="mt-1 hidden text-[9px] font-normal uppercase tracking-[0.12em] text-gray-700 sm:block">
                            visual form architect
                        </span>
                    </span>
                </Link>

                <div className="hidden items-center gap-1 rounded-md border border-[#E2E8E4] bg-[#FAF9F6] p-1 md:flex">
                    <Button asChild size="sm" className={`rounded-sm text-xs font-normal ${viewPage === "Home" ? "bg-white text-emerald-700 shadow hover:bg-white" : "bg-transparent text-gray-500 hover:bg-transparent hover:text-black/80"}`}>
                        <Link to="/"><Home className="size-3" /> Home</Link>
                    </Button>
                    <Button asChild size="sm" className={`rounded-sm text-xs font-normal ${viewPage === "FormBuilder" ? "bg-white text-emerald-700 shadow hover:bg-white" : "bg-transparent text-gray-500 hover:bg-transparent hover:text-black/80"}`}>
                        <Link to="/form-builder"><LayoutFreeform className="size-3" /> Form Builder</Link>
                    </Button>
                    <Button asChild size="sm" className={`rounded-sm text-xs font-normal ${viewPage === "LivePreview" ? "bg-white text-emerald-700 shadow hover:bg-white" : "bg-transparent text-gray-500 hover:bg-transparent hover:text-black/80"}`}>
                        <Link to="/live-preview"><Eye className="size-3" /> Live Preview</Link>
                    </Button>
                </div>

                <div className="hidden items-center gap-2 md:flex">
                    <Button type="button" size="icon-sm" variant="outline" onClick={() => window.location.reload()} aria-label="Reset page" title="Reset page">
                        <RotateCcw className="size-4 text-gray-500" />
                    </Button>
                    <Button asChild variant="outline" size="sm" className="rounded-sm font-medium">
                        <Link to="/sign-in">Sign In</Link>
                    </Button>
                    <Button asChild size="sm" className="rounded-sm border border-emerald-700 bg-emerald-700 font-medium text-white hover:bg-white hover:text-black">
                        <Link to="/create-account"><UserRound className="size-4" /> Sign Up</Link>
                    </Button>
                </div>

                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="md:hidden"
                    aria-label={isPageOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isPageOpen}
                    onClick={() => setIsPageOpen((open) => !open)}
                >
                    {isPageOpen ? <X /> : <Menu />}
                </Button>
            </nav>

            {isPageOpen && (
                <div className="mx-auto mt-2 w-full max-w-6xl border-t border-[#E2E8E4] pt-2 md:hidden">
                    <div className="grid gap-1">
                        <Button asChild variant="ghost" className="justify-start rounded-sm text-sm">
                            <Link to="/" onClick={closeMenu}><Home className="size-4" /> Home</Link>
                        </Button>
                        <Button asChild variant="ghost" className="justify-start rounded-sm text-sm">
                            <Link to="/form-builder" onClick={closeMenu}><LayoutFreeform className="size-4" /> Form Builder</Link>
                        </Button>
                        <Button asChild variant="ghost" className="justify-start rounded-sm text-sm">
                            <Link to="/live-preview" onClick={closeMenu}><Eye className="size-4" /> Live Preview</Link>
                        </Button>
                        <div className="mt-1 flex gap-2 border-t border-[#E2E8E4] pt-2">
                            <Button type="button" size="icon-sm" variant="outline" onClick={() => window.location.reload()} aria-label="Reset page" title="Reset page">
                                <RotateCcw className="size-4 text-gray-500" />
                            </Button>
                            <Button asChild variant="outline" size="sm" className="flex-1 rounded-sm font-medium">
                                <Link to="/sign-in" onClick={closeMenu}>Sign In</Link>
                            </Button>
                            <Button asChild size="sm" className="flex-1 rounded-sm bg-emerald-700 font-medium text-white hover:bg-emerald-800">
                                <Link to="/create-account" onClick={closeMenu}><UserRound className="size-4" /> Sign Up</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}