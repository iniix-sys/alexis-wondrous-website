import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);



export default async function handler(req, res) {


    // GET DONATIONS
    if (req.method === "GET") {

        try {

            const { data, error } = await supabase
                .from("donations")
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
                donations: data || []
            });


        } catch (error) {

            console.error(error);

            return res.status(500).json({
                error: error.message
            });

        }

    }



    // ADD DONATION
    if (req.method === "POST") {

        try {

            const {
                name,
                amount,
                message,
                password
            } = req.body;



            if (password !== process.env.DONATIONS_ADMIN_KEY) {

                return res.status(403).json({
                    error: "Only the owner can add donations"
                });

            }



            const trimmedName = typeof name === "string" ? name.trim() : "";
            const numericAmount = Number(amount);

            if (!trimmedName) {

                return res.status(400).json({
                    error: "A donor name is required"
                });

            }

            if (!Number.isFinite(numericAmount) || numericAmount <= 0) {

                return res.status(400).json({
                    error: "A valid donation amount is required"
                });

            }



            const { data, error: insertError } = await supabase
                .from("donations")
                .insert([{
                    name: trimmedName,
                    amount: numericAmount,
                    message: typeof message === "string" ? message.trim() : ""
                }])
                .select();



            if (insertError) {

                console.error(insertError);

                return res.status(500).json({
                    error: insertError.message
                });

            }



            return res.status(200).json({
                donation: data?.[0] || null
            });



        } catch (error) {

            console.error(error);

            return res.status(500).json({
                error: error.message
            });

        }

    }



    return res.status(405).json({
        error: "Method not allowed"
    });

}
