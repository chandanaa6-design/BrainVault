import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

// ===========================
// Flashcards
// ===========================

export const getFlashcards = () => {
    return api.get("/flashcards/");
};

export const createFlashcard = (flashcard) => {
    return api.post("/flashcards/", flashcard);
};

export const updateFlashcard = (id, flashcard) => {
    return api.put(`/flashcards/${id}`, flashcard);
};

export const deleteFlashcard = (id) => {
    return api.delete(`/flashcards/${id}`);
};

// ===========================
// Image Upload
// ===========================

export const uploadImage = (file) => {

    const formData = new FormData();

    formData.append("file", file);

    return api.post(
        "/flashcards/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

// ===========================
// Review
// ===========================

export const reviewFlashcard = (id, rating) => {
    return api.post(`/flashcards/${id}/review/${rating}`);
};

// ===========================
// Dashboard
// ===========================

export const getDashboardStats = () => {
    return api.get("/flashcards/dashboard/stats");
};

// ===========================
// Backup
// ===========================

export const exportBackup = () => {
    return api.get("/flashcards/export", {
        responseType: "blob",
    });
};



// ===========================
// Import Backup
// ===========================

export const importBackup = (file) => {

    const formData = new FormData();

    formData.append("file", file);

    return api.post(
        "/flashcards/import",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

};

export default api;