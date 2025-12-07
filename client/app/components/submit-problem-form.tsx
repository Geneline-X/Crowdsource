"use client"

import { useState } from "react"
import { Plus, X, MapPin, FileText, Loader2, Hammer, Trash2, ShieldAlert, HelpCircle, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/components/ui/card"
import { cn } from "@/lib/utils"

interface SubmitProblemFormProps {
  onSuccess?: () => void
}

interface SearchResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

const categories = [
  { value: "infrastructure", label: "Infrastructure", icon: Hammer, color: "border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20" },
  { value: "sanitation", label: "Sanitation", icon: Trash2, color: "border-green-500/50 bg-green-500/10 hover:bg-green-500/20" },
  { value: "safety", label: "Safety", icon: ShieldAlert, color: "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" },
  { value: "other", label: "Other", icon: HelpCircle, color: "border-slate-500/50 bg-slate-500/10 hover:bg-slate-500/20" },
] as const

export function SubmitProblemForm({ onSuccess }: SubmitProblemFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [locationText, setLocationText] = useState("")
  const [category, setCategory] = useState<string>("other")
  const [customCategory, setCustomCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Location Search State
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!locationText.trim()) return
    
    setIsSearching(true)
    setSearchResults([])
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationText)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data)
      }
    } catch (err) {
      console.error("Failed to search location", err)
    } finally {
      setIsSearching(false)
    }
  }

  const selectLocation = (result: SearchResult) => {
    setLocationText(result.display_name)
    setCoordinates({
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon)
    })
    setSearchResults([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          locationText,
          category: category === "other" ? customCategory : category,
          latitude: coordinates?.lat,
          longitude: coordinates?.lon,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit problem")
      }

      setIsOpen(false)
      setTitle("")
      setDescription("")
      setLocationText("")
      setCoordinates(null)
      setCategory("other")
      setCustomCategory("")

      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit problem")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="geist-button geist-button-primary"
      >
        <Plus className="mr-2 h-4 w-4" />
        Report a Problem
      </Button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg z-10"
            >
              <Card className="border-indigo-500/30 shadow-2xl shadow-indigo-500/10 bg-[var(--ds-background-100)]">
                <CardHeader className="relative px-4 py-4 md:px-6 md:py-6 border-b border-[var(--ds-gray-200)]">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 top-4 p-2 rounded-lg hover:bg-[var(--ds-gray-200)] transition-colors text-[var(--ds-gray-600)]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <FileText className="w-5 h-5 text-indigo-500" />
                    </div>
                    Report a Problem
                  </CardTitle>
                  <CardDescription>
                    Help us identify and prioritize issues in your community.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4 px-4 py-4 md:px-6 md:py-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-2">
                      <label htmlFor="title" className="geist-text-label mb-1 block">Problem Title</label>
                      <input
                        id="title"
                        placeholder="e.g., Broken Street Light on Main St"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="geist-input focus:shadow-none"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="geist-text-label mb-1 block">Category</label>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => setCategory(cat.value)}
                            className={cn(
                              "flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 text-left",
                              category === cat.value
                                ? cn(cat.color, "border-opacity-100 ring-2 ring-offset-2 ring-offset-slate-900", 
                                    cat.value === "infrastructure" && "ring-blue-500",
                                    cat.value === "sanitation" && "ring-green-500",
                                    cat.value === "safety" && "ring-red-500",
                                    cat.value === "other" && "ring-slate-500"
                                  )
                                : "border-[var(--ds-gray-200)] bg-[var(--ds-gray-100)] hover:border-[var(--ds-gray-300)]"
                            )}
                          >
                            <cat.icon className={cn(
                              "w-5 h-5",
                              category === cat.value ? "text-white" : "text-[var(--ds-gray-500)]"
                            )} />
                            <span className={cn(
                              "text-sm font-medium",
                              category === cat.value ? "text-white" : "text-[var(--ds-gray-700)]"
                            )}>
                              {cat.label}
                            </span>
                          </button>
                        ))}
                      </div>
                      {category === "other" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2"
                        >
                          <label htmlFor="custom-category" className="geist-text-label mb-1 block">Specify Category</label>
                          <input
                            id="custom-category"
                            placeholder="e.g., Noise Complaint, Traffic"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className="geist-input focus:shadow-none"
                            required
                          />
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-2 relative">
                      <label htmlFor="location" className="geist-text-label mb-1 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[var(--ds-gray-500)]" />
                        Location / Address(search for exact coordinates)
                      </label>
                      <div className="relative">
                        <input
                          id="location"
                          placeholder="e.g., 123 Main St & 5th Ave"
                          value={locationText}
                          onChange={(e) => {
                            setLocationText(e.target.value)
                            setCoordinates(null) // Reset coordinates on manual edit
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleSearch()
                            }
                          }}
                          className="geist-input focus:shadow-none w-full pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={handleSearch}
                          disabled={isSearching || !locationText.trim()}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[var(--ds-gray-500)] hover:text-[var(--ds-gray-900)] hover:bg-[var(--ds-gray-200)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      {/* Search Results Dropdown */}
                      <AnimatePresence>
                        {searchResults.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-20 left-0 right-0 mt-1 bg-[var(--ds-background-100)] border border-[var(--ds-gray-400)] rounded-lg shadow-xl max-h-48 overflow-y-auto"
                          >
                            {searchResults.map((result) => (
                              <button
                                key={result.place_id}
                                type="button"
                                onClick={() => selectLocation(result)}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--ds-gray-100)] border-b border-[var(--ds-gray-200)] last:border-0 transition-colors"
                              >
                                {result.display_name}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {coordinates && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Coordinates found: {coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="description" className="geist-text-label mb-1 block">Description</label>
                      <textarea
                        id="description"
                        placeholder="Describe the issue in detail. What's wrong? How long has it been like this?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="geist-textarea focus:shadow-none"
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3 px-4 pt-6 pb-4 md:px-6 md:pt-8 md:pb-6 border-t border-[var(--ds-gray-200)] bg-[var(--ds-gray-50)] rounded-b-xl">
                    {error && (
                      <div className="w-full p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}
                    <div className="flex justify-end gap-3 w-full">
                      <button 
                        type="button" 
                        onClick={() => setIsOpen(false)} 
                        className="geist-button geist-button-secondary"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="geist-button geist-button-primary min-w-[120px]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Report"
                        )}
                      </button>
                    </div>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
