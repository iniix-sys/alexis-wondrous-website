import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Gallery from "./pages/Gallery";
import Guestbook from "./pages/Guestbook";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Loader from "./components/Loader";


export default function App() {

    const [loading, setLoading] = useState(true);


    if (loading) {
        return (
            <Loader
                onFinish={() => setLoading(false)}
            />
        );
    }


    return (
        <div className="app-layout">

            <Navbar />

            <div className="main-layout">

                <Sidebar />

                <main className="page-area">

                    <Routes>

                        <Route path="/" element={<Home />} />

                        <Route path="/blog" element={<Blog />} />

                        <Route path="/gallery" element={<Gallery />} />

                        <Route path="/guestbook" element={<Guestbook />} />

                    </Routes>

                </main>

            </div>

        </div>
    );
}