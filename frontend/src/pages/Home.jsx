function Home() {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-xl">
                <h1 className="text-4xl font-bold text-center text-blue-600">
                    🧠 BrainVault
                </h1>

                <p className="text-center text-gray-600 mt-3">
                    Tailwind CSS is working 🎉
                </p>

                <button className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                    Continue Building
                </button>
            </div>
        </div>
    );
}

export default Home;