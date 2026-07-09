import { useEffect, useState } from "react";

export default function Music() {

    const [tracks, setTracks] = useState([]);
    const [scrobbleCount, setScrobbleCount] = useState(0);


    useEffect(() => {

        fetch("/api/music")
            .then(res => res.json())
            .then(data => {

                setTracks(
                    data.recenttracks.track
                );

            });

        fetch("/api/scrobbles")
            .then(res => res.json())
            .then(data => {

                setScrobbleCount(data.scrobbleCount);

            });

    }, []);



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

                {tracks.map((track, index) => (

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

                ))}

            </div>

        </div>

    );
}