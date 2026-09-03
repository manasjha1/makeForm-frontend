import type { SetStateAction } from "react";
import Header from "~/src/components/Header";

export default function Home() {
  return (
    <div>
      <Header
        viewPage={"Home"}
        setViewPage={function (value: SetStateAction<toggleBtn>): void {
          throw new Error("Function not implemented.");
        }}
      />
    </div>
  );
}
