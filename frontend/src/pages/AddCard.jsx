import FlashcardForm from "../components/flashcards/FlashcardForm";

function AddCard() {
    return (
        <div className="max-w-4xl mx-auto">

            <h1 className="text-4xl font-bold text-white mb-8">
                ➕ Add Flashcard
            </h1>

            <div className="bg-white rounded-2xl shadow-lg p-8">
                <FlashcardForm />
            </div>

        </div>
    );
}

export default AddCard;