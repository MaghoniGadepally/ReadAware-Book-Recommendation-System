import axios from "axios";
import { useState } from "react";
import BookCard from "../components/BookCard";

export default function Mood() {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const moodMapping = {
    "Cheerful": "happy",
    "Moody": "sad",
    "Calm": "calm",
    "Tired": "tired",

    "Laugh and have fun": "happy",
    "Reflect and relax": "sad",
    "Go on an adventure": "happy",
    "Read something emotional": "sad",

    "High energy": "happy",
    "Low energy": "sad",
    "Balanced energy": "calm",
    "Very low energy": "tired",

    "Happy, excited": "happy",
    "Sad, nostalgic": "sad",
    "Peaceful, content": "calm",
    "Motivated, adventurous": "happy",

    "Action-packed stories": "happy",
    "Deep emotional stories": "sad",
    "Relaxing and slow-paced": "calm",
    "Short and light reads": "tired"
  };

  const handleChange = (q, value) => {
    setAnswers({
      ...answers,
      [q]: value
    });
  };

  const getFinalMood = () => {
    const values = Object.values(answers);

    const mapped = values.map(
      (item) => moodMapping[item] || "happy"
    );

    const count = {};

    mapped.forEach((m) => {
      count[m] = (count[m] || 0) + 1;
    });

    const max = Math.max(...Object.values(count));

    const moods = Object.keys(count).filter(
      (m) => count[m] === max
    );

    return moods[0];
  };

  const fetchMood = async () => {
    try {
      setLoading(true);

      const finalMood = getFinalMood();

      const res = await axios.get(
        "http://127.0.0.1:8000/books/hybrid",
        {
          params: { mood: finalMood }
        }
      );

      setResults(res.data.recommendations || []);
    } catch {
      alert("Failed to fetch mood books");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white p-8">

      <h1 className="text-5xl font-bold mb-8">
        🎭 Mood Intelligence
      </h1>

      {/* EXACT QUESTIONS */}
      <div className="grid gap-5 max-w-xl">

        <select
          onChange={(e) =>
            handleChange("q1", e.target.value)
          }
          className="p-3 rounded-xl text-black"
        >
          <option>How do you feel?</option>
          <option>Cheerful</option>
          <option>Moody</option>
          <option>Calm</option>
          <option>Tired</option>
        </select>

        <select
          onChange={(e) =>
            handleChange("q2", e.target.value)
          }
          className="p-3 rounded-xl text-black"
        >
          <option>What do you want?</option>
          <option>Laugh and have fun</option>
          <option>Reflect and relax</option>
          <option>Go on an adventure</option>
          <option>Read something emotional</option>
        </select>

        <select
          onChange={(e) =>
            handleChange("q3", e.target.value)
          }
          className="p-3 rounded-xl text-black"
        >
          <option>Energy level?</option>
          <option>High energy</option>
          <option>Low energy</option>
          <option>Balanced energy</option>
          <option>Very low energy</option>
        </select>

        <select
          onChange={(e) =>
            handleChange("q4", e.target.value)
          }
          className="p-3 rounded-xl text-black"
        >
          <option>Emotion type?</option>
          <option>Happy, excited</option>
          <option>Sad, nostalgic</option>
          <option>Peaceful, content</option>
          <option>Motivated, adventurous</option>
        </select>

        <select
          onChange={(e) =>
            handleChange("q5", e.target.value)
          }
          className="p-3 rounded-xl text-black"
        >
          <option>Book type?</option>
          <option>Action-packed stories</option>
          <option>Deep emotional stories</option>
          <option>Relaxing and slow-paced</option>
          <option>Short and light reads</option>
        </select>

        <button
          onClick={fetchMood}
          className="bg-pink-500 px-6 py-3 rounded-xl hover:scale-105"
        >
          Get Recommendations
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <h2 className="mt-10 text-2xl animate-pulse">
          Loading...
        </h2>
      ) : (
        <div className="grid md:grid-cols-4 gap-8 mt-10">
          {results.map((book, i) => (
            <BookCard key={i} book={book} />
          ))}
        </div>
      )}

    </div>
  );
}