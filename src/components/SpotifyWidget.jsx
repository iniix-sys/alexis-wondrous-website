import { useEffect, useState } from "react";

export default function SpotifyWidget() {

    const [nowPlaying, setNowPlaying] = useState(null);
    const [recent, setRecent] = useState([]);

    async function load() {

        const now = await fetch("/api/spotify/now-playing");
        const nowData = await now.json();

        const rec = await fetch("/api/spotify/recent");
        const recData = await rec.json();

        setNowPlaying(nowData);
        setRecent(recData.items || []);
    }

    useEffect(() => {
        load();
        const i = setInterval(load, 15000);
        return () => clearInterval(i);
    }, []);

    return (
        <div className="spotify-widget glass">

            <h2>🎧 Now Playing</h2>

            {nowPlaying?.item ? (
                <p>
                    {nowPlaying.item.name} —{" "}
                    {nowPlaying.item.artists[0].name}
                </p>
            ) : (
                <p>Nothing playing</p>
            )}

            <h3>Recent</h3>

            {recent.map((t, i) => (
                <p key={i}>
                    {t.track.name} — {t.track.artists[0].name}
                </p>
            ))}

        </div>
    );
}