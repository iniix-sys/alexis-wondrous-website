import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Guestbook from "./pages/Guestbook";
import Gallery from "./pages/Gallery";

export default function App() {

    const [loading, setLoading] = useState(true);

    if (loading) {
        return <Loader onFinish={() => setLoading(false)} />;
    }

    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/guestbook" element={<Guestbook />} />
                <Route path="/gallery" element={<Gallery />} />
            </Routes>

            <Footer />
        </>
    );
}