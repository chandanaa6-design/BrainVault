import { useEffect, useState } from "react";
import { createFlashcard, updateFlashcard } from "../../services/api";

function FlashcardForm({
    editingCard,
    setEditingCard,
    onFlashcardSaved,
}) {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [subject, setSubject] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");

    useEffect(() => {
        if (editingCard) {
            setQuestion(editingCard.question);
            setAnswer(editingCard.answer);
            setSubject(editingCard.subject);
            setDifficulty(editingCard.difficulty);
        }
    }, [editingCard]);

    const clearForm = () => {
        setQuestion("");
        setAnswer("");
        setSubject("");
        setDifficulty("Easy");
        setEditingCard(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCard) {
                await updateFlashcard(editingCard.id, {
                    question,
                    answer,
                    subject,
                    difficulty,
                });

                alert("✅ Flashcard Updated!");
            } else {
                await createFlashcard({
                    question,
                    answer,
                    subject,
                    difficulty,
                });

                alert("✅ Flashcard Saved!");
            }

            await onFlashcardSaved();
            clearForm();

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
                {editingCard ? "Update Flashcard" : "Save Flashcard"}
            </button>

        </form>
    );
}

export default FlashcardForm;