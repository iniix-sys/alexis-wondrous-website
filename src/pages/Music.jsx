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
                // Currently playing - update cache
                setCurrentTrack({
                    ...trackList[0],
                    isPlaying: true
                });
            } else if (currentTrack && currentTrack.isPlaying) {
                // Was playing, now paused - update cache
                setCurrentTrack({
                    ...currentTrack,
                    isPlaying: false
                });
            } else if (currentTrack && !currentTrack.isPlaying) {
                // Check if paused track is still in history
                const isPausedTrackInHistory = trackList.some(
                    track => track.name === currentTrack.name && 
                    track.artist["#text"] === currentTrack.artist["#text"]
                );
                
                // If paused track still not in history, keep showing it paused
                // Once it gets scrobbled (appears in history), clear cache
                if (isPausedTrackInHistory) {
                    setCurrentTrack(null);
                }
            }

        } catch (error) {
            console.error("Error fetching music data:", error);
        }

    };

    useLiveUpdate(fetchMusicData, 20000);



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

                {currentTrack && !currentTrack.isPlaying && (
                    <div
                        className="music-card is-paused"
                        key="current"
                    >

                        <div className="now-playing-indicator">
                            <span className="pulse"></span>
                            PAUSED
                        </div>

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

                    // Skip the current paused track from regular list to avoid duplication
                    if (currentTrack && !currentTrack.isPlaying && 
                        track.name === currentTrack.name && 
                        track.artist["#text"] === currentTrack.artist["#text"]) {
                        return null;
                    }

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