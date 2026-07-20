import { deleteFlashcard } from "../../services/api";
function FlashcardList({ flashcards, onFlashcardDeleted }) {
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this flashcard?"
        );

        if (!confirmDelete) return;

        try {
            await deleteFlashcard(id);

            alert("✅ Flashcard deleted!");

            onFlashcardDeleted();

        } catch (error) {
            console.error(error);
            alert("❌ Error deleting flashcard.");
        }
    };

    if (flashcards.length === 0) {
        return (
            <div className="border rounded-lg p-6 text-center text-gray-500">
                No flashcards available.
            </div>
        );
    }

    return (
        <div className="space-y-4">

            {flashcards.map((card) => (

                <div
                    key={card.id}
                    className="border rounded-lg p-5 shadow"
                >
                    <h3 className="text-xl font-bold">
                        {card.question}
                    </h3>

                    <p className="mt-3">
                        <strong>Answer:</strong> {card.answer}
                    </p>

                    <p className="mt-2">
                        <strong>Subject:</strong> {card.subject}
                    </p>

                    <p className="mt-2">
                        <strong>Difficulty:</strong> {card.difficulty}
                    </p>
                    <div className="mt-4">
                        <button
                            onClick={() => handleDelete(card.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        >
                            🗑 Delete
                        </button>
                    </div>

                </div>

            ))}

        </div>
    );
}

export default FlashcardList;