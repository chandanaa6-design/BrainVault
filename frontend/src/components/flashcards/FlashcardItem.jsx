import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function FlashcardItem({ card }) {
    const [showAnswer, setShowAnswer] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-2xl font-bold text-blue-600 mb-4">
                {card.subject || "No Topic"}
            </h2>

            {/* Question */}

            <div className="mb-6">

                <h3 className="font-bold mb-2">
                    ❓ Question
                </h3>

                <Markdown text={card.question} />

                {card.question_image && (
                    <img
                        src={`http://127.0.0.1:8000${card.question_image}`}
                        alt="Question"
                        className="mt-4 rounded-lg border max-h-72"
                    />
                )}

            </div>

            {/* Answer */}

            {showAnswer && (
                <div className="mb-6">

                    <h3 className="font-bold mb-2">
                        💡 Answer
                    </h3>

                    <Markdown text={card.answer} />

                    {card.answer_image && (
                        <img
                            src={`http://127.0.0.1:8000${card.answer_image}`}
                            alt="Answer"
                            className="mt-4 rounded-lg border max-h-72"
                        />
                    )}

                </div>
            )}

            {/* Tags */}

            {card.tags && (
                <div className="mt-4 text-sm text-gray-500">
                    🏷 <strong>Tags:</strong> {card.tags}
                </div>
            )}

            {/* Buttons */}

            <div className="mt-6">

                <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    {showAnswer ? "Hide Answer" : "Show Answer"}
                </button>

            </div>

        </div>
    );
}

function Markdown({ text }) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code({ inline, className, children, ...props }) {

                    const match = /language-(\w+)/.exec(className || "");

                    return !inline && match ? (
                        <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
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

export default FlashcardItem;