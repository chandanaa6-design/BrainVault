import { useEffect, useState } from "react";

import FlashcardForm from "../components/flashcards/FlashcardForm";
import FlashcardList from "../components/flashcards/FlashcardList";

import { getFlashcards } from "../services/api";

function Home() {

    const [flashcards, setFlashcards] = useState([]);
    const [editingCard, setEditingCard] = useState(null);

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

                    <FlashcardList
                        flashcards={flashcards}
                        onFlashcardDeleted={loadFlashcards}
                        setEditingCard={setEditingCard}
                    />

                </div>

            </div>
        </div>
    );
}

export default Home;