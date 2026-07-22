import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Stories() {

    const [stories, setStories] = useState([]);


    useEffect(() => {

        async function loadStories() {

            const { data, error } = await supabase
                .from("stories")
                .select("*")
                .eq("published", true)
                .order("created_at", {
                    ascending: false
                });


            if(error){

                console.error(
                    "Error loading stories:",
                    error
                );

                return;

            }


            setStories(data || []);

        }


        loadStories();

    }, []);



    return (

        <div className="stories-page">


            <h1 className="stories-title">
                Short Stories
            </h1>


            <p className="stories-subtitle">
                A collection of my strange tales.
            </p>



            <div className="stories-grid">


                {
                    stories.map(story => (

                        <div
                            className="story-card glass"
                            key={story.id}
                        >


                            <div className="story-info">

                                <h2>
                                    {story.title}
                                </h2>



                                <p className="story-genre">
                                    {story.genre}
                                </p>



                                <p>
                                    {story.description}
                                </p>



                               <Link to={`/stories/${story.slug}`}>
                                    <button>
                                        Read Story
                                    </button>
                                </Link>

                            </div>



                            {
                                story.cover && (

                                    <img
                                        src={story.cover}
                                        alt={story.title}
                                        className="story-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />

                                )
                            }


                        </div>

                    ))
                }


            </div>


        </div>

    );

}