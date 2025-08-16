"use client";

import { useTRPC } from "@/vendors/trpc/client";
import { useQuery } from "@tanstack/react-query";

const ClientPage = () => {
  const trpc = useTRPC();
  const greeting = useQuery(
    trpc.v1.example.hello.queryOptions({ text: "123" })
  );
  if (!greeting.data) return <div>Loading...</div>;
  return <div>{greeting.data.greeting}</div>;
};

export default ClientPage;
