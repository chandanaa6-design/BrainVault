function FlashcardForm() {
    return (
        <div>
            <h2>Create Flashcard</h2>

            <input
                type="text"
                placeholder="Question"
            />

            <br />
            <br />

            <textarea
                rows="5"
                placeholder="Answer"
            />

            <br />
            <br />

            <input
                type="text"
                placeholder="Subject"
            />

            <br />
            <br />

            <select>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
            </select>

            <br />
            <br />

            <button>
                Save Flashcard
            </button>
        </div>
    );
}

export default FlashcardForm;