import { Link } from "react-router-dom";

export default function Navbar({ toggleSidebar }) {
    return (
        <nav className="navbar">

            <div className="nav-left">

                <span className="logo">🌙alexis' wondrous website</span>
            </div>

            <div className="nav-links">
                <Link to="/">home</Link>
                <Link to="/blog">blog</Link>
                <Link to="/gallery">gallery</Link>
                <Link to="/guestbook">guestbook</Link>
            </div>

        </nav>
    );
}