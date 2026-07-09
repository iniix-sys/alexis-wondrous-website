import { useMemo, useRef, useState } from "react";
import { useLiveUpdate } from "../hooks/useLiveUpdate";

function getTrackUrl(track) {
    if (track?.url) return track.url;

    const artist = track?.artist?.["#text"] || "";
    const name = track?.name || "";

    if (!artist && !name) return null;

    return `https://www.last.fm/search?q=${encodeURIComponent(`${artist} ${name}`)}`;
}

export default function Music() {

    const [tracks, setTracks] = useState([]);
    const [scrobbleCount, setScrobbleCount] = useState(0);
    const [currentTrack, setCurrentTrack] = useState(null);
    const lastStateRef = useRef({ tracks: [], currentTrack: null, scrobbleCount: 0 });

    const fetchMusicData = async () => {

        try {
            const [musicRes, scrobblesRes] = await Promise.all([
                fetch("/api/music"),
                fetch("/api/scrobbles")
            ]);

            const musicData = await musicRes.json();
            const scrobblesData = await scrobblesRes.json();

            const trackList = musicData.recenttracks.track || [];
            const nextScrobbleCount = scrobblesData.scrobbleCount || 0;

            lastStateRef.current = {
                tracks: trackList,
                currentTrack: null,
                scrobbleCount: nextScrobbleCount
            };

            setTracks(trackList);
            setScrobbleCount(nextScrobbleCount);

            // Check if first track is now playing
            if (trackList.length > 0 && trackList[0]["@attr"]?.nowplaying === "true") {
                const playingTrack = {
                    ...trackList[0],
                    isPlaying: true
                };
                lastStateRef.current.currentTrack = playingTrack;
                setCurrentTrack(playingTrack);
            } else if (currentTrack && currentTrack.isPlaying) {
                const pausedTrack = {
                    ...currentTrack,
                    isPlaying: false
                };
                lastStateRef.current.currentTrack = pausedTrack;
                setCurrentTrack(pausedTrack);
            } else if (currentTrack && !currentTrack.isPlaying) {
                const isPausedTrackInHistory = trackList.some(
                    track => track.name === currentTrack.name &&
                    track.artist["#text"] === currentTrack.artist["#text"]
                );

                if (isPausedTrackInHistory) {
                    lastStateRef.current.currentTrack = null;
                    setCurrentTrack(null);
                }
            }

        } catch (error) {
            console.error("Error fetching music data:", error);
        }

    };

    useLiveUpdate(fetchMusicData, 20000);

    const visibleTracks = useMemo(() => {
        if (!currentTrack || currentTrack.isPlaying) return tracks;

        return tracks.filter(track => {
            if (track.name === currentTrack.name && track.artist["#text"] === currentTrack.artist["#text"]) {
                return false;
            }
            return true;
        });
    }, [tracks, currentTrack]);

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
                    <a
                        className="music-card is-paused"
                        key="current"
                        href={getTrackUrl(currentTrack)}
                        target="_blank"
                        rel="noopener noreferrer"
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

                    </a>
                )}

                {visibleTracks.map((track, index) => {
                    const isNowPlaying = track["@attr"]?.nowplaying === "true";

                    return (

                    <a
                        className={`music-card ${isNowPlaying ? "now-playing is-playing" : ""}`}
                        key={index}
                        href={getTrackUrl(track)}
                        target="_blank"
                        rel="noopener noreferrer"
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

                    </a>

                    );

                })}

            </div>

        </div>

    );
}