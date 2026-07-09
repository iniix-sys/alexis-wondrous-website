import { useEffect, useState } from "react";
import { useLiveUpdate } from "../hooks/useLiveUpdate";

export default function Music() {

    const [tracks, setTracks] = useState([]);
    const [scrobbleCount, setScrobbleCount] = useState(0);

    const fetchMusicData = async () => {

        try {
            const [musicRes, scrobblesRes] = await Promise.all([
                fetch("/api/music"),
                fetch("/api/scrobbles")
            ]);

            const musicData = await musicRes.json();
            const scrobblesData = await scrobblesRes.json();

            setTracks(musicData.recenttracks.track);
            setScrobbleCount(scrobblesData.scrobbleCount);

        } catch (error) {
            console.error("Error fetching music data:", error);
        }

    };

    useLiveUpdate(fetchMusicData, 15000);



    return (

        <div className="music-wall">

            <h1>
                MUSIC HALL
            </h1>

            <p className="music-status">
                AUDIO SUBSYSTEM: ONLINE
            </p>

            <div className="scrobble-counter">
                <p>
                    SCROBBLES: <span>{scrobbleCount.toLocaleString()}</span>
                </p>
            </div>


            <div className="music-grid">

                {tracks.map((track, index) => {

                    const isNowPlaying = track["@attr"]?.nowplaying === "true";

                    return (

                    <div
                        className={`music-card ${isNowPlaying ? "now-playing is-playing" : ""}`}
                        key={index}
                    >

                        {isNowPlaying && (
                            <div className="now-playing-indicator">
                                <span className="pulse active"></span>
                                PLAYING
                            </div>
                        )}

                        <img
                            src={
                                track.image[2]["#text"]
                            }
                            alt="album cover"
                        />


                        <div className="music-info">

                            <h3>
                                {track.name}
                            </h3>

                            <p>
                                {track.artist["#text"]}
                            </p>

                        </div>


                    </div>

                    );

                })}

            </div>

        </div>

    );
}