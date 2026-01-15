"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMinistryProblems, useUpdateStatus, MinistryProblem } from "@/lib/hooks/use-ministry";
import { MinistrySkeleton } from "@/app/components/ui/skeleton";

const statusColors: Record<string, string> = {
  REPORTED: 'bg-yellow-100 text-yellow-800',
  IN_REVIEW: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  RESOLVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export default function MinistryDashboard() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProblem, setSelectedProblem] = useState<MinistryProblem | null>(null);

  const { data, isLoading, error, refetch } = useMinistryProblems({
    page,
    limit: 10,
    status: statusFilter,
    search: searchTerm
  });

  const updateStatus = useUpdateStatus();

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-8 gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Ministry Dashboard</h1>
          <div className="flex gap-2">
            <button
               onClick={() => refetch()} 
               className="p-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
               title="Refresh data"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <a
              href="/ministry/analytics"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-lg shadow-purple-500/25"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Analytics
            </a>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-3 md:p-4 mb-4 md:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search problems..."
                className="w-full px-2 md:px-3 py-1.5 md:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-2 md:px-3 py-1.5 md:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full md:w-auto px-3 md:px-4 py-1.5 md:py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Problems List */}
        {isLoading ? (
          <MinistrySkeleton />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{(error as Error).message || "Failed to fetch problems"}</p>
            <button 
              onClick={() => refetch()}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-500 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {data?.data.map((problem) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow p-3 md:p-6"
              >
                <div className="flex flex-col md:flex-row justify-between items-start mb-3 md:mb-4 gap-3">
                  <div className="flex-1 w-full">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">{problem.title}</h3>
                    <p className="text-sm md:text-base text-gray-600 mt-1">{problem.rawMessage}</p>
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mt-2">
                      <span className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${statusColors[problem.status]}`}>
                        {problem.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs md:text-sm text-gray-500">
                        {new Date(problem.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs md:text-sm text-gray-500 hidden sm:inline">
                        From: {problem.reporterPhone}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {problem.images.length > 0 && (
                      <img
                        src={problem.images[0].url}
                        alt="Problem thumbnail"
                        className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md cursor-pointer shrink-0"
                        onClick={() => setSelectedProblem(problem)}
                      />
                    )}
                  </div>
                </div>

                {problem.locationText && (
                  <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">
                    <strong>Location:</strong> {problem.locationText}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex gap-2 w-full sm:w-auto">
                    <select
                      value={problem.status}
                      onChange={(e) => updateStatus.mutate({ id: problem.id, status: e.target.value })}
                      disabled={updateStatus.isPending && updateStatus.variables?.id === problem.id}
                      className="flex-1 sm:flex-initial px-2 md:px-3 py-1 border border-gray-300 rounded-md text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
                    className="w-full sm:w-auto px-3 py-1 bg-blue-600 text-white rounded-md text-xs md:text-sm hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */
        data?.pagination && data.pagination.totalPages > 1 && (
          <div className="flex justify-center mt-4 md:mt-8 gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm">
              Page {page} of {data.pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
              disabled={page === data.pagination.totalPages}
              className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
              className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-3 md:p-4"
              onClick={() => setSelectedProblem(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 md:p-6">
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <h2 className="text-xl md:text-2xl font-bold pr-2">{selectedProblem.title}</h2>
                    <button
                      onClick={() => setSelectedProblem(null)}
                      className="text-gray-500 hover:text-gray-700 shrink-0"
                    >
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4">{selectedProblem.rawMessage}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mb-3 md:mb-4">
                    <div className="text-sm md:text-base">
                      <strong>Status:</strong>
                      <span className={`ml-2 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${statusColors[selectedProblem.status]}`}>
                        {selectedProblem.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-sm md:text-base">
                      <strong>Reporter:</strong> {selectedProblem.reporterPhone}
                    </div>
                    <div className="text-sm md:text-base">
                      <strong>Created:</strong> {new Date(selectedProblem.createdAt).toLocaleString()}
                    </div>
                    <div className="text-sm md:text-base">
                      <strong>Upvotes:</strong> {selectedProblem.upvoteCount}
                    </div>
                  </div>

                  {selectedProblem.locationText && (
                    <div className="mb-3 md:mb-4 text-sm md:text-base">
                      <strong>Location:</strong> {selectedProblem.locationText}
                      {selectedProblem.latitude && selectedProblem.longitude && (
                        <span className="ml-2 text-xs md:text-sm text-gray-500">
                          ({selectedProblem.latitude.toFixed(6)}, {selectedProblem.longitude.toFixed(6)})
                        </span>
                      )}
                    </div>
                  )}

                  {selectedProblem.images.length > 0 && (
                    <div className="mb-3 md:mb-4 text-sm md:text-base">
                      <strong>Images:</strong>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 md:gap-2 mt-2">
                        {selectedProblem.images.map((image) => (
                          <img
                            key={image.id}
                            src={image.url}
                            alt="Problem image"
                            className="w-full h-24 md:h-32 object-cover rounded-md cursor-pointer"
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
                         updateStatus.mutate({ id: selectedProblem.id, status: e.target.value });
                         // Also update local state for immediate feedback in modal
                         setSelectedProblem({ ...selectedProblem, status: e.target.value as MinistryProblem['status'] });
                      }}
                      className="flex-1 sm:flex-initial px-2 md:px-3 py-1.5 md:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
