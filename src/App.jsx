import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Chapter from "./pages/Chapter";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Gallery from "./pages/Gallery";
import Guestbook from "./pages/Guestbook";
import Stories from "./pages/Stories";
import Story from "./pages/Story";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Loader from "./components/Loader";
import Music from "./pages/Music";
import Links from "./pages/Links"
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
                        <Route path="/music" element={<Music />} />
                        <Route path="/sites" element={<Links />} />
                        <Route path="/stories" element={<Stories />} />
                        <Route path="/stories/:storySlug" element={<Story />} />

                        <Route
                            path="/stories/:storySlug/:chapterSlug"
                            element={<Chapter />}
                        />

                    </Routes>

                </main>

            </div>

        </div>
    );
}