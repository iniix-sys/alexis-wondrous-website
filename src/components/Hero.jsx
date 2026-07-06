export default function Hero() {

    function loginWithSpotify() {

        const CLIENT_ID = "YOUR_CLIENT_ID";

        const REDIRECT_URI = "https://yourdomain.com/callback";

        const SCOPES = [
            "user-read-currently-playing",
            "user-read-recently-played"
        ].join("%20");

        window.location.href =
            `https://accounts.spotify.com/authorize` +
            `?client_id=${CLIENT_ID}` +
            `&response_type=code` +
            `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
            `&scope=${SCOPES}`;
    }

    return (
        <section className="hero">

            <h1>...CONNECTED :3</h1>

            <button onClick={loginWithSpotify}>
                CONNECT SPOTIFY
            </button>

        </section>
    );
}