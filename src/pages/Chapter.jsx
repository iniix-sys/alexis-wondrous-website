import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

import splitStory from "../utils/splitStory";

export default function Chapter() {

    const {
        storySlug,
        chapterSlug
    } = useParams();

    const [story, setStory] = useState(null);
    const [chapter, setChapter] = useState(null);
    const [chapters, setChapters] = useState([]);

    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {

        async function loadChapter() {

            // Load story
            const {
                data: storyData,
                error: storyError
            } = await supabase
                .from("stories")
                .select("*")
                .eq("slug", storySlug)
                .single();

            if (storyError) {

                console.error(storyError);
                return;

            }

            setStory(storyData);

            // Load every chapter
            const {
                data: chapterList,
                error: chapterError
            } = await supabase
                .from("chapters")
                .select("*")
                .eq("story_id", storyData.id)
                .order(
                    "chapter_number",
                    {
                        ascending: true
                    }
                );

            if (chapterError) {

                console.error(chapterError);
                return;

            }

            setChapters(chapterList);

            const current = chapterList.find(

                c => c.slug === chapterSlug

            );

            if (!current)
                return;

            setChapter(current);

            const splitPages = splitStory(
                current.markdown,
                900
            );

            setPages(splitPages);

            setCurrentPage(0);

            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

        }

        loadChapter();

    }, [storySlug, chapterSlug]);



    if (!chapter || !story) {

        return (

            <div className="glass">

                Loading chapter...

            </div>

        );

    }



    const index = chapters.findIndex(

        c => c.slug === chapter.slug

    );



    const previousChapter =

        index > 0

            ? chapters[index - 1]

            : null;



    const nextChapter =

        index < chapters.length - 1

            ? chapters[index + 1]

            : null;



    return (

        <div className="story-reader">

            <div className="glass story-box">

                <h1>

                    {chapter.title}

                </h1>

                <p className="story-page-number">

                    Page {currentPage + 1} of {pages.length}

                </p>

                <article className="story-content">

                    <ReactMarkdown
                        remarkPlugins={[
                            remarkBreaks
                        ]}
                    >

                        {pages[currentPage] || ""}

                    </ReactMarkdown>

                </article>



                {/* PAGE NAVIGATION */}

                <div className="page-navigation">

                    <button

                        disabled={
                            currentPage === 0
                        }

                        onClick={() => {

                            setCurrentPage(

                                currentPage - 1

                            );

                            window.scrollTo({

                                top: 0,

                                behavior: "smooth"

                            });

                        }}

                    >

                        ← Previous Page

                    </button>



                    <span>

                        {currentPage + 1} / {pages.length}

                    </span>



                    <button

                        disabled={
                            currentPage === pages.length - 1
                        }

                        onClick={() => {

                            setCurrentPage(

                                currentPage + 1

                            );

                            window.scrollTo({

                                top: 0,

                                behavior: "smooth"

                            });

                        }}

                    >

                        Next Page →

                    </button>

                </div>



                {/* CHAPTER NAVIGATION */}

                <div className="chapter-navigation">

                    <div>

                        {previousChapter && (

                            <Link

                                to={`/stories/${story.slug}/${previousChapter.slug}`}

                            >

                                ← {previousChapter.title}

                            </Link>

                        )}

                    </div>



                    <div>

                        <Link

                            to={`/stories/${story.slug}`}

                        >

                            Contents

                        </Link>

                    </div>



                    <div>

                        {nextChapter && (

                            <Link

                                to={`/stories/${story.slug}/${nextChapter.slug}`}

                            >

                                {nextChapter.title} →

                            </Link>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

}