import { useEffect, useState } from "react";

import FlashcardForm from "../components/flashcards/FlashcardForm";
import FlashcardList from "../components/flashcards/FlashcardList";

import { getFlashcards } from "../services/api";

function Home() {

    const [flashcards, setFlashcards] = useState([]);
    const [editingCard, setEditingCard] = useState(null);

    // NEW
    const [searchTerm, setSearchTerm] = useState("");

    const loadFlashcards = async () => {
        try {
            const response = await getFlashcards();
            setFlashcards(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadFlashcards();
    }, []);

    // NEW
    const filteredFlashcards = flashcards.filter((card) => {
        const search = searchTerm.toLowerCase();

        return (
            card.question.toLowerCase().includes(search) ||
            card.answer.toLowerCase().includes(search) ||
            card.subject.toLowerCase().includes(search)
        );
    });

    return (
        <div className="min-h-screen bg-slate-900 py-10">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">

                <h1 className="text-4xl font-bold text-center text-blue-600">
                    🧠 BrainVault
                </h1>

                <p className="text-center text-gray-600 mt-2">
                    Smart Flashcard Learning System
                </p>

                <div className="mt-10">
                    <h2 className="text-2xl font-semibold mb-4">
                        Create Flashcard
                    </h2>

                    <FlashcardForm
                        editingCard={editingCard}
                        setEditingCard={setEditingCard}
                        onFlashcardSaved={loadFlashcards}
                    />
                </div>

                <hr className="my-10" />

                <div>

                    <h2 className="text-2xl font-semibold mb-4">
                        Flashcards
                    </h2>

                    {/* Search Box */}
                    <input
                        type="text"
                        placeholder="🔍 Search by question, answer or subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border rounded-lg p-3 mb-6"
                    />

                    <FlashcardList
                        flashcards={filteredFlashcards}
                        onFlashcardDeleted={loadFlashcards}
                        setEditingCard={setEditingCard}
                    />

                </div>

            </div>
        </div>
    );
}

export default Home;