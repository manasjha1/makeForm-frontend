import {
    Eye,
    Home,
    LayoutFreeform,
    LucideForm,
    RotateCcw,
    User,
    UserRound,
} from "lucide-react";
import makeForm_logo from "~/assests/makeForm_logo.png";
import { Button } from "./ui/button";
import { useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "~/src/components/ui/tooltip";
import { Link } from "react-router";

interface formProps {
    viewPage: toggleBtn;
    setViewPage: React.Dispatch<React.SetStateAction<toggleBtn>>;
}

export default function Header({ viewPage, setViewPage }: formProps) {
    const [isPageOpen, setIsPageOpen] = useState(false);
    return (
        <div>
            <header className="w-full fixed z-20 p-2 backdrop-blur-2xl shadow-sm/20">
                <nav className="w-full md:w-[90%] h-full flex items-center justify-between mx-auto gap-3">
                    <div className="flex items-center justify-evenly gap-6">
                        {/* logo */}
                        <Link to="/">
                            <img
                                className="w-full h-12 object-cover overflow-hidden"
                                src={makeForm_logo}
                                alt="makeForm-logo"
                            />
                        </Link>
                        <span className="text-gray-200 text-2xl hidden lg:flex">|</span>
                        <div className="hidden lg:flex items-center bg-[#f9f6f0] p-1 rounded-sm border border-[#E2E8E4] inset-shadow-accent">
                            <Link to="/">
                                <Button
                                    onClick={() => setViewPage("Home")}
                                    className={`text-[12px] font-medium transition-all px-5 rounded-sm ${viewPage === "Home" ? "bg-white hover:bg-white text-emerald-700 shadow" : "bg-transparent hover:bg-transparent text-gray-500 hover:text-black/80"}`}
                                >
                                    <Home className="size-3 group-hover:text-emerald-700" /> Home
                                </Button>
                            </Link>
                            <Link to="/form-builder">
                                <Button
                                    onClick={() => setViewPage("FormBuilder")}
                                    className={`text-[12px] font-medium transition-all px-5 rounded-sm ${viewPage === "FormBuilder" ? "bg-white hover:bg-white text-emerald-700 shadow" : "bg-transparent hover:bg-transparent text-gray-500 hover:text-black/80"}`}
                                >
                                    <LayoutFreeform className="size-3 group-hover:text-emerald-700" />{" "}
                                    Form Builder
                                </Button>
                            </Link>
                            <Link to="/live-preview">
                                <Button
                                    onClick={() => setViewPage("LivePreview")}
                                    className={`text-[12px] font-medium transition-all px-5 rounded-sm ${viewPage === "LivePreview" ? "bg-white hover:bg-white text-emerald-700 shadow" : "bg-transparent hover:bg-transparent text-gray-500 hover:text-black/80"}`}
                                >
                                    <Eye className="size-3 group-hover:text-emerald-700" /> Live
                                    Preview
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="hover:bg-gray-50 border border-[#E2E8E4] p-1 rounded-sm">
                                    <RotateCcw className="size-5 text-gray-600" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Reset to form template</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger className="hover:bg-gray-50 border border-[#E2E8E4] p-1 rounded-sm flex lg:hidden">
                                    <User className="size-5 text-gray-600" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Create account</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div className="hidden lg:flex items-center gap-2">
                            <Link to="/sign-in">
                                <Button className="bg-white hover:bg-gray-50 text-black text-xs font-medium rounded-sm border border-gray-400/50">
                                    Sign In
                                </Button>
                            </Link>
                            <Link to="/create-account">
                                <Button className="bg-emerald-700 hover:bg-white text-xs font-medium rounded-sm hover:text-emerald-700 hover:border-emerald-700 border border-gray-400/50">
                                    <User /> Sign Up
                                </Button>
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
}
