'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  LineChart,
  Line,
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
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  ThumbsUp,
  MapPin,
  ArrowLeft,
  RefreshCw,
  Calendar,
  BarChart3,
  Sparkles,
} from 'lucide-react';

interface AnalyticsData {
  summary: {
    totalProblems: number;
    resolvedProblems: number;
    pendingProblems: number;
    inProgressProblems: number;
    totalUpvotes: number;
    resolutionRate: number;
    trendPercentage: number;
  };
  problemsOverTime: { date: string; count: number; resolved: number }[];
  categoryBreakdown: { name: string; value: number }[];
  statusDistribution: { name: string; value: number }[];
  topReporters: { phone: string; reports: number; upvotes: number }[];
  locationBreakdown: { name: string; value: number }[];
}

const COLORS = ['#0091ff', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6'];

const STATUS_COLORS: Record<string, string> = {
  REPORTED: '#f59e0b',
  'IN REVIEW': '#0091ff',
  'IN PROGRESS': '#8b5cf6',
  RESOLVED: '#10b981',
  REJECTED: '#ef4444',
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState(30);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';
      const response = await fetch(`${baseUrl}/api/ministry/analytics?days=${dateRange}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError('Failed to fetch analytics');
      }
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="geist-spinner w-8 h-8" />
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="geist-card-glass p-8 max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error || 'Failed to load analytics'}</p>
          <button onClick={fetchAnalytics} className="geist-button geist-button-secondary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { summary, problemsOverTime, categoryBreakdown, statusDistribution, topReporters, locationBreakdown } = data;

  return (
    <>
      {/* Header */}
      <header className="header-glass sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-xl hover:bg-white/[0.05] transition-colors text-gray-500 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <span className="font-semibold text-lg">Analytics</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(Number(e.target.value))}
              className="geist-input h-10 w-auto text-sm px-4"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button
              onClick={fetchAnalytics}
              className="p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors text-gray-500 hover:text-white"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Community Analytics</h1>
          <p className="text-gray-500">Overview of community problems and resolution metrics.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: AlertCircle,
              value: summary.totalProblems,
              label: "Total Problems",
              gradient: "from-blue-500 to-cyan-500",
              trend: summary.trendPercentage,
            },
            {
              icon: CheckCircle,
              value: summary.resolvedProblems,
              label: "Resolved",
              gradient: "from-emerald-500 to-green-500",
              progress: summary.resolutionRate,
            },
            {
              icon: Clock,
              value: summary.pendingProblems,
              label: "Pending Review",
              gradient: "from-amber-500 to-orange-500",
            },
            {
              icon: ThumbsUp,
              value: summary.totalUpvotes,
              label: "Community Votes",
              gradient: "from-violet-500 to-purple-500",
            },
          ].map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="geist-card-glass p-5"
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
              <p className="stat-card-value text-3xl md:text-4xl">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
              {card.progress !== undefined && (
                <div className="geist-progress mt-3">
                  <div className="geist-progress-bar" style={{ width: `${card.progress}%` }} />
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
                <AreaChart data={problemsOverTime}>
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
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
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
                <BarChart data={statusDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis type="number" stroke="#666" tick={{ fill: '#666', fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" stroke="#666" tick={{ fill: '#666', fontSize: 11 }} width={85} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {statusDistribution.map((entry, index) => (
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
              {topReporters.slice(0, 5).map((reporter, index) => (
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
              {locationBreakdown.slice(0, 5).map((location, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-400 truncate max-w-[150px]">{location.name}</span>
                    <span className="text-sm font-semibold text-white">{location.value}</span>
                  </div>
                  <div className="geist-progress">
                    <div
                      className="geist-progress-bar"
                      style={{ width: `${(location.value / (locationBreakdown[0]?.value || 1)) * 100}%` }}
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
          className="geist-card-glass p-8 border-emerald-500/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/20">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Resolution Rate</h3>
                <p className="text-gray-500">Percentage of problems successfully resolved</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#2a2a2a" strokeWidth="8" fill="none" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="url(#progressGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${summary.resolutionRate * 2.51} 251`}
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
                  <span className="text-2xl font-bold text-white">{summary.resolutionRate}%</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-emerald-400">{summary.resolvedProblems}</p>
                <p className="text-sm text-gray-500">of {summary.totalProblems} problems</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
