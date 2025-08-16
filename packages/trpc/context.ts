export async function createContext() {
  return {
    // Add your context here
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
