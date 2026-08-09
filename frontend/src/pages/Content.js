// src/pages/Content.js

import { useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";

export default function Content() {
  const [tab, setTab] = useState("browse");

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [author, setAuthor] = useState(""); 
  const [theme, setTheme] = useState("");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [listening, setListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // -------------------------
  // TEXT SEARCH
  // -------------------------
  const browseBooks = async (customText = title) => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://127.0.0.1:8000/books/search",
        {
          params: { query: customText }
        }
      );

      setResults(res.data || []);

      saveRecent(customText);
    } catch (err) {
      alert("Search failed");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // CONTENT FILTER SEARCH
  // -------------------------
  const contentSearch = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://127.0.0.1:8000/books/filter",
        {
          params: {
            genre,
            author,
            theme
          }
        }
      );

      setResults(res.data || []);
    } catch {
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // VOICE SEARCH
  // -------------------------
  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Use Chrome browser for voice search");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const spokenText =
        event.results[0][0].transcript;

      setTitle(spokenText);
      browseBooks(spokenText);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };
  };

  // -------------------------
  // RECENT SEARCHES
  // -------------------------
  const saveRecent = (text) => {
    if (!text.trim()) return;

    let old =
      JSON.parse(
        localStorage.getItem("recentSearches")
      ) || [];

    old = old.filter((x) => x !== text);

    old.unshift(text);

    if (old.length > 5) old.pop();

    localStorage.setItem(
      "recentSearches",
      JSON.stringify(old)
    );
  };

  const recent =
    JSON.parse(
      localStorage.getItem("recentSearches")
    ) || [];

  // -------------------------
  // SUGGESTIONS
  // -------------------------
  const allSuggestions = [
    "Atomic Habits",
    "Ikigai",
    "Harry Potter",
    "The Hobbit",
    "The Alchemist",
    "Think and Grow Rich",
    "1984",
    "Self-help",
    "Fantasy",
    "Finance"
  ];

  const handleTyping = (value) => {
    setTitle(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = allSuggestions.filter(
      (item) =>
        item
          .toLowerCase()
          .includes(value.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white p-8">

      <h1 className="text-5xl font-bold mb-8">
        🔍 Discover Books
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setTab("browse")}
          className={`px-6 py-3 rounded-xl ${
            tab === "browse"
              ? "bg-pink-500"
              : "bg-gray-700"
          }`}
        >
          Browse
        </button>

        <button
          onClick={() => setTab("content")}
          className={`px-6 py-3 rounded-xl ${
            tab === "content"
              ? "bg-green-500"
              : "bg-gray-700"
          }`}
        >
          Content Search
        </button>
      </div>

      {/* ===================== */}
      {/* BROWSE */}
      {/* ===================== */}
      {tab === "browse" && (
        <div className="mb-10">

          {/* Search Row */}
          <div className="flex gap-4 flex-wrap">

            <input
              value={title}
              onChange={(e) =>
                handleTyping(e.target.value)
              }
              placeholder="Search title / genre / author..."
              className="p-4 rounded-xl text-black w-96"
            />

            <button
              onClick={() => browseBooks()}
              className="bg-pink-500 px-6 py-3 rounded-xl hover:scale-105 transition"
            >
              Search
            </button>

            {/* VOICE BUTTON */}
            <button
              onClick={startVoice}
              className={`px-6 py-3 rounded-xl transition ${
                listening
                  ? "bg-red-500 animate-pulse"
                  : "bg-blue-500 hover:scale-105"
              }`}
            >
              {listening
                ? "🎤 Listening..."
                : "🎙 Voice"}
            </button>

          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="bg-white text-black mt-3 rounded-xl w-96 shadow-lg overflow-hidden">

              {suggestions.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setTitle(item);
                    setSuggestions([]);
                    browseBooks(item);
                  }}
                  className="p-3 hover:bg-gray-200 cursor-pointer"
                >
                  {item}
                </div>
              ))}

            </div>
          )}

          {/* Recent Searches */}
          {recent.length > 0 && (
            <div className="mt-6">

              <h3 className="text-pink-400 mb-3">
                🕒 Recent Searches
              </h3>

              <div className="flex gap-3 flex-wrap">

                {recent.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setTitle(r);
                      browseBooks(r);
                    }}
                    className="bg-white/10 px-4 py-2 rounded-full hover:bg-white/20"
                  >
                    {r}
                  </button>
                ))}

              </div>

            </div>
          )}

        </div>
      )}

      {/* ===================== */}
      {/* CONTENT SEARCH */}
      {/* ===================== */}
      {tab === "content" && (
        <div className="grid md:grid-cols-4 gap-4 mb-10">

          <select
            onChange={(e) =>
              setGenre(e.target.value)
            }
            className="p-3 rounded-xl text-black"
          >
            <option value="">Genre</option>
            <option>Self-help</option>
            <option>Fantasy</option>
            <option>Fiction</option>
            <option>Finance</option>
          </select>

          <input
            placeholder="Author"
            onChange={(e) =>
              setAuthor(e.target.value)
            }
            className="p-3 rounded-xl text-black"
          />

          <input
            placeholder="Theme"
            onChange={(e) =>
              setTheme(e.target.value)
            }
            className="p-3 rounded-xl text-black"
          />

          <button
            onClick={contentSearch}
            className="bg-green-500 rounded-xl"
          >
            Search
          </button>

        </div>
      )}

      {/* RESULTS */}
      {loading ? (
        <h2 className="text-2xl animate-pulse">
          Loading...
        </h2>
      ) : (
        <div className="grid md:grid-cols-4 gap-8">
          {results.map((book, i) => (
            <BookCard key={i} book={book} />
          ))}
        </div>
      )}

    </div>
  );
}