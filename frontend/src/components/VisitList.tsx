import { useEffect, useState, useMemo } from "react";
import { 
  History, 
  RefreshCw, 
  Trash2, 
  Edit2, 
  X, 
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar
} from "lucide-react";
import { deleteVisit, getVisitDetails, getVisits, updateVisit } from "../services/api";
import type { VisitSummary, VisitDetails } from "../types";

export default function VisitList() {
  const [visits, setVisits] = useState<VisitSummary[]>([]);
  const [selected, setSelected] = useState<VisitDetails | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNote, setEditNote] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getVisits();
      setVisits(data || []);
      setCurrentPage(1); // Reset to first page when data loads
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function handleSelect(id: number) {
    if (activeId === id) {
      setSelected(null);
      setActiveId(null);
      return;
    }
    try {
      const data = await getVisitDetails(id);
      setSelected(data);
      setActiveId(id);
      setEditingId(null);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    if (!window.confirm(`Delete visit #${id}? This action cannot be undone.`)) return;
    try {
      await deleteVisit(id);
      if (activeId === id) {
        setSelected(null);
        setActiveId(null);
      }
      setVisits(prev => prev.filter(v => v.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }

  function handleEditStart(e: React.MouseEvent, id: number, currentNote: string) {
    e.stopPropagation();
    setEditingId(id);
    setEditNote(currentNote || "");
  }

  async function handleEditSave(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    if (!editNote.trim()) return;

    try {
      await updateVisit(id, [editNote]);
      await load();
      if (activeId === id) {
        const updated = await getVisitDetails(id);
        setSelected(updated);
      }
      setEditingId(null);
      setEditNote("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  function handleEditCancel(e: React.MouseEvent) {
    e.stopPropagation();
    setEditingId(null);
    setEditNote("");
  }

  function fmt(iso: string) {
    if (!iso) return "Invalid date";
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Filter visits based on search term and date filter
  const filteredVisits = useMemo(() => {
    let filtered = [...visits];
    
    // Search filter (by ID)
    if (searchTerm) {
      filtered = filtered.filter(v => 
        v.id.toString().includes(searchTerm.toLowerCase())
      );
    }
    
    // Date filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    switch (dateFilter) {
      case "today":
        filtered = filtered.filter(v => {
          const visitDate = new Date(v.created_at);
          return visitDate >= today;
        });
        break;
      case "week":
        filtered = filtered.filter(v => {
          const visitDate = new Date(v.created_at);
          return visitDate >= weekAgo;
        });
        break;
      case "month":
        filtered = filtered.filter(v => {
          const visitDate = new Date(v.created_at);
          return visitDate >= monthAgo;
        });
        break;
      default:
        break;
    }
    
    return filtered;
  }, [visits, searchTerm, dateFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVisits = filteredVisits.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter]);

  // Safely get summary text with null checks
  const getSummaryText = () => {
    if (!selected) return "Click to expand";
    return `${selected.drugs?.length || 0} drugs · ${selected.lab_tests?.length || 0} tests · ${selected.notes?.length || 0} notes`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <History size={16} />
            Visit History
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {filteredVisits.length} of {visits.length} visit{visits.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-3.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-1.5 disabled:opacity-50 w-full sm:w-auto justify-center"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by Visit ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
          </div>
          
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <Filter size={14} />
            Filters
            {dateFilter !== "all" && (
              <span className="w-2 h-2 bg-teal-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => setDateFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                dateFilter === "all"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateFilter("today")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                dateFilter === "today"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter("week")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                dateFilter === "week"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDateFilter("month")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                dateFilter === "month"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Last 30 Days
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <Loader2 size={32} className="animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Loading visits...</p>
        </div>
      ) : filteredVisits.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
          <Search size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 text-sm">No visits found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setDateFilter("all");
            }}
            className="mt-3 text-teal-600 text-sm hover:text-teal-700"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Desktop Table Head */}
            <div className="hidden md:grid grid-cols-[80px_1fr_1fr_auto] px-4 py-3 bg-gray-50 border-b border-gray-200">
              {["ID", "Date & Time", "Summary", "Actions"].map(h => (
                <span
                  key={h}
                  className={`text-xs font-semibold text-gray-500 uppercase tracking-wide ${
                    h === "Actions" ? "text-right" : "text-left"
                  }`}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {currentVisits.map((v) => ( 
              <div key={v.id} className="border-b border-gray-100 last:border-0">
                <div
                  onClick={() => handleSelect(v.id)}
                  className={`
                    p-4 cursor-pointer transition-all hover:bg-gray-50
                    md:grid md:grid-cols-[80px_1fr_1fr_auto] md:gap-4
                    ${activeId === v.id ? "bg-teal-50" : "bg-white"}
                  `}
                >
                  {/* Mobile View */}
                  <div className="md:hidden space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-semibold text-gray-700">
                        Visit #{v.id}
                      </span>
                      {activeId === v.id ? (
                        <ChevronUp size={16} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{fmt(v.created_at)}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {activeId === v.id && selected ? getSummaryText() : "Tap to expand"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={e => {
                            const note = selected?.notes?.[0] || "";
                            handleEditStart(e, v.id, note);
                          }}
                          className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={e => handleDelete(e, v.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:flex md:items-center">
                    <span className="font-mono text-sm font-medium text-gray-700">
                      #{v.id}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <span className="text-sm text-gray-900">{fmt(v.created_at)}</span>
                  </div>
                  <div className="hidden md:block">
                    <span className="text-xs text-gray-500">
                      {activeId === v.id && selected ? getSummaryText() : "Click to expand"}
                    </span>
                  </div>
                  <div className="hidden md:flex gap-1.5 justify-end">
                    <button
                      onClick={e => {
                        const note = selected?.notes?.[0] || "";
                        handleEditStart(e, v.id, note);
                      }}
                      className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                      title="Edit Note"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={e => handleDelete(e, v.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Visit"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded detail row */}
                {activeId === v.id && selected && editingId !== v.id && (
                  <div className="px-4 py-4 bg-teal-50 border-t border-teal-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { label: "💊 Drugs", items: selected.drugs || [] },
                        { label: "🔬 Lab Tests", items: selected.lab_tests || [] },
                        { label: "📋 Notes", items: selected.notes || [] },
                      ].map(col => (
                        <div key={col.label}>
                          <p className="text-xs font-semibold text-teal-800 mb-2 uppercase tracking-wide">
                            {col.label}
                          </p>
                          {col.items.length === 0 ? (
                            <p className="text-xs text-gray-500 italic">—</p>
                          ) : (
                            <div className="space-y-1.5">
                              {col.items.map((item, i) => (
                                <div
                                  key={i}
                                  className="text-xs text-gray-700 p-2 bg-white rounded-lg break-words"
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Edit form */}
                {editingId === v.id && (
                  <div className="px-4 py-4 bg-teal-50 border-t border-teal-200">
                    <div className="max-w-md">
                      <label className="block text-xs font-semibold text-teal-800 mb-2">
                        Edit Note
                      </label>
                      <textarea
                        value={editNote}
                        onChange={e => setEditNote(e.target.value)}
                        className="w-full px-3 py-2 border border-teal-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={e => handleEditSave(e, v.id)}
                          className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700 flex items-center gap-1.5"
                        >
                          <Check size={12} />
                          Save Changes
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium hover:bg-gray-50 flex items-center gap-1.5"
                        >
                          <X size={12} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-xs text-gray-500">per page</span>
              </div>

              {/* Pagination buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-all ${
                          currentPage === pageNum
                            ? "bg-teal-600 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Page info */}
              <div className="text-xs text-gray-500">
                Page {currentPage} of {totalPages} ({filteredVisits.length} total items)
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}