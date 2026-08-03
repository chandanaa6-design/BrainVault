import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
    getFlashcards,
    reviewFlashcard,
} from "../services/api";

function Review() {

    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState("All");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadFlashcards();
    }, []);

    const loadFlashcards = async () => {
        try {
            const response = await getFlashcards();
            setFlashcards(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const topics = useMemo(() => {
        const list = flashcards
            .map(card => card.subject)
            .filter(t => t && t.trim() !== "");

        return ["All", ...new Set(list)];
    }, [flashcards]);

    const filteredCards = useMemo(() => {
        if (selectedTopic === "All") return flashcards;

        return flashcards.filter(
            card => card.subject === selectedTopic
        );
    }, [flashcards, selectedTopic]);

    useEffect(() => {
        setCurrentIndex(0);
        setShowAnswer(false);
    }, [selectedTopic]);

    useEffect(() => {
        if (!filteredCards.length) {
            setCurrentIndex(0);
            return;
        }

        if (currentIndex >= filteredCards.length) {
            setCurrentIndex(0);
        }

    }, [filteredCards, currentIndex]);

    const currentCard =
        filteredCards.length > 0
            ? filteredCards[currentIndex]
            : null;

    const nextCard = () => {

        if (!filteredCards.length) return;

        setCurrentIndex(prev =>
            (prev + 1) % filteredCards.length
        );

        setShowAnswer(false);
    };

    const previousCard = () => {

        if (!filteredCards.length) return;

        setCurrentIndex(prev =>
            prev === 0
                ? filteredCards.length - 1
                : prev - 1
        );

        setShowAnswer(false);
    };

    const shuffleCards = () => {

        const shuffled =
            [...flashcards].sort(() => Math.random() - 0.5);

        setFlashcards(shuffled);
        setCurrentIndex(0);
        setShowAnswer(false);

    };

    const handleReview = async (rating) => {

        if (!currentCard) return;

        try {

            setLoading(true);

            const response =
                await reviewFlashcard(currentCard.id, rating);

            const updated = response.data;

            setFlashcards(cards =>
                cards.map(card =>
                    card.id === updated.id
                        ? updated
                        : card
                )
            );

            nextCard();

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };
    useEffect(() => {

        const handleKeyDown = (e) => {

            if (!currentCard) return;

            switch (e.key) {

                case "ArrowRight":
                    e.preventDefault();
                    nextCard();
                    break;

                case "ArrowLeft":
                    e.preventDefault();
                    previousCard();
                    break;

                case " ":
                    e.preventDefault();
                    setShowAnswer(prev => !prev);
                    break;

                case "r":
                case "R":
                    e.preventDefault();
                    shuffleCards();
                    break;

                case "Escape":
                    e.preventDefault();
                    setShowAnswer(false);
                    break;

                default:
                    break;

            }

        };

        window.addEventListener("keydown", handleKeyDown);

        return () =>
            window.removeEventListener("keydown", handleKeyDown);

    }, [currentCard, filteredCards]);
    const Preview = ({ text, type }) => {
        if (type === "diagram") {
            return (
                <pre className="bg-gray-100 border rounded-lg p-4 whitespace-pre overflow-auto font-mono text-sm">
                    {text}
                </pre>
            );
        }

        if (type === "code") {
            return (
                <SyntaxHighlighter
                    style={oneDark}
                    language="text"
                    PreTag="div"
                >
                    {text}
                </SyntaxHighlighter>
            );
        }

        return (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {text}
            </ReactMarkdown>
        );
    };

    return (
        <div className="max-w-5xl mx-auto">

            <h1 className="text-4xl font-bold text-white mb-8">
                🧠 Review Flashcards
            </h1>

            <div className="flex flex-wrap gap-4 items-end mb-8">

                <div>

                    <label className="block text-white font-semibold mb-2">
                        📂 Topic Filter
                    </label>

                    <select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="bg-white text-black rounded-lg border-2 border-blue-500 px-4 py-3 min-w-[220px]"
                    >
                        {topics.map((topic) => (
                            <option key={topic} value={topic}>
                                {topic === "All" ? "All Topics" : topic}
                            </option>
                        ))}
                    </select>

                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        shuffleCards();
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
                >
                    🔀 Shuffle
                </button>

            </div>

            {!currentCard ? (

                <div className="bg-white rounded-2xl p-10 text-center">

                    <h2 className="text-2xl font-bold">
                        No flashcards available.
                    </h2>

                </div>

            ) : (

                <>

                    <div className="bg-blue-600 inline-block text-white px-5 py-2 rounded-full font-semibold mb-5">
                        📄 Card {currentIndex + 1} / {filteredCards.length}
                    </div>

                    <div
                        className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transition hover:shadow-2xl"
                        onClick={() => setShowAnswer(prev => !prev)}
                    >

                        <div className="grid md:grid-cols-2 gap-6 mb-8">

                            <div>
                                <p className="text-blue-600 font-bold">
                                    📌 Topic
                                </p>
                                <p>{currentCard.subject || "-"}</p>
                            </div>

                            <div>
                                <p className="text-blue-600 font-bold">
                                    🏷 Tags
                                </p>
                                <p>{currentCard.tags || "-"}</p>
                            </div>

                        </div>

                        {!showAnswer ? (

                            <>
                                <p className="font-bold mb-2">
                                    ❓ Question
                                </p>

                                <div className="mb-6">
                                    <Preview
                                        text={currentCard.question}
                                        type={currentCard.question_type}
                                    />
                                </div>

                                {currentCard.question_image && (
                                    <img
                                        src={`http://127.0.0.1:8000${currentCard.question_image}`}
                                        alt="Question"
                                        className="rounded-xl border max-h-80 mb-6"
                                    />
                                )}

                                <p className="text-center text-blue-600 font-semibold">
                                    👆 Click anywhere to reveal the answer
                                </p>
                            </>

                        ) : (

                            <>
                                <p className="font-bold mb-2">
                                    💡 Answer
                                </p>

                                <div className="mb-6">
                                    <Preview
                                        text={currentCard.answer}
                                        type={currentCard.answer_type}
                                    />
                                </div>

                                {currentCard.answer_image && (
                                    <img
                                        src={`http://127.0.0.1:8000${currentCard.answer_image}`}
                                        alt="Answer"
                                        className="rounded-xl border max-h-80 mb-8"
                                    />
                                )}

                                <div
                                    className="grid md:grid-cols-3 gap-4"
                                    onClick={(e) => e.stopPropagation()}
                                >

                                    <button
                                        disabled={loading}
                                        onClick={() => handleReview("again")}
                                        className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold"
                                    >
                                        🔴 Again
                                    </button>

                                    <button
                                        disabled={loading}
                                        onClick={() => handleReview("hard")}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-bold"
                                    >
                                        🟡 Hard
                                    </button>

                                    <button
                                        disabled={loading}
                                        onClick={() => handleReview("easy")}
                                        className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold"
                                    >
                                        🟢 Easy
                                    </button>

                                </div>

                            </>

                        )}

                    </div>

                    <div className="flex justify-between mt-8">

                        <button
                            onClick={previousCard}
                            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg"
                        >
                            ⬅ Previous
                        </button>

                        <button
                            onClick={nextCard}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                        >
                            Next ➡
                        </button>

                    </div>

                </>

            )}

        </div>
    );
}

export default Review;