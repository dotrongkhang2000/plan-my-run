import { Button } from "@heroui/button";
import ClientPage from "./client-page";

export default async function Home() {
  return (
    <div>
      <Button>Hello world</Button>

      <ClientPage />
    </div>
  );
}
