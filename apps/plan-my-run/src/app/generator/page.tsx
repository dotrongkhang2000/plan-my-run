import { Metadata } from "next";
import ClientPage from "@/app/generator/client-page";

export const metadata: Metadata = {
  title: "Generator",
  description: "Generator Your Running Plan",
};

const Page = () => {
  return <ClientPage />;
};

export default Page;
