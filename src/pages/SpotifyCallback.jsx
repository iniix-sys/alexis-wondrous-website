import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function SpotifyCallback() {

    const [params] = useSearchParams();

    useEffect(() => {

        const code = params.get("code");

        if (!code) return;

        // send to backend for token exchange
        fetch("https://yourdomain.com/api/spotify/exchange", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ code })
        })
        .then(res => res.json())
        .then(data => {
            console.log("TOKEN DATA:", data);
        });

    }, []);

    return (
        <div className="loader">
            <div className="loader-box">
                <h2>Connecting Spotify...</h2>
            </div>
        </div>
    );
}