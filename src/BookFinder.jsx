import React, { useEffect, useMemo, useRef, useState } from "react";

// BOOK Finder – single-file React component
// Requirements implemented:
// - Title "BOOK Finder" at the top
// - Green & white color scheme with Tailwind CSS
// - Responsive layout (mobile-first)
// - Search input with a button next to it
// - On click/search, fetch from Open Library Search API and render results
// - Graceful loading, empty, and error states
// - Accessible labels and keyboard submission (Enter key)

export default function BookFinderApp() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const controllerRef = useRef(null);

  // Build a cover image URL if cover id is present
  const coverUrl = (coverId, size = "M") =>
    coverId ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg` : null;

  const canSearch = useMemo(() => query.trim().length > 0 && !loading, [query, loading]);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setHasSearched(true);
    setError("");
    setLoading(true);

    // Abort any in-flight request to avoid race conditions
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(q)}&limit=24`;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      const mapped = (data.docs || []).map((doc) => ({
        key: doc.key, // e.g., "/works/OL...W"
        title: doc.title || "Untitled",
        authors: doc.author_name || [],
        year: doc.first_publish_year,
        coverId: doc.cover_i,
      }));
      setResults(mapped);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Something went wrong. Please try again.");
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  useEffect(() => () => controllerRef.current?.abort(), []);

  return (
    <div className="min-h-screen bg-green-50 text-green-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-green-100">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-green-700">
            BOOK Finder
          </h1>
          <p className="mt-1 text-sm text-green-700/80">
            Search books by title using the Open Library catalog.
          </p>
        </div>
      </header>

      {/* Search Bar */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <label htmlFor="search" className="sr-only">
            Search by book title
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by title (e.g., The Alchemist)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 text-base outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400"
          />
          <button
            type="submit"
            onClick={handleSearch}
            disabled={!canSearch}
            className="whitespace-nowrap rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Search books"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner /> Searching...
              </span>
            ) : (
              "Search"
            )}
          </button>
        </form>

        {/* Status / Alerts */}
        <section className="mt-4 min-h-[2rem]" aria-live="polite">
          {error && (
            <div className="rounded-xl border border-red-200 bg-white px-4 py-3 text-red-700">
              {error}
            </div>
          )}
          {!loading && hasSearched && !error && results.length === 0 && (
            <div className="rounded-xl border border-green-200 bg-white px-4 py-3 text-green-700">
              No books found. Try a different title.
            </div>
          )}
        </section>

        {/* Results Grid */}
        <section className="mt-6">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((b) => (
              <li key={b.key} className="group">
                <article className="h-full overflow-hidden rounded-2xl border border-green-200 bg-white shadow-sm transition hover:shadow md:hover:-translate-y-0.5">
                  <div className="aspect-[3/4] w-full bg-green-100 overflow-hidden">
                    {b.coverId ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverUrl(b.coverId, "L")}
                        alt={`Cover of ${b.title}`}
                        className="h-full w-full object-cover object-center transition group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-green-500">
                        <BookIcon className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-2 text-lg font-semibold text-green-900">{b.title}</h3>
                    <p className="mt-1 text-sm text-green-700/80 line-clamp-1">
                      {b.authors.length > 0 ? b.authors.join(", ") : "Unknown Author"}
                    </p>
                    {b.year && (
                      <p className="mt-0.5 text-xs text-green-700/70">First published: {b.year}</p>
                    )}
                    <div className="mt-3">
                      <a
                        href={`https://openlibrary.org${b.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-green-300 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-600 hover:text-white transition"
                      >
                        View on Open Library
                        <ArrowIcon className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer note */}
        <footer className="mt-10 pb-10 text-center text-xs text-green-700/70">
          Data from Open Library. This is a demo app.
        </footer>
      </main>
    </div>
  );
}

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent align-[-0.125em]"
      role="status"
      aria-label="loading"
    />
  );
}

function ArrowIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M13.5 4.5a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0V6.31l-7.22 7.22a.75.75 0 1 1-1.06-1.06L17.44 5.25h-3.19a.75.75 0 0 1-.75-.75Z" />
      <path d="M6 3.75A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25h12A2.25 2.25 0 0 0 20.25 18V12a.75.75 0 0 0-1.5 0v6A.75.75 0 0 1 18 18.75H6A.75.75 0 0 1 5.25 18V6A.75.75 0 0 1 6 5.25h6a.75.75 0 0 0 0-1.5H6Z" />
    </svg>
  );
}

function BookIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M6.75 2.25A2.25 2.25 0 0 0 4.5 4.5v15a2.25 2.25 0 0 0 2.25 2.25H18a.75.75 0 0 0 0-1.5H6.75a.75.75 0 0 1-.75-.75v-15a.75.75 0 0 1 .75-.75H18a.75.75 0 0 0 0-1.5H6.75Z" />
      <path d="M8.25 5.25A.75.75 0 0 1 9 4.5h10.5A2.25 2.25 0 0 1 21.75 6.75v12A2.25 2.25 0 0 1 19.5 21H9a.75.75 0 0 1-.75-.75V5.25Z" />
    </svg>
  );
}
