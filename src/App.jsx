import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Gallery from "./pages/Gallery";
import Guestbook from "./pages/Guestbook";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export default function App() {

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="app-layout">

            <Navbar />

            <div className="main-layout">

                <Sidebar
                    open={sidebarOpen}
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

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