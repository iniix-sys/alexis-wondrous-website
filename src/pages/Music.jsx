import { useEffect, useState } from "react";
import { useLiveUpdate } from "../hooks/useLiveUpdate";

export default function Music() {

    const [tracks, setTracks] = useState([]);
    const [scrobbleCount, setScrobbleCount] = useState(0);
    const [currentTrack, setCurrentTrack] = useState(null);

    const fetchMusicData = async () => {

        try {
            const [musicRes, scrobblesRes] = await Promise.all([
                fetch("/api/music"),
                fetch("/api/scrobbles")
            ]);

            const musicData = await musicRes.json();
            const scrobblesData = await scrobblesRes.json();

            const trackList = musicData.recenttracks.track;
            setTracks(trackList);
            setScrobbleCount(scrobblesData.scrobbleCount);

            // Check if first track is now playing
            if (trackList.length > 0 && trackList[0]["@attr"]?.nowplaying === "true") {
                setCurrentTrack({
                    ...trackList[0],
                    isPlaying: true
                });
            } else if (currentTrack) {
                // Music was paused, keep showing current track but mark as paused
                setCurrentTrack({
                    ...currentTrack,
                    isPlaying: false
                });
            }

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

                {currentTrack && (
                    <div
                        className={`music-card ${currentTrack.isPlaying ? "now-playing is-playing" : "is-paused"}`}
                        key="current"
                    >

                        {currentTrack.isPlaying && (
                            <div className="now-playing-indicator">
                                <span className="pulse active"></span>
                                PLAYING
                            </div>
                        )}

                        {!currentTrack.isPlaying && (
                            <div className="now-playing-indicator">
                                <span className="pulse"></span>
                                PAUSED
                            </div>
                        )}

                        <img
                            src={
                                currentTrack.image[2]["#text"]
                            }
                            alt="album cover"
                        />

                        <div className="music-info">

                            <h3>
                                {currentTrack.name}
                            </h3>

                            <p>
                                {currentTrack.artist["#text"]}
                            </p>

                        </div>

                    </div>
                )}

                {tracks.map((track, index) => {

                    const isNowPlaying = track["@attr"]?.nowplaying === "true";
                    
                    // Skip if this is the current track (already shown above)
                    if (currentTrack && track.name === currentTrack.name && track.artist["#text"] === currentTrack.artist["#text"]) {
                        return null;
                    }

                    return (

                    <div
                        className="music-card"
                        key={index}
                    >

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