import React from "react";

export const Main = ({ children }: { children: React.ReactNode }) => {
  return <div className="container flex-1">{children}</div>;
};
