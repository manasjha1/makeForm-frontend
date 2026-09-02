import { Eye, Home, LayoutFreeform, LucideForm, RotateCcw, UserRound } from "lucide-react";
import { Button } from "./ui/button";

export default function Header() {
    return (
        <div>
            <header className="w-full p-2 bg-white backdrop:blur-lg shadow-lg/20">
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
                        <div className="bg-[#FAF9F6] flex items-center justify-between gap-2 rounded-sm border border-gray-300 py-1 px-2">
                            {/* is home ? text-green : text-black */}
                            <Button className="bg-white text-black text-xs font-normal rounded-sm group hover:bg-transparent hover:text-emerald-700 shadow">
                                <Home className="size-3 text-black group-hover:text-emerald-700" />{" "}
                                Home Page
                            </Button>
                            <Button className="bg-white text-black text-xs font-normal rounded-sm group hover:bg-transparent hover:text-emerald-700 shadow">
                                <LayoutFreeform className="size-3 text-black group-hover:text-emerald-700" />{" "}
                                Form Builder
                            </Button>
                            <Button className="bg-white text-black text-xs font-normal rounded-sm group hover:bg-transparent hover:text-emerald-700 shadow">
                                <Eye className="size-3 text-black group-hover:text-emerald-700" />{" "}
                                Live Priview
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <Button className="bg-white hover:bg-gray-50 rounded-sm border border-gray-400/50">
                            <RotateCcw className="text-gray-500 size-5" />
                        </Button>
                        <Button className="bg-white hover:bg-gray-50 text-black font-medium rounded-sm border border-gray-400/50">
                            Sign In
                        </Button>
                        <Button className="bg-emerald-700 hover:bg-white text-sm font-medium rounded-sm hover:text-black border border-gray-400/50">
                            <UserRound />  Sign Up
                        </Button>
                    </div>
                </nav>
            </header>
        </div>
    );
}
