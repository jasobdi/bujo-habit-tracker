import Image from "next/image";
import RootLayout from "./layout";
import { BaseButton } from "@/components/ui/button/base-button/base-button";


export default function Home() {
  return (
    <RootLayout >
      <div>

      <BaseButton variant={"text"}>hallo</BaseButton>
      </div>
  </RootLayout>
  );
}
