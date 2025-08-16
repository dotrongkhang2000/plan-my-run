"use client";

import { HeroUIProvider } from "@heroui/react";

import { TRPCReactProvider } from "@/vendors/trpc/client";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <TRPCReactProvider>
      <HeroUIProvider>{children}</HeroUIProvider>
    </TRPCReactProvider>
  );
};
