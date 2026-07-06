import { useNavigate } from "react-router-dom";

export default function Hero() {

    const navigate = useNavigate();

    return (
        <section className="hero">

            <h1>...CONNECTED :3</h1>

            <p>
                what is up my original gangsters? this is my lovely site where you can post to a live blog feed, look at my wonderful photography, see what music i listen to, and of course, sign a guestbook
            </p>

            <div className="hero-buttons">

                <button onClick={() => navigate("/blog")}>
                    POST
                </button>

                <button onClick={() => navigate("/guestbook")}>
                    SIGN WALL
                </button>

            </div>

        </section>
    );
}