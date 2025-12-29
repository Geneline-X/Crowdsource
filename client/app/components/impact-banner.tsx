"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Users, ThumbsUp, TrendingUp } from "lucide-react";

interface ImpactStats {
  resolvedThisMonth: number;
  totalReporters: number;
  totalUpvotes: number;
  resolutionRate: number;
}

export function ImpactBanner() {
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/impact-stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch impact stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return null;
  }

  const metrics = [
    {
      icon: CheckCircle,
      value: stats.resolvedThisMonth,
      label: "Resolved this month",
      color: "text-[var(--ds-green-500)]",
      bgColor: "bg-[var(--ds-green-100)]",
    },
    {
      icon: Users,
      value: stats.totalReporters,
      label: "Citizens engaged",
      color: "text-[var(--ds-blue-500)]",
      bgColor: "bg-[var(--ds-blue-100)]",
    },
    {
      icon: ThumbsUp,
      value: stats.totalUpvotes,
      label: "Upvotes collected",
      color: "text-[var(--ds-amber-500)]",
      bgColor: "bg-[var(--ds-amber-100)]",
    },
    {
      icon: TrendingUp,
      value: `${stats.resolutionRate}%`,
      label: "Resolution rate",
      color: "text-[var(--ds-green-600)]",
      bgColor: "bg-[var(--ds-green-100)]",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="geist-card p-4 md:p-5 mb-6"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-sm md:text-base mb-1">Community Impact</h2>
          <p className="geist-text-small">Real-time metrics showing our collective progress</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full md:w-auto">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 md:gap-3"
            >
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              <div>
                <p className="text-lg md:text-xl font-bold leading-tight">{metric.value}</p>
                <p className="geist-text-small text-[10px] md:text-xs leading-tight">{metric.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
