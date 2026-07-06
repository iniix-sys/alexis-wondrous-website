import axios from "axios";

export default async function handler(req, res) {

    const { code } = req.body;

    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
    const REDIRECT_URI = "https://https://alexis-wondrous-website.vercel.app/callback";

    try {

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

        const { access_token, refresh_token } = response.data;

        res.json({
            access_token,
            refresh_token
        });

    } catch (err) {
        res.status(500).json({ error: "token exchange failed" });
    }
}