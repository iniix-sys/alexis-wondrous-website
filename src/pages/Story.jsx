import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Story(){

    const { storySlug } = useParams();

    const [story, setStory] = useState(null);
    const [chapters, setChapters] = useState([]);


    useEffect(() => {

        async function loadStory(){

            const { data: storyData } = await supabase

                .from("stories")

                .select("*")

                .eq("slug", storySlug)

                .single();


            if(!storyData)
                return;


            setStory(storyData);


            const { data: chapterData } = await supabase

                .from("chapters")

                .select("*")

                .eq("story_id", storyData.id)

                .order(
                    "chapter_number",
                    { ascending: true }
                );


            setChapters(chapterData || []);

        }


        loadStory();

    }, [storySlug]);


    if(!story){

        return (

            <div className="glass">

                Loading...

            </div>

        );

    }


    return (

        <div className="story-page">

            <div className="glass">

                <h1>{story.title}</h1>

                <p>{story.description}</p>

                <br/>

                <h2>Contents</h2>

                <div className="chapter-list">

                    {chapters.map(chapter => (

                        <Link

                            key={chapter.id}

                            to={`/stories/${story.slug}/${chapter.slug}`}

                            className="chapter-button"

                        >

                            {chapter.title}

                        </Link>

                    ))}

                </div>

            </div>

        </div>

    );

}