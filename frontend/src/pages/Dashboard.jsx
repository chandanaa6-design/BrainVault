import { useEffect, useState } from "react";
import {
    getDashboardStats,
    getFlashcards,
} from "../services/api";

function Dashboard() {

    const [stats, setStats] = useState({
        total_cards: 0,
        total_topics: 0,
        due_today: 0,
        mastered: 0,
        learning: 0,
        difficult: 0,
    });

    const [recentCards, setRecentCards] = useState([]);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            const [statsRes, cardsRes] = await Promise.all([
                getDashboardStats(),
                getFlashcards(),
            ]);

            setStats(statsRes.data);

            setRecentCards(
                [...cardsRes.data]
                    .reverse()
                    .slice(0, 5)
            );

        } catch (err) {
            console.error(err);
        }

    };

    const total =
        stats.total_cards || 1;

    const masteredPercent =
        Math.round((stats.mastered / total) * 100);

    const learningPercent =
        Math.round((stats.learning / total) * 100);

    const difficultPercent =
        Math.round((stats.difficult / total) * 100);

    return (

        <div className="max-w-7xl mx-auto">

            <h1 className="text-4xl font-bold text-white mb-8">
                📊 BrainVault Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <DashboardCard
                    title="📚 Total Cards"
                    value={stats.total_cards}
                    color="text-blue-600"
                />

                <DashboardCard
                    title="📂 Topics"
                    value={stats.total_topics}
                    color="text-green-600"
                />

                <DashboardCard
                    title="📅 Due Today"
                    value={stats.due_today}
                    color="text-orange-500"
                />

                <DashboardCard
                    title="🏆 Mastered"
                    value={stats.mastered}
                    color="text-purple-600"
                />

            </div>

            <div className="grid lg:grid-cols-2 gap-6 mt-8">

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <h2 className="text-2xl font-bold mb-6">
                        📝 Recently Added
                    </h2>

                    {recentCards.length === 0 ? (

                        <p className="text-gray-500">
                            No flashcards yet.
                        </p>

                    ) : (

                        <div className="space-y-4">

                            {recentCards.map(card => (

                                <div
                                    key={card.id}
                                    className="border rounded-xl p-4"
                                >

                                    <p className="font-semibold text-blue-600">
                                        {card.subject || "No Topic"}
                                    </p>

                                    <p className="mt-2">
                                        {card.question}
                                    </p>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <h2 className="text-2xl font-bold mb-6">
                        📈 Learning Progress
                    </h2>

                    <ProgressBar
                        label="🏆 Mastered"
                        value={stats.mastered}
                        percent={masteredPercent}
                        color="bg-green-600"
                    />

                    <ProgressBar
                        label="📘 Learning"
                        value={stats.learning}
                        percent={learningPercent}
                        color="bg-blue-600"
                    />

                    <ProgressBar
                        label="⚠ Difficult"
                        value={stats.difficult}
                        percent={difficultPercent}
                        color="bg-red-500"
                    />

                </div>

            </div>

        </div>

    );

}

function DashboardCard({
    title,
    value,
    color,
}) {

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6">

            <p className="text-gray-500">
                {title}
            </p>

            <h2 className={`text-4xl font-bold mt-3 ${color}`}>
                {value}
            </h2>

        </div>

    );

}

function ProgressBar({
    label,
    value,
    percent,
    color,
}) {

    return (

        <div className="mb-6">

            <div className="flex justify-between mb-2">

                <span>{label}</span>

                <span>
                    {value} ({percent}%)
                </span>

            </div>

            <div className="bg-gray-200 h-3 rounded-full">

                <div
                    className={`${color} h-3 rounded-full`}
                    style={{
                        width: `${percent}%`,
                    }}
                />

            </div>

        </div>

    );

}

export default Dashboard;