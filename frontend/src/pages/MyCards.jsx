import { useEffect, useState } from "react";
import { getFlashcards, deleteFlashcard } from "../services/api";
import FlashcardForm from "../components/flashcards/FlashcardForm";
import { Search } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function Markdown({ text }) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code({ inline, className, children }) {
                    const match = /language-(\w+)/.exec(className || "");

                    return !inline && match ? (
                        <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                        >
                            {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                    ) : (
                        <code className="bg-gray-200 px-1 rounded">
                            {children}
                        </code>
                    );
                },
            }}
        >
            {text}
        </ReactMarkdown>
    );
}

function MyCards() {

    const [flashcards, setFlashcards] = useState([]);
    const [search, setSearch] = useState("");
    const [editingCard, setEditingCard] = useState(null);
    const [showAnswer, setShowAnswer] = useState({});

    useEffect(() => {
        loadFlashcards();
    }, []);

    const loadFlashcards = async () => {
        try {
            const response = await getFlashcards();

            console.log("API Response:", response.data);
            console.log("Number of cards:", response.data.length);

            setFlashcards(response.data.reverse());
        } catch (error) {
            console.error("Load Error:", error);
        }
    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this flashcard?")) return;

        try {
            await deleteFlashcard(id);
            await loadFlashcards();
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }

    };

    const toggleAnswer = (id) => {

        setShowAnswer(prev => ({
            ...prev,
            [id]: !prev[id],
        }));

    };

    const filteredCards = flashcards.filter((card) =>
        (card.subject || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        (card.tags || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        (card.question || "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (

        <div className="max-w-6xl mx-auto">

            <h1 className="text-4xl font-bold text-white mb-8">
                📚 My Flashcards
            </h1>

            {editingCard && (

                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

                    <h2 className="text-2xl font-bold mb-6">
                        ✏ Edit Flashcard
                    </h2>

                    <FlashcardForm
                        editingCard={editingCard}
                        setEditingCard={setEditingCard}
                        onFlashcardSaved={async () => {
                            await loadFlashcards();
                            setEditingCard(null);
                        }}
                    />

                </div>

            )}

            <div className="relative mb-8">

                <Search
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                />

                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by topic, tags or question..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-700 bg-gray-900 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                />

            </div>

            <div className="space-y-6"></div>
            {filteredCards.map((card) => (

                <div
                    key={card.id}
                    className="bg-white rounded-2xl shadow-lg p-6"
                >

                    <h2 className="text-2xl font-bold text-blue-600 mb-4">
                        {card.subject || "No Topic"}
                    </h2>

                    <h3 className="font-bold mb-2">
                        ❓ Question
                    </h3>

                    <Markdown text={card.question} />

                    {card.question_image && (
                        <img
                            src={`http://127.0.0.1:8000${card.question_image}`}
                            alt="Question"
                            className="mt-4 rounded-xl border shadow max-h-80"
                        />
                    )}

                    <div className="mt-5 mb-5">
                        <strong>🏷 Tags:</strong>{" "}
                        {card.tags || "-"}
                    </div>

                    {showAnswer[card.id] && (

                        <div className="bg-blue-50 rounded-xl p-5">

                            <h3 className="font-bold text-blue-700 mb-3">
                                💡 Answer
                            </h3>

                            <Markdown text={card.answer} />

                            {card.answer_image && (
                                <img
                                    src={`http://127.0.0.1:8000${card.answer_image}`}
                                    alt="Answer"
                                    className="mt-4 rounded-xl border shadow max-h-80"
                                />
                            )}

                        </div>

                    )}

                    <div className="flex flex-wrap gap-3 mt-6">

                        <button
                            onClick={() => setEditingCard(card)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                        >
                            ✏ Edit
                        </button>

                        <button
                            onClick={() => handleDelete(card.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        >
                            🗑 Delete
                        </button>

                        <button
                            onClick={() => toggleAnswer(card.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                            {showAnswer[card.id]
                                ? "🙈 Hide Answer"
                                : "👁 Show Answer"}
                        </button>

                    </div>

                </div>

            ))}

            {filteredCards.length === 0 && (

                <div className="bg-white rounded-xl p-8 text-center text-gray-500">

                    No flashcards found.

                </div>

            )}

        </div>



    );

}

export default MyCards;