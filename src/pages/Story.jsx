import {
    useEffect,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";

import {
    supabase
} from "../lib/supabase";

import ReactMarkdown from "react-markdown";

import remarkBreaks from "remark-breaks";

import splitStory from "../utils/splitStory";



export default function Story(){


    const {
        slug
    } = useParams();



    const [story,setStory] = useState(null);

    const [pages,setPages] = useState([]);

    const [page,setPage] = useState(0);



    useEffect(()=>{


        async function loadStory(){


            const {
                data,
                error
            } = await supabase

                .from("stories")

                .select("*")

                .eq(
                    "slug",
                    slug
                )

                .single();



            if(error){

                console.error(
                    "Story error:",
                    error
                );

                return;

            }



            console.log(
                "Loaded story:",
                data
            );



            setStory(data);



            setPages(

                splitStory(
                    data.markdown,
                    900
                )

            );


        }



        if(slug){

            loadStory();

        }


    },[slug]);




    if(!story){

        return (

            <div className="glass">

                Loading story...

            </div>

        );

    }




    return (

        <div className="story-reader">


            <div className="glass story-box">


                <h1>

                    {story.title}

                </h1>



                <p className="story-page-number">

                    PAGE {page + 1}
                    {" / "}
                    {pages.length}

                </p>




                <article className="story-content">


                    <ReactMarkdown

                        remarkPlugins={[
                            remarkBreaks
                        ]}

                    >

                        {pages[page]}

                    </ReactMarkdown>


                </article>





                <div className="story-controls">


                    <button

                        disabled={
                            page === 0
                        }

                        onClick={()=>{

                            setPage(
                                page - 1
                            );

                            window.scrollTo(
                                0,
                                0
                            );

                        }}

                    >

                        ← Previous

                    </button>





                    <button

                        disabled={
                            page === pages.length - 1
                        }

                        onClick={()=>{

                            setPage(
                                page + 1
                            );

                            window.scrollTo(
                                0,
                                0
                            );

                        }}

                    >

                        Next →

                    </button>


                </div>


            </div>


        </div>

    );

}