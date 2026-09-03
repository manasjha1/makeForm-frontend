import {
    Eye,
    Home,
    LayoutFreeform,
    LucideForm,
    RotateCcw,
    UserRound,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/src/components/ui/tooltip";

interface formProps {
    viewPage: toggleBtn;
    setViewPage: React.Dispatch<React.SetStateAction<toggleBtn>>;
}

export default function Header({ viewPage, setViewPage }: formProps) {
    const [isPageOpen, setIsPageOpen] = useState(false);
    return (
        <div>
            <header className="w-full p-2 backdrop:blur-lg shadow-lg/20">
                <nav className="w-full md:w-[90%] h-full flex items-center justify-between m-auto gap-3">
                    <div className="flex items-center justify-evenly gap-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-emerald-700 rounded-lg inset-shadow-2xs p-2">
                                <LucideForm className="size-6 text-white" />
                            </div>
                            <div className="flex-col items-baseline">
                                <h4 className="text-black text-left text-xl font-bold">
                                    make
                                    <span className="text-left text-emerald-700 text-xl font-bold">
                                        Form
                                    </span>
                                </h4>
                                <p className="text-left text-[10px] text-gray-700 font-normal uppercase">
                                    visual form architect
                                </p>
                            </div>
                        </div>
                        <span className="text-gray-200 text-2xl">|</span>
                        <div className="hidden md:flex items-center bg-[#f9f6f0] p-1 rounded-sm border border-[#E2E8E4]">
                            <Button
                                onClick={() => setViewPage("Home")}
                                className={`text-[12px] font-normal rounded-sm ${viewPage === "Home" ? "bg-white hover:bg-white text-emerald-700 shadow" : "bg-transparent hover:bg-transparent text-gray-500 hover:text-black/80"}`}
                            >
                                <Home className="size-3 group-hover:text-emerald-700" /> Home
                            </Button>
                            <Button
                                onClick={() => setViewPage("FormBuilder")}
                                className={`text-[12px] font-normal rounded-sm ${viewPage === "FormBuilder" ? "bg-white hover:bg-white text-emerald-700 shadow" : "bg-transparent hover:bg-transparent text-gray-500 hover:text-black/80"}`}
                            >
                                <LayoutFreeform className="size-3 group-hover:text-emerald-700" />{" "}
                                Form Builder
                            </Button>
                            <Button
                                onClick={() => setViewPage("LivePreview")}
                                className={`text-[12px] font-normal rounded-sm ${viewPage === "LivePreview" ? "bg-white hover:bg-white text-emerald-700 shadow" : "bg-transparent hover:bg-transparent text-gray-500 hover:text-black/80"}`}
                            >
                                <Eye className="size-3 group-hover:text-emerald-700" /> Live
                                Preview
                            </Button>
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
                        </TooltipProvider>
                        <Button className="bg-white hover:bg-gray-50 text-black font-medium rounded-sm border border-gray-400/50">
                            Sign In
                        </Button>
                        <Button className="bg-emerald-700 hover:bg-white text-sm font-medium rounded-sm hover:text-black border border-gray-400/50">
                            <UserRound /> Sign Up
                        </Button>
                    </div>
                </nav>
            </header>
        </div>
    );
}
