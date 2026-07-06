export default function Hero() {

    function loginWithSpotify() {

        const CLIENT_ID = "8e92c7cec2014f0e867b360cfc6231ee";

        const REDIRECT_URI = "https://alexis-wondrous-website.vercel.app/callback";

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