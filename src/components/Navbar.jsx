import { Link } from "react-router-dom";

export default function Navbar() {

    return (
        <nav className="navbar">

            <h1 className="logo">🌙 ALEXIS' WONDROUS WEBSITE</h1>

            <ul className="nav-links">

                <li><Link to="/">HOME</Link></li>
                <li><Link to="/blog">BLOG</Link></li>
                <li><Link to="/gallery">GALLERY</Link></li>
                <li><Link to="/music">MUSIC HALL</Link></li>
                <li><Link to="/guestbook">THE WALL</Link></li>
                <li><Link to="/sites">OTHER SITES</Link></li>
            </ul>

        </nav>
    );
}