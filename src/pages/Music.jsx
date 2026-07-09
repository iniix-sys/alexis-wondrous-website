import { useEffect, useMemo, useState } from "react";
import { useLiveUpdate } from "../hooks/useLiveUpdate";

const FAVORITE_STORAGE_KEY = "alexis-favorites-admin";
const ADMIN_KEY = import.meta.env.VITE_FAVORITES_ADMIN_KEY || "alexis-favorites-2026";

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
    const [favoriteTracks, setFavoriteTracks] = useState([]);

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

            setTracks(trackList);
            setScrobbleCount(nextScrobbleCount);

            if (trackList.length > 0 && trackList[0]["@attr"]?.nowplaying === "true") {
                const playingTrack = {
                    ...trackList[0],
                    isPlaying: true
                };
                setCurrentTrack(playingTrack);
            } else if (currentTrack && currentTrack.isPlaying) {
                const pausedTrack = {
                    ...currentTrack,
                    isPlaying: false
                };
                setCurrentTrack(pausedTrack);
            } else if (currentTrack && !currentTrack.isPlaying) {
                const isPausedTrackInHistory = trackList.some(
                    track => track.name === currentTrack.name &&
                    track.artist["#text"] === currentTrack.artist["#text"]
                );

                if (isPausedTrackInHistory) {
                    setCurrentTrack(null);
                }
            }

        } catch (error) {
            console.error("Error fetching music data:", error);
        }

    };

    useLiveUpdate(fetchMusicData, 20000);

    useEffect(() => {
        async function loadFavorites() {
            try {
                const response = await fetch("/api/favorites");
                const data = await response.json();
                setFavoriteTracks(data.favorites || []);
            } catch (error) {
                console.error("Error loading favorites:", error);
            }
        }

        loadFavorites();
    }, []);

    const visibleTracks = useMemo(() => {
        if (!currentTrack || currentTrack.isPlaying) return tracks;

        return tracks.filter(track => {
            if (track.name === currentTrack.name && track.artist["#text"] === currentTrack.artist["#text"]) {
                return false;
            }
            return true;
        });
    }, [tracks, currentTrack]);

    const canEditFavorites = () => {
        if (typeof window === "undefined") return false;

        const stored = window.localStorage.getItem(FAVORITE_STORAGE_KEY);
        if (stored === "true") return true;

        const entered = window.prompt("Enter the favorite songs admin key");
        if (entered === ADMIN_KEY) {
            window.localStorage.setItem(FAVORITE_STORAGE_KEY, "true");
            return true;
        }

        window.alert("Only the owner can edit favorite songs.");
        return false;
    };

    const toggleFavorite = async (track) => {
        if (!track) return;

        if (!canEditFavorites()) return;

        const normalizedTrack = {
            name: track.name,
            artist: track.artist?.["#text"] || track.artist,
            url: getTrackUrl(track),
            image: track.image?.[2]?.["#text"] || ""
        };

        const alreadySaved = favoriteTracks.some(savedTrack =>
            savedTrack.name === normalizedTrack.name &&
            savedTrack.artist === normalizedTrack.artist
        );

        const nextFavorites = alreadySaved
            ? favoriteTracks.filter(savedTrack =>
                savedTrack.name !== normalizedTrack.name ||
                savedTrack.artist !== normalizedTrack.artist
            )
            : [...favoriteTracks, normalizedTrack];

        try {
            const response = await fetch("/api/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tracks: nextFavorites, password: ADMIN_KEY })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Unable to update favorites");
            }

            setFavoriteTracks(data.favorites || []);
        } catch (error) {
            console.error("Error updating favorites:", error);
            window.alert("Unable to update favorites right now.");
        }
    };

    const isFavoriteTrack = (track) => {
        if (!favoriteTracks.length) return false;
        return favoriteTracks.some(savedTrack =>
            savedTrack.name === track.name &&
            savedTrack.artist === (track.artist?.["#text"] || track.artist)
        );
    };

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
                    <div className="music-card-wrapper" key="current">
                        <button
                            className={`favorite-toggle ${isFavoriteTrack(currentTrack) ? "active" : ""}`}
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                toggleFavorite(currentTrack);
                            }}
                            aria-label={`Favorite ${currentTrack.name}`}
                        >
                            ★
                        </button>

                        <a
                            className="music-card is-paused"
                            href={getTrackUrl(currentTrack)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="now-playing-indicator">
                                <span className="pulse"></span>
                                PAUSED
                            </div>

                            <img
                                src={currentTrack.image[2]["#text"]}
                                alt="album cover"
                            />

                            <div className="music-info">
                                <h3>{currentTrack.name}</h3>
                                <p>{currentTrack.artist["#text"]}</p>
                            </div>
                        </a>
                    </div>
                )}

                {visibleTracks.map((track, index) => {
                    const isNowPlaying = track["@attr"]?.nowplaying === "true";

                    return (

                    <div className="music-card-wrapper" key={index}>
                        <button
                            className={`favorite-toggle ${isFavoriteTrack(track) ? "active" : ""}`}
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                toggleFavorite(track);
                            }}
                            aria-label={`Favorite ${track.name}`}
                        >
                            ★
                        </button>

                        <a
                            className={`music-card ${isNowPlaying ? "now-playing is-playing" : ""}`}
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
                                src={track.image[2]["#text"]}
                                alt="album cover"
                            />

                            <div className="music-info">
                                <h3>{track.name}</h3>
                                <p>{track.artist["#text"]}</p>
                            </div>
                        </a>
                    </div>

                    );

                })}

            </div>

            <div className="favorite-songs">
                <div className="favorite-songs__header">
                    <h2>FAVORITE SONGS</h2>
                    <span>{favoriteTracks.length ? `${favoriteTracks.length} saved` : "none yet"}</span>
                </div>

                {favoriteTracks.length ? (
                    <div className="favorite-songs__list">
                        {favoriteTracks.map((track) => (
                            <a
                                key={`${track.name}-${track.artist}`}
                                className="favorite-songs__card"
                                href={track.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {track.image && <img src={track.image} alt="favorite album cover" />}
                                <div>
                                    <h3>{track.name}</h3>
                                    <p>{track.artist}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <p className="favorite-songs__empty">Tap the star on any track to add it here.</p>
                )}
            </div>

        </div>

    );
}