import { HashRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Dashboard from "./pages/Dashboard";
import AddCard from "./pages/AddCard";
import MyCards from "./pages/MyCards";
import Review from "./pages/Review";
import Settings from "./pages/Settings";

function App() {

  return (

    <HashRouter>

      <Routes>

        <Route
          path="/"
          element={<Layout />}
        >

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="add-card"
            element={<AddCard />}
          />

          <Route
            path="my-cards"
            element={<MyCards />}
          />

          <Route
            path="review"
            element={<Review />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />

        </Route>

      </Routes>

    </HashRouter>

  );

}

export default App;