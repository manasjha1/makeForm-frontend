import { MoveRight, Stars } from "lucide-react";
import type { SetStateAction } from "react";
import Header from "~/src/components/Header";
import { Button } from "~/src/components/ui/button";

export default function Home() {
  return (
    <div className="bg-[#f9f6f0]">
      <Header
        viewPage={"Home"}
        setViewPage={function (value: SetStateAction<toggleBtn>): void {
          throw new Error("Function not implemented.");
        }}
      />
      <div className="min-h-full w-full md:w-[80%] lg:w-[50%] mx-auto my-5 bg-amber-300 p-4">
        <section>
          <div className="flex items-center justify-center gap-2 w-sm mx-auto px-3.5 py-1.5 rounded-full bg-[#D1FAE5] border border-[#A7F3D0] text-[#065F46] text-xs font-bold mb-6 animate-pulse">
            <Stars className="w-3.5 h-3.5 text-[#047857]" />
            <span>Next-Gen Drag & Drop Form Studio</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1C2925] text-center tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Build intelligent, high-converting forms with{" "}
            <span className="text-[#047857] underline decoration-[#D1FAE5] underline-offset-8">
              effortless elegance
            </span>
            .
          </h1>

          {/* Short Description */}
          <p className="mt-6 text-base sm:text-lg text-[#6B7872] text-center max-w-2xl mx-auto font-normal leading-relaxed">
            Design, customize, and deploy multi-column web forms with live field
            validation, conditional logic, and instant JSON schemas—no code
            required.
          </p>
          <div className="flex items-center justify-center gap-6 mx-auto my-5">
            <Button className="bg-emerald-700 hover:bg-emerald-800 transition-all flex items-center gap-1 p-5 text-white text-sm font-medium rounded-sm shadow-lg">
              Launch your form <MoveRight className="w-3.5 h-3.5 text-white" />
            </Button>
            <Button className="bg-transparent group hover:bg-white/5 border border-black p-5 text-black text-sm font-medium rounded-sm shadow-lg">
              Launch your form
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
