import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);



export default async function handler(req, res) {


    if (req.method === "GET") {

        try {

            const { data, error } = await supabase
                .from("favorites")
                .select("*")
                .order("created_at", {
                    ascending: false
                });


            if (error) {
                console.error(error);

                return res.status(500).json({
                    error: "Unable to load favorites"
                });
            }


            return res.status(200).json({
                favorites: data
            });


        } catch (error) {

            console.error(error);

            return res.status(500).json({
                error: "Unable to load favorites"
            });

        }

    }



    if (req.method === "POST") {

        try {

            const {
                tracks,
                password
            } = req.body;



            if (!password || password !== process.env.FAVORITES_ADMIN_KEY) {

                return res.status(403).json({
                    error: "Only the owner can edit favorite songs"
                });

            }



            const { error: deleteError } = await supabase
                .from("favorites")
                .delete()
                .neq("id", 0);



            if (deleteError) {

                console.error(deleteError);

                return res.status(500).json({
                    error: "Unable to clear favorites"
                });

            }



            if (Array.isArray(tracks) && tracks.length > 0) {


                const { data, error } = await supabase
                    .from("favorites")
                    .insert(tracks)
                    .select();



                if (error) {

                    console.error(error);

                    return res.status(500).json({
                        error: "Unable to save favorites"
                    });

                }



                return res.status(200).json({
                    favorites: data
                });


            }



            return res.status(200).json({
                favorites: []
            });



        } catch (error) {

            console.error(error);

            return res.status(500).json({
                error: "Unable to save favorites"
            });

        }

    }



    return res.status(405).json({
        error: "Method not allowed"
    });

}