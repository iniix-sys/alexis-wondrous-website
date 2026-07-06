import axios from "axios";

export default async function handler(req, res) {
    try {
        console.log("BODY:", req.body);

        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: "Missing code" });
        }

        const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
        const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
        const REDIRECT_URI = "https://yourdomain.com/callback";

        console.log("ENV CHECK:", {
            CLIENT_ID: !!CLIENT_ID,
            CLIENT_SECRET: !!CLIENT_SECRET,
            REDIRECT_URI
        });

        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: REDIRECT_URI
            }),
            {
                headers: {
                    Authorization:
                        "Basic " +
                        Buffer.from(
                            CLIENT_ID + ":" + CLIENT_SECRET
                        ).toString("base64"),
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                }
            }
        );

        return res.json(response.data);

    } catch (err) {
        console.log("SPOTIFY ERROR:", err.response?.data || err.message);

        return res.status(500).json({
            error: "Spotify exchange failed",
            details: err.response?.data || err.message
        });
    }
}