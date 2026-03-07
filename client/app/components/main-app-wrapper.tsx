"use client";

import { AppShell } from "@/app/components/app-shell";
import { ProblemsClient } from "@/app/components/problems-client";
import { Problem } from "@/lib/types";

interface MainAppWrapperProps {
  initialProblems: Problem[];
}

export function MainAppWrapper({ initialProblems }: MainAppWrapperProps) {
  return (
    <AppShell>
      <ProblemsClient initialProblems={initialProblems} />
    </AppShell>
  );
}
