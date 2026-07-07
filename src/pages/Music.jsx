import { useEffect, useState } from "react";


export default function Music() {

    const [tracks, setTracks] = useState([]);


    useEffect(() => {

        fetch("/api/music")
            .then(res => res.json())
            .then(data => {

                setTracks(
                    data.recenttracks.track
                );

            });

    }, []);


    return (

        <div className="music-wall">

            <h1>
                🎵 MUSIC WALL
            </h1>


            <p className="music-status">
                AUDIO SUBSYSTEM: ONLINE
            </p>


            <div className="track-list">

                {tracks.map((track, index) => (

                    <div
                        className="track"
                        key={index}
                    >

                        <img
                            src={
                                track.image[2]["#text"]
                            }
                            alt=""
                        />


                        <div>

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