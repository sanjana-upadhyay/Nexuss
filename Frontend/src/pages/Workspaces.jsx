import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Breadcrumbs from "../component/common/Breadcrumbs";
import { motion, AnimatePresence } from "framer-motion";
import { getWorkspaces } from "../services/workspaceService";
import { getAIRecommendations } from "../services/aiService";
import WorkspaceCard from "../component/workspace/WorkspaceCard";
import { WorkspaceCardSkeleton } from "../component/common/Skeleton";
import { WORKSPACE_TYPES } from "../utils/workspaceTypes";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const amenityOptions = [
  { key: "wifi", label: "Wifi" },
  { key: "parking", label: "Parking" },
  { key: "ac", label: "AC" },
  { key: "meetingRoom", label: "Meeting room" },
  { key: "cafeteria", label: "Cafeteria" },
];

const SORT_OPTIONS = [
  { key: "newest", label: "Newest first" },
  { key: "price_low", label: "Price: Low to High" },
  { key: "price_high", label: "Price: High to Low" },
  { key: "rating", label: "Highest rated" },
];

const PAGE_SIZE = 8;

const FiltersPanel = ({
  city,
  setCity,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  amenities,
  toggleAmenity,
  handleSearch,
  clearFilters,
  activeFilterCount,
}) => (
  <div className="space-y-6 bg-[#1c1917] border border-[#33302c] rounded-2xl p-5 lg:sticky lg:top-24">
    <div>
      <label className="block text-sm text-[#948b80] mb-2">City</label>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="e.g. Indore"
        className="w-full px-3 py-2 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] text-sm focus:outline-none focus:border-[#c9a26d] transition"
      />
      <p className="text-[#66605a] text-xs mt-1">Auto-searches as you type</p>
    </div>

    <div>
      <label className="block text-sm text-[#948b80] mb-2">Price range (₹)</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min"
          className="w-full px-3 py-2 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] text-sm focus:outline-none focus:border-[#c9a26d] transition"
        />
        <span className="text-[#948b80] text-sm">–</span>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max"
          className="w-full px-3 py-2 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] text-sm focus:outline-none focus:border-[#c9a26d] transition"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm text-[#948b80] mb-2">Amenities</label>
      <div className="space-y-2">
        {amenityOptions.map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center gap-2 text-sm text-[#ede9e3]/80 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={amenities[key] || false}
              onChange={() => toggleAmenity(key)}
              className="accent-[#c9a26d]"
            />
            {label}
          </label>
        ))}
      </div>
    </div>

    <div className="flex gap-2 pt-1">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSearch}
        className="flex-1 px-4 py-2 rounded-lg bg-[#c9a26d] text-[#12100f] text-sm font-medium hover:bg-[#d9b481] transition"
      >
        Apply
      </motion.button>
      {activeFilterCount > 0 || city ? (
        <button
          onClick={clearFilters}
          className="px-4 py-2 rounded-lg border border-[#33302c] text-[#948b80] text-sm hover:text-[#ede9e3] transition"
        >
          Clear
        </button>
      ) : null}
    </div>
  </div>
);

const Workspaces = () => {
  const [searchParams] = useSearchParams();

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [activeType, setActiveType] = useState(searchParams.get("type") || "");
  const [sortBy, setSortBy] = useState("newest");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [amenities, setAmenities] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiActive, setAiActive] = useState(false);
  const [aiError, setAiError] = useState("");

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const debounceRef = useRef(null);
  const isFirstRun = useRef(true);

  const buildFilters = (overrideCity) => {
    const filters = { city: overrideCity !== undefined ? overrideCity : city };
    if (activeType) filters.type = activeType;
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    Object.keys(amenities).forEach((key) => {
      if (amenities[key]) filters[key] = true;
    });
    return filters;
  };

  const fetchWorkspaces = async (filters = {}) => {
    setLoading(true);
    setError("");
    try {
      const data = await getWorkspaces(filters);
      setWorkspaces(data);
      setVisibleCount(PAGE_SIZE);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWorkspaces(buildFilters());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced auto-search when city changes
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (aiActive) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchWorkspaces(buildFilters(city));
    }, 500);

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  const handleSearch = (e) => {
    e?.preventDefault();
    setAiActive(false);
    fetchWorkspaces(buildFilters());
  };

  const handleTypeClick = (typeKey) => {
    setAiActive(false);
    const newType = activeType === typeKey ? "" : typeKey;
    setActiveType(newType);
    fetchWorkspaces({ city, type: newType || undefined });
  };

  const toggleAmenity = (key) => {
    setAmenities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearFilters = () => {
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    setAmenities({});
    setActiveType("");
    setAiActive(false);
    fetchWorkspaces();
  };

  const activeFilterCount =
    (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + Object.values(amenities).filter(Boolean).length;

  const handleAISearch = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setAiError("");
    setAiLoading(true);
    try {
      const recommendations = await getAIRecommendations(aiQuery);
      setWorkspaces(recommendations);
      setVisibleCount(PAGE_SIZE);
      setAiActive(true);
    } catch (err) {
      setAiError(err.response?.data?.message || "AI search failed");
    } finally {
      setAiLoading(false);
    }
  };

  const clearAISearch = () => {
    setAiActive(false);
    setAiQuery("");
    fetchWorkspaces();
  };

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  const sortedWorkspaces = [...workspaces].sort((a, b) => {
    if (sortBy === "price_low") return a.price - b.price;
    if (sortBy === "price_high") return b.price - a.price;
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  const visibleWorkspaces = sortedWorkspaces.slice(0, visibleCount);
  const hasMore = visibleCount < workspaces.length;
  const isBusy = loading || aiLoading;

  return (
    <div className="min-h-screen bg-[#12100f] px-6 sm:px-8 py-12">
      <div className="max-w-6xl mx-auto">
  <Breadcrumbs items={[{ label: "Workspaces" }]} />
  <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4 text-xs text-[#948b80] uppercase tracking-widest">
            <span className="w-6 h-px bg-[#c9a26d]" />
            Browse
          </div>

          <h1
            className="text-3xl sm:text-4xl text-[#ede9e3] mb-6"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Find your workspace
          </h1>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {WORKSPACE_TYPES.map((t) => (
              <button
                key={t.key}
                onClick={() => handleTypeClick(t.key)}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  activeType === t.key
                    ? "bg-[#c9a26d] border-[#c9a26d] text-[#12100f] font-medium"
                    : "border-[#33302c] text-[#948b80] hover:border-[#c9a26d]/40 hover:text-[#c9a26d]"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleAISearch} className="mb-4 max-w-xl">
            <div className="flex gap-3">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="✨ Try: quiet workspace in Indore under ₹500"
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#1c1917] border border-[#4c7a73]/30 text-[#ede9e3] focus:outline-none focus:border-[#4c7a73] transition"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={aiLoading}
                className="px-5 py-2.5 rounded-lg bg-[#4c7a73] text-[#ede9e3] font-medium hover:bg-[#5a8f87] transition disabled:opacity-50 whitespace-nowrap"
              >
                {aiLoading ? "Thinking..." : "✨ AI Search"}
              </motion.button>
            </div>
            {aiError && <p className="text-red-400 text-xs mt-2">{aiError}</p>}
          </form>

          <AnimatePresence>
            {aiActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 mb-6 text-sm text-[#4c7a73]"
              >
                <span>✨ Showing AI recommendations for "{aiQuery}"</span>
                <button
                  onClick={clearAISearch}
                  className="text-[#948b80] hover:text-[#ede9e3] underline transition"
                >
                  Clear
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* Filters sidebar */}
          <div>
            <button
              onClick={() => setShowFilters((p) => !p)}
              className="lg:hidden mb-4 flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-[#1c1917] border border-[#33302c] text-[#ede9e3] text-sm"
            >
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              <span>{showFilters ? "−" : "+"}</span>
            </button>

            <div className="hidden lg:block">
              <FiltersPanel
                city={city}
                setCity={setCity}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                amenities={amenities}
                toggleAmenity={toggleAmenity}
                handleSearch={handleSearch}
                clearFilters={clearFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>

            <div className="lg:hidden">
              <AnimatePresence initial={false}>
                {showFilters && (
                  <motion.div
                    key="mobile-filters"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <FiltersPanel
                      city={city}
                      setCity={setCity}
                      minPrice={minPrice}
                      setMinPrice={setMinPrice}
                      maxPrice={maxPrice}
                      setMaxPrice={setMaxPrice}
                      amenities={amenities}
                      toggleAmenity={toggleAmenity}
                      handleSearch={handleSearch}
                      clearFilters={clearFilters}
                      activeFilterCount={activeFilterCount}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Results */}
          <div>
            {!isBusy && workspaces.length > 0 && (
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-[#948b80]">
                  {workspaces.length} {workspaces.length === 1 ? "space" : "spaces"} found
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#1c1917] border border-[#33302c] text-[#ede9e3] text-sm focus:outline-none focus:border-[#c9a26d]"
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.key} value={s.key}>
                      Sort: {s.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {isBusy && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <WorkspaceCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!isBusy && error && (
              <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm mb-4 max-w-md border border-red-500/20">
                {error}
              </div>
            )}

            {!isBusy && workspaces.length === 0 && !error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[#948b80]"
              >
                No workspaces found. Try different filters.
              </motion.p>
            )}

            {!isBusy && workspaces.length > 0 && (
              <>
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={stagger}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  {visibleWorkspaces.map((workspace) => (
                    <motion.div key={workspace._id} variants={cardIn}>
                      <WorkspaceCard workspace={workspace} />
                    </motion.div>
                  ))}
                </motion.div>

                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleLoadMore}
                      className="px-6 py-2.5 rounded-lg border border-[#33302c] text-[#ede9e3] text-sm hover:border-[#c9a26d] hover:text-[#c9a26d] transition"
                    >
                      Load more ({workspaces.length - visibleCount} remaining)
                    </motion.button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspaces;