import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);



export default async function handler(req, res) {


    // GET FAVORITES
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
                    error: error.message
                });
            }


            return res.status(200).json({
                favorites: data || []
            });


        } catch (error) {

            console.error(error);

            return res.status(500).json({
                error: error.message
            });

        }

    }



    // SAVE FAVORITES
    if (req.method === "POST") {

        try {

            const {
                tracks,
                password
            } = req.body;



            if (password !== process.env.FAVORITES_ADMIN_KEY) {

                return res.status(403).json({
                    error: "Only the owner can edit favorite songs"
                });

            }



            if (!Array.isArray(tracks)) {

                return res.status(400).json({
                    error: "Invalid favorites list"
                });

            }



            // Remove old favorites
            const { error: deleteError } = await supabase
                .from("favorites")
                .delete()
                .not("name", "is", null);



            if (deleteError) {

                console.error(deleteError);

                return res.status(500).json({
                    error: deleteError.message
                });

            }



            // Add new favorites
            if (tracks.length > 0) {

                const { error: insertError } = await supabase
                    .from("favorites")
                    .insert(tracks);



                if (insertError) {

                    console.error(insertError);

                    return res.status(500).json({
                        error: insertError.message
                    });

                }

            }



            return res.status(200).json({
                favorites: tracks
            });



        } catch(error) {

            console.error(error);

            return res.status(500).json({
                error:error.message
            });

        }

    }



    return res.status(405).json({
        error:"Method not allowed"
    });

}