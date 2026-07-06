import { Link } from "react-router-dom";

export default function Navbar() {

    return (
        <nav className="navbar">

            <h1 className="logo">🌙 LOREM SYSTEM INTERFACE</h1>

            <ul className="nav-links">

                <li><Link to="/">HOME</Link></li>
                <li><Link to="/blog">BLOG</Link></li>
                <li><Link to="/gallery">GALLERY</Link></li>
                <li><Link to="/music">MUSIC WALL</Link></li>
                <li><Link to="/guestbook">GUESTBOOK</Link></li>

            </ul>

        </nav>
    );
}