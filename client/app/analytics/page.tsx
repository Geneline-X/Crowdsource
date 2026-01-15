"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  ThumbsUp,
  MapPin,
  RefreshCw,
  Calendar,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { useAnalytics } from "@/lib/hooks/use-analytics";
import { AnalyticsSkeleton } from "@/app/components/ui/skeleton";

const COLORS = ['#0091ff', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6'];

const STATUS_COLORS: Record<string, string> = {
  REPORTED: '#f59e0b',
  'IN REVIEW': '#0091ff',
  'IN PROGRESS': '#8b5cf6',
  RESOLVED: '#10b981',
  REJECTED: '#ef4444',
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState(30);
  const { data, isLoading, error, refetch } = useAnalytics(dateRange);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F0F1E8]">
      {/* Header */}
      <header className="shrink-0 bg-white border-b border-[#E8E6E1] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#5B9BD5]/20 border border-[#5B9BD5]/30">
              <BarChart3 className="w-5 h-5 text-[#5B9BD5]" />
            </div>
            <span className="font-semibold text-lg text-[#262626]">Analytics</span>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(Number(e.target.value))}
              className="h-10 px-4 text-sm bg-white border border-[#E8E6E1] rounded-lg text-[#525252]"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button
              onClick={() => refetch()}
              className="p-2.5 rounded-lg hover:bg-[#E8E6E1] transition-colors text-[#525252]"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#262626] mb-2">Community Analytics</h1>
          <p className="text-[#525252]">Overview of community problems and resolution metrics.</p>
        </div>

        {isLoading ? (
          <AnalyticsSkeleton />
        ) : error || !data ? (
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <div className="bg-white rounded-xl border border-[#E8E6E1] p-8 max-w-md text-center">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
              <p className="text-red-500 mb-4">{error ? (error as Error).message : 'Failed to load analytics'}</p>
              <button onClick={() => refetch()} className="px-4 py-2 bg-[#2D5A47] text-white rounded-lg hover:bg-[#235242] transition-colors">
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                {
                  icon: AlertCircle,
                  value: data.summary.totalProblems,
                  label: "Total Problems",
                  gradient: "from-blue-500 to-cyan-500",
                  trend: data.summary.trendPercentage,
                },
                {
                  icon: CheckCircle,
                  value: data.summary.resolvedProblems,
                  label: "Resolved",
                  gradient: "from-emerald-500 to-green-500",
                  progress: data.summary.resolutionRate,
                },
                {
                  icon: Clock,
                  value: data.summary.pendingProblems,
                  label: "Pending Review",
                  gradient: "from-amber-500 to-orange-500",
                },
                {
                  icon: ThumbsUp,
                  value: data.summary.totalUpvotes,
                  label: "Community Votes",
                  gradient: "from-violet-500 to-purple-500",
                },
              ].map((card, index) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-[#E8E6E1] p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    {card.trend !== undefined && (
                      <span className={`flex items-center gap-1 text-xs font-medium ${card.trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {card.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(card.trend)}%
                      </span>
                    )}
                  </div>
                  <p className="text-3xl font-bold text-[#262626]">{card.value}</p>
                  <p className="text-sm text-[#525252] mt-1">{card.label}</p>
                  {card.progress !== undefined && (
                    <div className="mt-3 h-1 bg-[#E8E6E1] rounded-full overflow-hidden">
                      <div className="h-full bg-[#4A7766] rounded-full" style={{ width: `${card.progress}%` }} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Problems Over Time */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="geist-card-glass p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <h3 className="font-semibold text-white">Problems Over Time</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.problemsOverTime}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0091ff" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0091ff" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                      <XAxis dataKey="date" stroke="#666" tick={{ fill: '#666', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                      <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="count" name="Reported" stroke="#0091ff" fillOpacity={1} fill="url(#colorCount)" />
                      <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Category Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="geist-card-glass p-6"
              >
                <h3 className="font-semibold text-white mb-6">Category Breakdown</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {data.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Legend formatter={(value) => <span style={{ color: '#888', fontSize: '12px' }}>{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Status Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="geist-card-glass p-6"
              >
                <h3 className="font-semibold text-white mb-6">Status Distribution</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.statusDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                      <XAxis type="number" stroke="#666" tick={{ fill: '#666', fontSize: 11 }} />
                      <YAxis dataKey="name" type="category" stroke="#666" tick={{ fill: '#666', fontSize: 11 }} width={85} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                        {data.statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Top Reporters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="geist-card-glass p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-amber-400" />
                  <h3 className="font-semibold text-white">Top Reporters</h3>
                </div>
                <div className="space-y-3">
                  {data.topReporters.slice(0, 5).map((reporter, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-amber-500 text-black' :
                        index === 1 ? 'bg-gray-500 text-white' :
                        index === 2 ? 'bg-amber-700 text-white' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-400 font-mono flex-1 truncate">{reporter.phone}</span>
                      <span className="text-sm font-semibold text-white">{reporter.reports}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Top Locations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="geist-card-glass p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5 text-red-400" />
                  <h3 className="font-semibold text-white">Top Locations</h3>
                </div>
                <div className="space-y-4">
                  {data.locationBreakdown.slice(0, 5).map((location, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-gray-400 truncate max-w-[150px]">{location.name}</span>
                        <span className="text-sm font-semibold text-white">{location.value}</span>
                      </div>
                      <div className="geist-progress">
                        <div
                          className="geist-progress-bar"
                          style={{ width: `${(location.value / (data.locationBreakdown[0]?.value || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Resolution Rate Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-xl border border-[#E8E6E1] p-8"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/20">
                    <Sparkles className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#262626]">Resolution Rate</h3>
                    <p className="text-[#525252]">Percentage of problems successfully resolved</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="#E8E6E1" strokeWidth="8" fill="none" />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="url(#progressGradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${data.summary.resolutionRate * 2.51} 251`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#262626]">{data.summary.resolutionRate}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-[#4A7766]">{data.summary.resolvedProblems}</p>
                    <p className="text-sm text-[#525252]">of {data.summary.totalProblems} problems</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
