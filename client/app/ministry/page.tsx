'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProblemImage {
  id: number;
  url: string;
  mimeType: string;
  size: number;
}

interface Problem {
  id: number;
  reporterPhone: string;
  rawMessage: string;
  title: string;
  locationText?: string;
  latitude?: number;
  longitude?: number;
  locationVerified: boolean;
  locationSource?: string;
  nationalCategory?: string;
  recommendedOffice?: string;
  status: 'REPORTED' | 'IN_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  upvoteCount: number;
  images: ProblemImage[];
}

interface PaginatedResponse {
  success: boolean;
  data: Problem[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

const statusColors = {
  REPORTED: 'bg-yellow-100 text-yellow-800',
  IN_REVIEW: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  RESOLVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export default function MinistryDashboard() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(statusFilter && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`http://localhost:3800/api/ministry/problems?${params}`);
      const data: PaginatedResponse = await response.json();

      if (data.success) {
        setProblems(data.data);
        setTotalPages(data.pagination.totalPages);
      } else {
        setError('Failed to fetch problems');
      }
    } catch (err) {
      setError('Error fetching problems');
    } finally {
      setLoading(false);
    }
  };

  const updateProblemStatus = async (problemId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3800/api/ministry/problems/${problemId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchProblems();
        if (selectedProblem?.id === problemId) {
          setSelectedProblem(null);
        }
      }
    } catch (err) {
      console.error('Error updating problem status:', err);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [page, statusFilter, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Ministry Dashboard</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search problems..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="REPORTED">Reported</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setStatusFilter('');
                  setSearchTerm('');
                  setPage(1);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Problems List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {problems.map((problem) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{problem.title}</h3>
                    <p className="text-gray-600 mt-1">{problem.rawMessage}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[problem.status]}`}>
                        {problem.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(problem.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        From: {problem.reporterPhone}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {problem.images.length > 0 && (
                      <img
                        src={problem.images[0].url}
                        alt="Problem thumbnail"
                        className="w-20 h-20 object-cover rounded-md cursor-pointer"
                        onClick={() => setSelectedProblem(problem)}
                      />
                    )}
                  </div>
                </div>

                {problem.locationText && (
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Location:</strong> {problem.locationText}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <select
                      value={problem.status}
                      onChange={(e) => updateProblemStatus(problem.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="REPORTED">Reported</option>
                      <option value="IN_REVIEW">In Review</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setSelectedProblem(problem)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Problem Detail Modal */}
        <AnimatePresence>
          {selectedProblem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
              onClick={() => setSelectedProblem(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg max-w-4xl max-h-full overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">{selectedProblem.title}</h2>
                    <button
                      onClick={() => setSelectedProblem(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-gray-700 mb-4">{selectedProblem.rawMessage}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <strong>Status:</strong>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedProblem.status]}`}>
                        {selectedProblem.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <strong>Reporter:</strong> {selectedProblem.reporterPhone}
                    </div>
                    <div>
                      <strong>Created:</strong> {new Date(selectedProblem.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <strong>Upvotes:</strong> {selectedProblem.upvoteCount}
                    </div>
                  </div>

                  {selectedProblem.locationText && (
                    <div className="mb-4">
                      <strong>Location:</strong> {selectedProblem.locationText}
                      {selectedProblem.latitude && selectedProblem.longitude && (
                        <span className="ml-2 text-sm text-gray-500">
                          ({selectedProblem.latitude.toFixed(6)}, {selectedProblem.longitude.toFixed(6)})
                        </span>
                      )}
                    </div>
                  )}

                  {selectedProblem.images.length > 0 && (
                    <div className="mb-4">
                      <strong>Images:</strong>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {selectedProblem.images.map((image) => (
                          <img
                            key={image.id}
                            src={image.url}
                            alt="Problem image"
                            className="w-full h-32 object-cover rounded-md cursor-pointer"
                            onClick={() => window.open(image.url, '_blank')}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <select
                      value={selectedProblem.status}
                      onChange={(e) => {
                        updateProblemStatus(selectedProblem.id, e.target.value);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="REPORTED">Reported</option>
                      <option value="IN_REVIEW">In Review</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
