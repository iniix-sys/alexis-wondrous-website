import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

function AuthPanel({ signUp, signIn }) {

    const [mode, setMode] = useState("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit() {

        setError("");
        setNotice("");

        if (!email.trim() || !password.trim()) return;
        if (mode === "signup" && !username.trim()) return;

        setSubmitting(true);

        try {

            if (mode === "signup") {

                await signUp(email.trim(), password, username.trim().toLowerCase());
                setNotice("Account created! Check your email to confirm, then log in.");
                setMode("signin");

            } else {

                await signIn(email.trim(), password);

            }

            setPassword("");

        } catch (err) {

            if (err.message?.includes("duplicate key") || err.message?.includes("profiles_username_key")) {
                setError("That username is already taken.");
            } else {
                setError(err.message || "Something went wrong.");
            }

        } finally {
            setSubmitting(false);
        }

    }

    return (
        <div className="space-auth">

            <div className="space-auth-tabs">
                <button
                    className={mode === "signin" ? "active" : ""}
                    onClick={() => { setMode("signin"); setError(""); setNotice(""); }}
                >
                    LOG IN
                </button>
                <button
                    className={mode === "signup" ? "active" : ""}
                    onClick={() => { setMode("signup"); setError(""); setNotice(""); }}
                >
                    SIGN UP
                </button>
            </div>

            {mode === "signup" && (
                <input
                    placeholder="username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            )}

            <input
                placeholder="email..."
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                placeholder="password..."
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="space-auth-error">⚠ {error}</p>}
            {notice && <p className="space-auth-notice">✓ {notice}</p>}

            <button onClick={handleSubmit} disabled={submitting}>
                {mode === "signup" ? "CREATE ACCOUNT" : "LOG IN"}
            </button>

        </div>
    );
}

export default function Space() {

    const { user, profile, loading, signUp, signIn, signOut } = useAuth();
    const [profiles, setProfiles] = useState([]);

    async function loadProfiles() {

        const { data } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        setProfiles(data || []);
    }

    useEffect(() => {
        loadProfiles();
    }, []);

    return (
        <div className="blog-app">

            <div className="blog-window space-window">

                <h1 className="space-directory-title">THE SPACE</h1>
                <p className="space-directory-subtitle">a mini social network :3</p>

                {loading ? (
                    <p>Loading...</p>
                ) : user ? (
                    <div className="space-account-bar">
                        <span>logged in as <strong>@{profile?.username}</strong></span>
                        {profile && (
                            <Link to={`/space/${profile.username}`}>
                                <button>MY PROFILE</button>
                            </Link>
                        )}
                        <button onClick={signOut}>LOG OUT</button>
                    </div>
                ) : (
                    <AuthPanel signUp={signUp} signIn={signIn} />
                )}

                <div className="space-section">

                    <h2 className="space-section-title">MEMBERS ({profiles.length})</h2>

                    <div className="space-top8">

                        {profiles.map((p) => (
                            <Link
                                key={p.id}
                                to={`/space/${p.username}`}
                                className="space-friend-tile"
                            >
                                <div className="space-friend-avatar">{p.avatar_emoji || "🌙"}</div>
                                <span>{p.display_name || p.username}</span>
                            </Link>
                        ))}

                        {!profiles.length && (
                            <p className="donations-empty">No members yet. Be the first to sign up!</p>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}
