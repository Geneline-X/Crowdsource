import { ReactNode } from "react";

import { Sidebar } from "@/app/components/sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
}
