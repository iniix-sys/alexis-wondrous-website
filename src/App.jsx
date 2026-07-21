import { lazy, Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Loader from "./components/Loader";

const Chapter = lazy(() => import("./pages/Chapter"));
const Home = lazy(() => import("./pages/Home"));
const Blog = lazy(() => import("./pages/Blog"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Guestbook = lazy(() => import("./pages/Guestbook"));
const Stories = lazy(() => import("./pages/Stories"));
const Story = lazy(() => import("./pages/Story"));
const Music = lazy(() => import("./pages/Music"));
const Links = lazy(() => import("./pages/Links"));

const HAS_BOOTED_KEY = "alexis-has-booted";

export default function App() {

    const [loading, setLoading] = useState(
        () => window.sessionStorage.getItem(HAS_BOOTED_KEY) !== "true"
    );

    if (loading) {
        return (
            <Loader
                onFinish={() => {
                    window.sessionStorage.setItem(HAS_BOOTED_KEY, "true");
                    setLoading(false);
                }}
            />
        );
    }


    return (
        <div className="app-layout">

            <Navbar />

            <div className="main-layout">

                <Sidebar />

                <main className="page-area">

                    <Suspense fallback={<div className="glass">Loading...</div>}>

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

                    </Suspense>

                </main>

            </div>

        </div>
    );
}