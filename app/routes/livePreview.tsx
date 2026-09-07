import type { SetStateAction } from "react";
import Header from "~/src/components/Header";

export default function LivePreview() {
    return (
        <div>
            <Header
                viewPage={"LivePreview"}
                setViewPage={function (value: SetStateAction<toggleBtn>): void {
                    throw new Error("Function not implemented.");
                }}
            />
            <h1 className="text-5xl text-center text-black font-extrabold p-5">
                Hello Live Preview
            </h1>
        </div>
    );
}
