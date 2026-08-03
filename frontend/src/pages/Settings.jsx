import { useState } from "react";
import {
    exportBackup,
    importBackup,
} from "../services/api";

function Settings() {

    const [backupFile, setBackupFile] = useState(null);

    const handleExport = async () => {

        try {

            const response = await exportBackup();

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");

            link.href = url;
            link.download = "brainvault_backup.json";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.error(err);
            alert("Backup failed.");

        }

    };

    const handleImport = async () => {

        if (!backupFile) {
            alert("Please choose a backup file.");
            return;
        }

        try {

            const response = await importBackup(backupFile);

            alert(
                `✅ Imported: ${response.data.imported}\n` +
                `⏭ Skipped: ${response.data.skipped}`
            );

        } catch (err) {

            console.error(err);
            alert("Import failed.");

        }

    };

    return (

        <div className="max-w-4xl mx-auto">

            <h1 className="text-4xl font-bold text-white mb-8">
                ⚙️ Settings
            </h1>

            <div className="bg-white rounded-2xl shadow-lg p-8">

                <h2 className="text-2xl font-bold mb-6">
                    💾 Data Management
                </h2>

                <div className="flex flex-col gap-4">

                    <button
                        onClick={handleExport}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-fit"
                    >
                        📥 Export Backup
                    </button>

                    <input
                        type="file"
                        accept=".json"
                        onChange={(e) =>
                            setBackupFile(e.target.files[0])
                        }
                    />

                    <button
                        onClick={handleImport}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg w-fit"
                    >
                        📤 Import Backup
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Settings;