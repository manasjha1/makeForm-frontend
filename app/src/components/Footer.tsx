import { FormInput, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router";

interface FooterProps {
    onNavigate?: (mode: toggleBtn) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
    return (
        <footer className="bg-white border-t border-[#E2E8E4] font-sans select-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="md:col-span-4 space-y-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#047857] flex items-center justify-center text-white shadow-2xs">
                                <FormInput className="w-4 h-4 stroke-[2.2]" />
                            </div>
                            <span className="font-extrabold text-[#1C2925] text-base tracking-tight font-sans">
                                Dynamic<span className="text-[#047857]">Form</span>
                            </span>
                        </div>
                        <p className="text-xs text-[#6B7872] leading-relaxed max-w-sm">
                            The next-generation visual form studio. Design high-converting web forms with conditional logic, validation, and zero code.
                        </p>
                        <div className="flex items-center gap-2 pt-1 text-[11px] text-[#047857] font-semibold bg-[#ECFDF5] px-3 py-1 rounded-full w-fit border border-[#A7F3D0]">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Version 2.4 Pro Studio</span>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
                        <div>
                            <h4 className="font-bold text-[#1C2925] uppercase tracking-wider text-[11px] mb-3">
                                Product
                            </h4>
                            <ul className="space-y-2 text-[#6B7872]">
                                <li>
                                    <button onClick={() => onNavigate?.('FormBuilder')} className="hover:text-[#047857] transition-colors cursor-pointer">
                                        3-Column Canvas
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => onNavigate?.('LivePreview')} className="hover:text-[#047857] transition-colors cursor-pointer">
                                        Live Form Preview
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => onNavigate?.('Home')} className="hover:text-[#047857] transition-colors cursor-pointer">
                                        Prebuilt Templates
                                    </button>
                                </li>
                                <li>
                                    <a href="#templates" className="hover:text-[#047857] transition-colors">
                                        Conditional Field Logic
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-[#1C2925] uppercase tracking-wider text-[11px] mb-3">
                                Account & Auth
                            </h4>
                            <ul className="space-y-2 text-[#6B7872]">
                                <li>
                                    <Link to="/login" className="hover:text-[#047857] transition-colors cursor-pointer">
                                        Log In
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/create-account" className="hover:text-[#047857] transition-colors cursor-pointer">
                                        Create Account
                                    </Link>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-[#047857] transition-colors">
                                        Security & Compliance
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-[#047857] transition-colors">
                                        Enterprise Workspace
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-[#1C2925] uppercase tracking-wider text-[11px] mb-3">
                                Resources
                            </h4>
                            <ul className="space-y-2 text-[#6B7872]">
                                <li>
                                    <a href="#" className="hover:text-[#047857] transition-colors">
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-[#047857] transition-colors">
                                        API & Webhooks
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-[#047857] transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-[#047857] transition-colors">
                                        Terms of Service
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-6 border-t border-[#E2E8E4] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6B7872]">
                    <p>© 2026 DynamicForm Studio Inc. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            All Systems Operational
                        </span>
                        <span>•</span>
                        <span>Designed with Emerald Precision</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
