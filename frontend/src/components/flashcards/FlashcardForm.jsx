import { useState } from "react";
import { createFlashcard } from "../../services/api";

function FlashcardForm({ onFlashcardSaved }) {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [subject, setSubject] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createFlashcard({
                question,
                answer,
                subject,
                difficulty,
            });

            alert("✅ Flashcard Saved!");

            // Tell Home.jsx to reload all flashcards
            onFlashcardSaved();

            setQuestion("");
            setAnswer("");
            setSubject("");
            setDifficulty("Easy");

        } catch (error) {
            console.error(error);
            alert("❌ Error saving flashcard.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            <input
                className="w-full border rounded-lg p-3"
                type="text"
                placeholder="Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
            />

            <textarea
                className="w-full border rounded-lg p-3"
                rows="4"
                placeholder="Answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
            />

            <input
                className="w-full border rounded-lg p-3"
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
            />

            <select
                className="w-full border rounded-lg p-3"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
            >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
            </select>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
            >
                Save Flashcard
            </button>

        </form>
    );
}

export default FlashcardForm;