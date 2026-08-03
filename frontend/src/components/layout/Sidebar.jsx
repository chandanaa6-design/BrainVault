import { NavLink } from "react-router-dom";

function Sidebar() {

    const menuClass = ({ isActive }) =>
        `block w-full rounded-xl px-5 py-4 text-lg font-medium transition ${isActive
            ? "bg-blue-600 text-white"
            : "bg-white text-black hover:bg-gray-200"
        }`;

    return (

        <aside className="w-72 bg-slate-800 min-h-screen p-6">

            <h1 className="text-3xl font-bold text-white text-center mb-10">
                🧠 BrainVault
            </h1>

            <nav className="space-y-4">

                <NavLink
                    to="/"
                    end
                    className={menuClass}
                >
                    🏠 Dashboard
                </NavLink>

                <NavLink
                    to="/add-card"
                    className={menuClass}
                >
                    ➕ Add Card
                </NavLink>

                <NavLink
                    to="/my-cards"
                    className={menuClass}
                >
                    📚 My Cards
                </NavLink>

                <NavLink
                    to="/review"
                    className={menuClass}
                >
                    🧠 Review
                </NavLink>

                <NavLink
                    to="/settings"
                    className={menuClass}
                >
                    ⚙️ Settings
                </NavLink>

            </nav>

        </aside>

    );

}

export default Sidebar;