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

const COLORS = ['#0091ff', '#30a46c', '#f5a623', '#e5484d', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

const STATUS_COLORS: Record<string, string> = {
  REPORTED: '#f5a623',
  'IN REVIEW': '#0091ff',
  'IN PROGRESS': '#8b5cf6',
  RESOLVED: '#30a46c',
  REJECTED: '#e5484d',
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
      <div className="min-h-screen bg-[var(--ds-background-100)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="geist-spinner w-6 h-6" />
          <p className="geist-text-small">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[var(--ds-background-100)] flex items-center justify-center">
        <div className="geist-card p-6 max-w-md border-[var(--ds-red-400)]">
          <p className="text-[var(--ds-red-600)]">{error || 'Failed to load analytics'}</p>
          <button onClick={fetchAnalytics} className="geist-button geist-button-secondary mt-4">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { summary, problemsOverTime, categoryBreakdown, statusDistribution, topReporters, locationBreakdown } = data;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--ds-background-100)] border-b border-[var(--ds-gray-300)]">
        <div className="max-w-screen-xl mx-auto px-3 md:px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-md hover:bg-[var(--ds-gray-200)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[var(--ds-gray-700)]" />
            </Link>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[var(--ds-blue-500)]" />
              <span className="font-semibold text-sm md:text-base">Analytics</span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(Number(e.target.value))}
              className="geist-input h-8 w-auto text-sm px-2"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button
              onClick={fetchAnalytics}
              className="geist-button geist-button-secondary h-8 px-2"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">Community Analytics</h1>
          <p className="geist-text-body text-sm md:text-base">
            Overview of community problems and resolution metrics.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="geist-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-[var(--ds-blue-500)]" />
              <span className={`flex items-center text-xs ${summary.trendPercentage >= 0 ? 'text-[var(--ds-green-600)]' : 'text-[var(--ds-red-600)]'}`}>
                {summary.trendPercentage >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {Math.abs(summary.trendPercentage)}%
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-bold">{summary.totalProblems}</p>
            <p className="geist-text-small">Total Problems</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="geist-card p-4"
          >
            <CheckCircle className="w-5 h-5 text-[var(--ds-green-500)] mb-2" />
            <p className="text-2xl md:text-3xl font-bold">{summary.resolvedProblems}</p>
            <p className="geist-text-small">Resolved</p>
            <div className="geist-progress mt-2">
              <div
                className="geist-progress-bar bg-[var(--ds-green-500)]"
                style={{ width: `${summary.resolutionRate}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="geist-card p-4"
          >
            <Clock className="w-5 h-5 text-[var(--ds-amber-500)] mb-2" />
            <p className="text-2xl md:text-3xl font-bold">{summary.pendingProblems}</p>
            <p className="geist-text-small">Pending Review</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="geist-card p-4"
          >
            <ThumbsUp className="w-5 h-5 text-[var(--ds-blue-500)] mb-2" />
            <p className="text-2xl md:text-3xl font-bold">{summary.totalUpvotes}</p>
            <p className="geist-text-small">Community Votes</p>
          </motion.div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Problems Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="geist-card p-4 md:p-6"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--ds-gray-600)]" />
              Problems Over Time
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={problemsOverTime}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0091ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0091ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#30a46c" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#30a46c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--ds-gray-400)" />
                  <XAxis dataKey="date" stroke="var(--ds-gray-600)" tick={{ fill: 'var(--ds-gray-700)', fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis stroke="var(--ds-gray-600)" tick={{ fill: 'var(--ds-gray-700)', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--ds-background-200)', border: '1px solid var(--ds-gray-400)', borderRadius: '6px' }}
                    labelStyle={{ color: 'var(--ds-gray-900)' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="count" name="Reported" stroke="#0091ff" fillOpacity={1} fill="url(#colorCount)" />
                  <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#30a46c" fillOpacity={1} fill="url(#colorResolved)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="geist-card p-4 md:p-6"
          >
            <h3 className="font-semibold mb-4">Category Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--ds-background-200)', border: '1px solid var(--ds-gray-400)', borderRadius: '6px' }}
                    itemStyle={{ color: 'var(--ds-gray-900)' }}
                  />
                  <Legend 
                    formatter={(value) => <span style={{ color: 'var(--ds-gray-700)', fontSize: '12px' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="geist-card p-4 md:p-6"
          >
            <h3 className="font-semibold mb-4">Status Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--ds-gray-400)" />
                  <XAxis type="number" stroke="var(--ds-gray-600)" tick={{ fill: 'var(--ds-gray-700)', fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" stroke="var(--ds-gray-600)" tick={{ fill: 'var(--ds-gray-700)', fontSize: 10 }} width={80} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--ds-background-200)', border: '1px solid var(--ds-gray-400)', borderRadius: '6px' }}
                    itemStyle={{ color: 'var(--ds-gray-900)' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
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
            className="geist-card p-4 md:p-6"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--ds-amber-500)]" />
              Top Reporters
            </h3>
            <div className="space-y-3">
              {topReporters.slice(0, 5).map((reporter, index) => (
                <div key={index} className="geist-entity py-2 px-0 border-0 border-b border-[var(--ds-gray-300)] last:border-0">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    index === 0 ? 'bg-[var(--ds-amber-500)] text-black' :
                    index === 1 ? 'bg-[var(--ds-gray-600)] text-white' :
                    index === 2 ? 'bg-[var(--ds-amber-700)] text-black' :
                    'bg-[var(--ds-gray-300)] text-[var(--ds-gray-900)]'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="geist-text-mono text-xs flex-1">{reporter.phone}</span>
                  <span className="font-semibold text-sm">{reporter.reports}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Locations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="geist-card p-4 md:p-6"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--ds-red-500)]" />
              Top Locations
            </h3>
            <div className="space-y-3">
              {locationBreakdown.slice(0, 5).map((location, index) => (
                <div key={index} className="flex items-center justify-between gap-2">
                  <span className="geist-text-small truncate max-w-[120px]">{location.name}</span>
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <div className="w-16 geist-progress">
                      <div
                        className="geist-progress-bar bg-[var(--ds-red-500)]"
                        style={{ 
                          width: `${(location.value / (locationBreakdown[0]?.value || 1)) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="font-semibold text-sm w-6 text-right">{location.value}</span>
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
          className="geist-card p-6 border-[var(--ds-green-400)]"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Resolution Rate</h3>
              <p className="geist-text-body">Percentage of problems successfully resolved</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="var(--ds-gray-400)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="var(--ds-green-500)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${summary.resolutionRate * 2.01} 201`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">{summary.resolutionRate}%</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[var(--ds-green-600)]">{summary.resolvedProblems}</p>
                <p className="geist-text-small">of {summary.totalProblems} problems</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
