"use client"

import { ArrowBigUp, MapPin, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Problem } from "@/lib/data"
import { cn } from "@/lib/utils"

interface ProblemListProps {
  problems: Problem[]
  onUpvote: (id: string) => void
  selectedProblemId?: string | null
}

const categoryConfig = {
  infrastructure: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: "🛠️" },
  sanitation: { color: "bg-green-500/20 text-green-400 border-green-500/30", icon: "🗑️" },
  safety: { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: "⚠️" },
  other: { color: "bg-slate-500/20 text-slate-400 border-slate-500/30", icon: "📌" },
}

export function ProblemList({ problems, onUpvote, selectedProblemId }: ProblemListProps) {
  const sortedProblems = [...problems].sort((a, b) => b.upvotes - a.upvotes)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Community Priorities</h2>
          <p className="text-slate-400 text-sm mt-1">Vote for issues that matter to you</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            {problems.length} issues
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {sortedProblems.map((problem, index) => (
            <motion.div
              key={problem.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className={cn(
                "overflow-hidden transition-all duration-300",
                selectedProblemId === problem.id && "ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900"
              )}>
                <div className="flex items-stretch">
                  {/* Upvote Section */}
                  <div className="flex flex-col items-center justify-center px-4 py-6 bg-slate-800/30 border-r border-slate-700/50">
                    <button
                      className="upvote-btn group flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-indigo-500/20 transition-colors"
                      onClick={() => onUpvote(problem.id)}
                    >
                      <ArrowBigUp className="h-7 w-7 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                      <span className="text-lg font-bold text-white">{problem.upvotes}</span>
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-white leading-tight">{problem.title}</h3>
                        <p className="text-sm text-slate-400 line-clamp-2">{problem.description}</p>
                      </div>
                      <span className={cn(
                        "shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border",
                        categoryConfig[problem.category].color
                      )}>
                        <span>{categoryConfig[problem.category].icon}</span>
                        {problem.category.charAt(0).toUpperCase() + problem.category.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {problem.location.address}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(problem.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
