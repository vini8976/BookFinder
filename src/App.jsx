import React, { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`https://openlibrary.org/search.json?title=${query}`);
      const data = await res.json();

      console.log(data)
      setBooks(data.docs.slice(0, 12));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setBooks([]);
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <h1 className="text-5xl font-extrabold text-green-700 text-center mb-4 drop-shadow-md">
        📚 BOOK Finder
      </h1>
      <p className="text-center text-gray-700 mb-8 text-lg">
        Search books by title using the{" "}
        <span className="text-green-600 font-medium">Open Library</span> catalog.
      </p>

      {/* Search Bar */}
      <div className="flex justify-center gap-2 mb-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔎 Search by title (e.g., The Alchemist)"
          className="w-80 px-4 py-2 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
        />
        <button
          onClick={searchBooks}
          className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow-md hover:scale-105 transition"
        >
          Search
        </button>
        <button
          onClick={clearSearch}
          className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition"
        >
          Clear
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <p className="text-center text-green-700 font-semibold animate-pulse">
          Loading books...
        </p>
      )}

      {/* Results */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4">
        {books.map((book, index) => (
          <div
            key={index}
            className="border rounded-xl shadow-lg p-4 bg-white hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
                className="w-full h-52 object-cover rounded-md mb-3"
              />
            ) : (
              <div className="w-full h-52 bg-green-100 flex items-center justify-center rounded-md mb-3">
                <span className="text-green-600">No Cover</span>
              </div>
            )}
            <h2 className="font-semibold text-lg text-green-800">{book.title}</h2>
            <p className="text-sm text-gray-600">
              {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
            </p>
            <p className="text-xs text-gray-500">
              First published: {book.first_publish_year || "N/A"}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-center text-gray-600 mt-12 text-sm">
        Data from <span className="text-green-600 font-medium">Open Library</span>.
        Demo built for <span className="font-semibold">Alex</span> (college student).
      </p>
    </div>
  );
}

export default App;
