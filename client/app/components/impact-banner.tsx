"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Users, ThumbsUp, TrendingUp, Sparkles } from "lucide-react";

interface ImpactStats {
  resolvedThisMonth: number;
  totalReporters: number;
  totalUpvotes: number;
  resolutionRate: number;
}

function AnimatedCounter({ value, duration = 1500 }: { value: number | string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  const isPercentage = typeof value === "string" && value.includes("%");
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setDisplayValue(Math.floor(numericValue * easeOutQuart));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [numericValue, duration, hasAnimated]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue}{isPercentage ? "%" : ""}
    </span>
  );
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
      gradient: "from-emerald-500 to-green-600",
      glow: "shadow-emerald-500/20",
    },
    {
      icon: Users,
      value: stats.totalReporters,
      label: "Citizens engaged",
      gradient: "from-blue-500 to-cyan-500",
      glow: "shadow-blue-500/20",
    },
    {
      icon: ThumbsUp,
      value: stats.totalUpvotes,
      label: "Upvotes collected",
      gradient: "from-amber-500 to-orange-500",
      glow: "shadow-amber-500/20",
    },
    {
      icon: TrendingUp,
      value: `${stats.resolutionRate}%`,
      label: "Resolution rate",
      gradient: "from-violet-500 to-purple-600",
      glow: "shadow-violet-500/20",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="geist-card-glass p-6 md:p-8 mb-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20">
          <Sparkles className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h2 className="font-semibold text-base md:text-lg text-white">Community Impact</h2>
          <p className="text-sm text-gray-500">Real-time metrics showing our collective progress</p>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group relative"
          >
            <div className="relative p-4 md:p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.06] transition-all duration-300 hover:border-white/10 hover:bg-white/[0.06]">
              {/* Icon */}
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center mb-4 shadow-lg ${metric.glow} transition-transform group-hover:scale-105`}>
                <metric.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              
              {/* Value */}
              <p className="stat-card-value text-2xl md:text-3xl mb-1">
                <AnimatedCounter value={metric.value} />
              </p>
              
              {/* Label */}
              <p className="text-xs md:text-sm text-gray-500 leading-tight">
                {metric.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
