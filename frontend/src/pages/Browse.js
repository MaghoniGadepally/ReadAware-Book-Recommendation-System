// BrowseBooks.js
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    loadBooks();
    setupVoice();
  }, []);

  // Load all books initially
  const loadBooks = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/books/all");
      setBooks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Voice Recognition Setup
  const setupVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);

    recognition.onend = () => setListening(false);

    recognition.onerror = () => setListening(false);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setQuery(text);
      searchBooks(text);
    };

    recognitionRef.current = recognition;
  };

  // Search books (text + voice)
  const searchBooks = async (text) => {
    try {
      if (!text.trim()) {
        loadBooks();
        return;
      }

      const res = await axios.get(
        "http://127.0.0.1:8000/books/search",
        {
          params: { q: text }
        }
      );

      setBooks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Start microphone
  const startVoice = () => {
    if (!recognitionRef.current) {
      alert("Voice search works in Chrome / Edge browser");
      return;
    }

    recognitionRef.current.start();
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold mb-8">
        📚 Browse Books
      </h1>

      {/* Search Bar */}
      <div className="flex gap-4 mb-10">

        <input
          type="text"
          value={query}
          placeholder="Search by title / author / genre"
          onChange={(e) => {
            setQuery(e.target.value);
            searchBooks(e.target.value);
          }}
          className="p-3 rounded text-black w-full"
        />

        <button
          onClick={startVoice}
          className={`px-5 rounded ${
            listening ? "bg-red-500" : "bg-pink-500"
          }`}
        >
          {listening ? "🎤 Listening..." : "🎙 Voice"}
        </button>

      </div>

      {/* Books */}
      <div className="grid md:grid-cols-4 gap-6">

        {books.map((book, i) => (
          <div
            key={i}
            className="bg-white/10 p-4 rounded-xl hover:scale-105 transition"
          >
            <img
              src={book.image_url}
              alt={book.title}
              className="h-64 w-full object-cover rounded mb-3"
            />

            <h2 className="font-bold">{book.title}</h2>
            <p>{book.author}</p>
            <p className="text-pink-400">{book.genre}</p>
          </div>
        ))}

      </div>

    </div>
  );
}