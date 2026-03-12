import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  TrendingUp,
} from "lucide-react";

import type { AnalyticsData } from "@/lib/hooks/use-analytics";

export type InsightTone = "critical" | "warning" | "positive";

export interface ActionItem {
  title: string;
  detail: string;
  action: string;
  tone: InsightTone;
  icon: LucideIcon;
  href: string;
  priorityScore: number;
}

function buildHomeLink(params: Record<string, string>) {
  const searchParams = new URLSearchParams({ sort: "priority", ...params });
  return `/?${searchParams.toString()}`;
}

function getOfficeGuidance(categoryName: string) {
  const name = categoryName.toLowerCase();

  if (name.includes("sanitation") || name.includes("waste") || name.includes("drain")) {
    return {
      office: "sanitation operations",
      action: "Dispatch waste and drainage teams first, then confirm cleanup with a same-day field check.",
    };
  }

  if (name.includes("road") || name.includes("infrastructure") || name.includes("water") || name.includes("electric")) {
    return {
      office: "works and infrastructure",
      action: "Send this queue to the works team first and group nearby repairs into one field assignment.",
    };
  }

  if (name.includes("security") || name.includes("safety") || name.includes("crime") || name.includes("light")) {
    return {
      office: "public safety response",
      action: "Escalate these reports to safety leads for immediate inspection and visible quick-response action.",
    };
  }

  return {
    office: "the responsible ministry team",
    action: "Route this cluster to the responsible ministry team and assign one owner for follow-through.",
  };
}

export function buildActionItems(data: AnalyticsData, dateRange: number): ActionItem[] {
  const topCategory = data.categoryBreakdown[0];
  const topLocation = data.locationBreakdown[0];
  const recentWindow = data.problemsOverTime.slice(-Math.min(7, data.problemsOverTime.length));
  const reportedRecently = recentWindow.reduce((sum, day) => sum + day.count, 0);
  const resolvedRecently = recentWindow.reduce((sum, day) => sum + day.resolved, 0);
  const pendingReview = data.summary.pendingProblems;
  const inProgress = data.summary.inProgressProblems;
  const unresolved = pendingReview + inProgress;
  const backlogShare = data.summary.totalProblems
    ? Math.round((unresolved / data.summary.totalProblems) * 100)
    : 0;
  const items: ActionItem[] = [];

  if (pendingReview > 0) {
    items.push({
      title: "Triage newly reported cases first",
      detail: `${pendingReview} problems are still waiting for first review, so new complaints may be sitting without ownership.`,
      action: "Have the ministry duty desk clear unreviewed reports first so urgent cases enter the right queue today.",
      tone: pendingReview >= 10 ? "critical" : "warning",
      icon: Clock,
      href: buildHomeLink({ status: "REPORTED", tab: "active" }),
      priorityScore: pendingReview * 5 + backlogShare,
    });
  }

  if (reportedRecently > resolvedRecently) {
    items.push({
      title: "Stop the backlog from growing",
      detail: `${reportedRecently} problems were reported in the last ${Math.min(7, dateRange)} days, while only ${resolvedRecently} were resolved.`,
      action: "Shift the next response window toward quick wins and high-visibility cases until closures catch up.",
      tone: "critical",
      icon: TrendingUp,
      href: buildHomeLink({ status: "REPORTED", tab: "active" }),
      priorityScore: (reportedRecently - resolvedRecently) * 4 + unresolved,
    });
  }

  if (inProgress > 0) {
    items.push({
      title: "Unblock work already in progress",
      detail: `${inProgress} problems are marked in progress and need follow-through before new work is opened.`,
      action: "Review blocked field jobs first, remove approvals or logistics delays, and close the fastest ones this week.",
      tone: inProgress >= 8 ? "critical" : "warning",
      icon: AlertCircle,
      href: buildHomeLink({ status: "IN_PROGRESS", tab: "active" }),
      priorityScore: inProgress * 4,
    });
  }

  if (topCategory) {
    const guidance = getOfficeGuidance(topCategory.name);

    items.push({
      title: `Prioritize ${topCategory.name}`,
      detail: `${topCategory.value} reports fall into this category, making it the biggest pressure point for ${guidance.office}.`,
      action: guidance.action,
      tone: "warning",
      icon: AlertCircle,
      href: buildHomeLink({ search: topCategory.name, tab: "active" }),
      priorityScore: topCategory.value * 3,
    });
  }

  if (topLocation) {
    items.push({
      title: `Target ${topLocation.name} first`,
      detail: `${topLocation.value} reports came from this location, making it the highest concentration of complaints in this period.`,
      action: "Send a place-based response team there first so one field visit can close multiple related reports.",
      tone: "warning",
      icon: MapPin,
      href: buildHomeLink({ search: topLocation.name, tab: "active" }),
      priorityScore: topLocation.value * 3,
    });
  }

  if (items.length < 4) {
    items.push({
      title: "Protect the current resolution rate",
      detail: `${data.summary.resolvedProblems} problems have already been resolved with a ${data.summary.resolutionRate}% resolution rate.`,
      action: "Keep the same response rhythm on high-vote unresolved cases so public confidence stays visible.",
      tone: "positive",
      icon: CheckCircle,
      href: buildHomeLink({ status: "IN_PROGRESS", tab: "active" }),
      priorityScore: 1,
    });
  }

  return items.sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 4);
}
