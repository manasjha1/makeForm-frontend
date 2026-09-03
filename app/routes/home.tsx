import { CheckCircle, MoveRight, Stars } from "lucide-react";
import type { SetStateAction } from "react";
import Header from "~/src/components/Header";
import { Button } from "~/src/components/ui/button";
import formImage from "~/assests/formImage.png";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Link } from "react-router";
import Footer from "~/src/components/Footer";

const prebuildTemplate = [
  {
    id: 0o1,
    name: "Client Onboarding",
    description:
      "Detailed client intake questionnaire with budget, requirements, and brand upload fields.",
  },
  {
    id: 0o2,
    name: "Event Registration",
    description:
      "RSVP form with workshop selection, dietary options, and guest count.",
  },
  {
    id: 0o3,
    name: "Customer Feedback Survey",
    description: "NPS rating, multi-choice satisfaction, and feature requests.",
  },
];

export default function Home() {
  return (
    <div className="bg-[#f9f6f0]">
      <Header
        viewPage={"Home"}
        setViewPage={function (value: SetStateAction<toggleBtn>): void {
          throw new Error("Function not implemented.");
        }}
      />
      <div className="min-h-full p-4">
        <section className="w-full md:w-[80%] lg:w-[50%] mx-auto my-5 mt-30">
          <div className="flex items-center justify-center gap-2 w-sm mx-auto px-3.5 py-1.5 rounded-full bg-[#D1FAE5] border border-[#065F46] text-[#065F46] text-xs font-bold mb-6 animate-pulse">
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
          <div className="grid md:flex items-center justify-center gap-6 mx-auto my-5">
            <Button className="bg-emerald-700 hover:bg-emerald-800 transition-all flex items-center gap-1 p-5 text-white text-sm font-medium rounded-sm shadow-lg capitalize">
              Launch your form{" "}
              <MoveRight className="w-3.5 h-3.5 text-white mx-2" />
            </Button>
            <Button className="bg-transparent group hover:bg-gray-100 border border-black p-5 text-black text-sm font-medium rounded-sm shadow-lg capitalize">
              Explore prebuilt templates
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-auto mt-10">
            <div className="flex items-center gap-2 w-50">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
              <p className="text-xs text-gray-400 font-normal capitalize">
                3 - column canvas layout
              </p>
            </div>
            <div className="flex items-center gap-2 w-50">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
              <p className="text-xs text-gray-400 font-normal capitalize">
                conditional field logic
              </p>
            </div>
            <div className="flex items-center gap-2 w-50">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
              <p className="text-xs text-gray-400 font-normal capitalize">
                instant json scheme export
              </p>
            </div>
            <div className="flex items-center gap-2 w-50">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
              <p className="text-xs text-gray-400 font-normal capitalize">
                mobile responsive preview
              </p>
            </div>
          </div>
        </section>
        <section className="">
          <img
            className="w-fit h-fit object-cover overflow-hidden"
            src={formImage}
            alt="form image"
          />
        </section>
        <hr className="w-full md:w-[80%] mx-auto my-5" />
        <section className="w-full md:w-[80%] mx-auto my-5">
          <div className="flex-1 items-center justify-center mx-auto my-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C2925] text-center tracking-tight max-w-4xl mx-auto leading-[1.12]">
              Start with pre-build configured teplate
            </h1>
            <p className="mt-2 text-base sm:text-lg text-[#6B7872] text-center max-w-2xl mx-auto font-normal leading-relaxed">
              Select any industry template to instantly populate the 3-column builder
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {prebuildTemplate?.map((form) => (
              <Card className="mx-auto w-full md:w-90 p-5 border group hover:border-emerald-700">
                <CardTitle className="rounded-sm p-2 w-fit bg-[#D1FAE5] border border-[#065F46] text-[#065F46] text-sm font-bold group-hover:bg-emerald-700 group-hover:text-white">
                  0{form.id}
                </CardTitle>
                <CardTitle className="">{form.name}</CardTitle>
                <CardDescription>{form.description}</CardDescription>
                <Link to={`formBuilder/${form.id}`} >
                  <Button className="bg-white hover:bg-emerald-700 text-emerald-700 hover:text-white border border-emerald-700 capitalize w-full">
                    load template
                  </Button>
                </Link>

              </Card>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
