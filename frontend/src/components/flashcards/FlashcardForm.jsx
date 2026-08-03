import { useEffect, useState } from "react";
import {
    createFlashcard,
    updateFlashcard,
    uploadImage,
} from "../../services/api";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function FlashcardForm({
    editingCard = null,
    setEditingCard = () => { },
    onFlashcardSaved = async () => { },
}) {

    const [topic, setTopic] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [questionType, setQuestionType] = useState("markdown");
    const [answerType, setAnswerType] = useState("markdown");
    const [tags, setTags] = useState("");

    const [questionImage, setQuestionImage] = useState("");
    const [answerImage, setAnswerImage] = useState("");

    const [uploadingQuestion, setUploadingQuestion] = useState(false);
    const [uploadingAnswer, setUploadingAnswer] = useState(false);

    useEffect(() => {

        if (editingCard) {

            setTopic(editingCard.subject || "");
            setQuestion(editingCard.question || "");
            setAnswer(editingCard.answer || "");
            setQuestionType(editingCard.question_type || "markdown");
            setAnswerType(editingCard.answer_type || "markdown");
            setTags(editingCard.tags || "");

            setQuestionImage(editingCard.question_image || "");
            setAnswerImage(editingCard.answer_image || "");

        }

    }, [editingCard]);

    const clearForm = () => {

        setTopic("");
        setQuestion("");
        setAnswer("");
        setQuestionType("markdown");
        setAnswerType("markdown");
        setTags("");

        setQuestionImage("");
        setAnswerImage("");

        setEditingCard(null);

    };

    const handleQuestionImage = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setUploadingQuestion(true);

        try {

            const res = await uploadImage(file);

            setQuestionImage(res.data.url);

        } catch (err) {

            console.error(err);
            alert("Question image upload failed.");

        }

        setUploadingQuestion(false);

    };

    const handleAnswerImage = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setUploadingAnswer(true);

        try {

            const res = await uploadImage(file);

            setAnswerImage(res.data.url);

        } catch (err) {

            console.error(err);
            alert("Answer image upload failed.");

        }

        setUploadingAnswer(false);

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const flashcard = {

            subject: topic,
            question,
            answer,

            question_type: questionType,
            answer_type: answerType,

            tags,

            question_image: questionImage,
            answer_image: answerImage,

        };

        try {

            if (editingCard) {

                await updateFlashcard(
                    editingCard.id,
                    flashcard
                );

                alert("✅ Flashcard Updated!");

            } else {

                await createFlashcard(flashcard);

                alert("✅ Flashcard Saved!");

            }

            await onFlashcardSaved();

            clearForm();

        } catch (error) {

            console.error(error);

            if (error.response) {
                alert(JSON.stringify(error.response.data));
            } else {
                alert(error.message);
            }

        }

    };

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
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Topic */}

            <div>
                <label className="block mb-2 font-semibold">
                    Topic
                </label>

                <input
                    className="w-full border rounded-lg p-3"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Operating System"
                />
            </div>

            {/* Question */}

            <div>

                <div className="flex justify-between items-center mb-2">

                    <label className="font-semibold">
                        Question
                    </label>

                    <select
                        value={questionType}
                        onChange={(e) => setQuestionType(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="markdown">Markdown</option>
                        <option value="diagram">Diagram</option>
                        <option value="code">Code</option>
                    </select>

                </div>

                <div className="grid md:grid-cols-2 gap-6">

                    <textarea
                        rows={10}
                        className="border rounded-lg p-3 font-mono"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                    />

                    <div className="border rounded-lg p-4 bg-white overflow-auto">

                        <h3 className="font-bold mb-3">
                            Preview
                        </h3>

                        <Preview text={question} type={questionType}
                        />

                    </div>

                </div>

            </div>

            {/* Question Image */}

            <div>

                <label className="block mb-2 font-semibold">
                    Question Image
                </label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleQuestionImage}
                />

                {uploadingQuestion && (
                    <p className="text-blue-600 mt-2">
                        Uploading...
                    </p>
                )}

                {questionImage && (
                    <img
                        src={`http://127.0.0.1:8000${questionImage}`}
                        alt="Question"
                        className="mt-4 rounded-lg max-h-56 border"
                    />
                )}

            </div>

            {/* Answer */}

            <div>

                <div className="flex justify-between items-center mb-2">

                    <label className="font-semibold">
                        Answer
                    </label>

                    <select
                        value={answerType}
                        onChange={(e) => setAnswerType(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="markdown">Markdown</option>
                        <option value="diagram">Diagram</option>
                        <option value="code">Code</option>
                    </select>

                </div>

                <div className="grid md:grid-cols-2 gap-6">

                    <textarea
                        rows={12}
                        className="border rounded-lg p-3 font-mono"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        required
                    />

                    <div className="border rounded-lg p-4 bg-white overflow-auto">

                        <h3 className="font-bold mb-3">
                            Preview
                        </h3>

                        <Preview text={answer} type={answerType}
                        />

                    </div>

                </div>

            </div>

            {/* Answer Image */}

            <div>

                <label className="block mb-2 font-semibold">
                    Answer Image
                </label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleAnswerImage}
                />

                {uploadingAnswer && (
                    <p className="text-blue-600 mt-2">
                        Uploading...
                    </p>
                )}

                {answerImage && (
                    <img
                        src={`http://127.0.0.1:8000${answerImage}`}
                        alt="Answer"
                        className="mt-4 rounded-lg max-h-56 border"
                    />
                )}

            </div>

            {/* Tags */}

            <div>

                <label className="block mb-2 font-semibold">
                    Tags
                </label>

                <input
                    className="w-full border rounded-lg p-3"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="OS, Memory, Linux"
                />

            </div>

            {/* Buttons */}

            <div className="flex gap-4">

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                >
                    {editingCard ? "Update Card" : "Save Card"}
                </button>

                <button
                    type="button"
                    onClick={clearForm}
                    className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-lg"
                >
                    Clear
                </button>

            </div>

        </form>
    );
}

export default FlashcardForm;