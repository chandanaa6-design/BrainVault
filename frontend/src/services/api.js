import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

// Fetch all flashcards
export const getFlashcards = () => {
    return api.get("/flashcards/");
};

// Create a flashcard
export const createFlashcard = (flashcard) => {
    return api.post("/flashcards/", flashcard);
};

// Delete a flashcard
export const deleteFlashcard = (id) => {
    return api.delete(`/flashcards/${id}`);
};
// Update a flashcard
export const updateFlashcard = (id, flashcard) => {
    return api.put(`/flashcards/${id}`, flashcard);
};
export default api;