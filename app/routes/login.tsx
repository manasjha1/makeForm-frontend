import { LucideForm } from "lucide-react";
import type { SetStateAction } from "react";
import Header from "~/src/components/Header";

export default function Login() {
    return (
        <div className="bg-[#f9f6f0] h-screen">
            <Header viewPage={""} setViewPage={function (value: SetStateAction<toggleBtn>): void {
                throw new Error("Function not implemented.");
            }} />
            <div className="grid gap-6">
                {/* logo section */}
                <section className="flex-1 items-center justify-center m-auto gap-2 mt-20">
                    <div className="bg-emerald-700 rounded-lg inset-shadow-2xs p-2 w-fit mx-auto mb-3">
                        <LucideForm className="size-6 text-white" />
                    </div>
                    <div className="flex-col items-baseline">
                        <h4 className="text-black text-center text-xl font-bold">
                            make
                            <span className="text-emerald-700 text-xl font-bold">
                                Form
                            </span>
                        </h4>
                        <p className="text-center text-[10px] text-gray-700 font-normal uppercase">
                            visual form architect
                        </p>
                    </div>
                </section>
                {/* form section */}
                <section className="w-auto h-fit p-4 rounded-lg bg-white border border-gray-500 shadow">
                    <div className=""></div>
                </section>
            </div>
        </div>
    )
}
