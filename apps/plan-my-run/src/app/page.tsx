import { Button } from "@heroui/button";
import ClientPage from "@/app/client-page";
import { TrainingPlanTable } from "@/components/traning-plan-table";

export default async function Home() {
  return (
    <div>
      <ClientPage />

      <TrainingPlanTable />
    </div>
  );
}
