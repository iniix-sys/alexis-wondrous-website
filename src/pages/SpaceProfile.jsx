import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

async function fetchProfilesByIds(ids) {

    const uniqueIds = [...new Set(ids)].filter(Boolean);
    if (!uniqueIds.length) return {};

    const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_emoji")
        .in("id", uniqueIds);

    const map = {};
    (data || []).forEach((p) => { map[p.id] = p; });
    return map;
}

export default function SpaceProfile() {

    const { username } = useParams();
    const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [notFound, setNotFound] = useState(false);

    const [editing, setEditing] = useState(false);
    const [editDisplayName, setEditDisplayName] = useState("");
    const [editMood, setEditMood] = useState("");
    const [editAbout, setEditAbout] = useState("");
    const [editAvatar, setEditAvatar] = useState("");

    const [friends, setFriends] = useState([]);
    const [addFriendUsername, setAddFriendUsername] = useState("");
    const [friendError, setFriendError] = useState("");

    const [comments, setComments] = useState([]);
    const [commentAuthors, setCommentAuthors] = useState({});
    const [commentText, setCommentText] = useState("");

    const [posts, setPosts] = useState([]);
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [activePost, setActivePost] = useState(null);
    const [postComments, setPostComments] = useState([]);
    const [postCommentAuthors, setPostCommentAuthors] = useState({});
    const [postReply, setPostReply] = useState("");

    const isOwner = !!(user && profile && user.id === profile.id);

    async function loadProfile() {

        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("username", username)
            .maybeSingle();

        if (!data) {
            setNotFound(true);
            return;
        }

        setProfile(data);
        setEditDisplayName(data.display_name || "");
        setEditMood(data.mood || "");
        setEditAbout(data.about || "");
        setEditAvatar(data.avatar_emoji || "🌙");
    }

    useEffect(() => {
        setProfile(null);
        setNotFound(false);
        loadProfile();
    }, [username]);

    async function loadFriends(profileId) {

        const { data } = await supabase
            .from("top_friends")
            .select("*")
            .eq("user_id", profileId)
            .order("created_at", { ascending: true });

        const rows = data || [];
        const friendMap = await fetchProfilesByIds(rows.map((r) => r.friend_id));

        setFriends(rows.map((r) => ({ linkId: r.id, ...friendMap[r.friend_id] })).filter((f) => f.id));
    }

    async function loadComments(profileId) {

        const { data } = await supabase
            .from("profile_comments")
            .select("*")
            .eq("profile_id", profileId)
            .order("created_at", { ascending: false });

        const rows = data || [];
        setComments(rows);
        setCommentAuthors(await fetchProfilesByIds(rows.map((r) => r.author_id)));
    }

    async function loadPosts(profileId) {

        const { data } = await supabase
            .from("posts")
            .select("*")
            .eq("user_id", profileId)
            .order("created_at", { ascending: false });

        setPosts(data || []);
    }

    useEffect(() => {
        if (!profile) return;
        loadFriends(profile.id);
        loadComments(profile.id);
        loadPosts(profile.id);
    }, [profile]);

    async function loadPostComments(post) {

        const { data } = await supabase
            .from("post_comments")
            .select("*")
            .eq("post_id", post.id)
            .order("created_at", { ascending: true });

        const rows = data || [];
        setPostComments(rows);
        setPostCommentAuthors(await fetchProfilesByIds(rows.map((r) => r.author_id)));
    }

    function openPost(post) {
        setActivePost(post);
        loadPostComments(post);
    }

    async function saveProfileEdits() {

        const { error } = await supabase
            .from("profiles")
            .update({
                display_name: editDisplayName.trim() || profile.username,
                mood: editMood.trim(),
                about: editAbout.trim(),
                avatar_emoji: editAvatar.trim() || "🌙"
            })
            .eq("id", profile.id);

        if (!error) {
            setEditing(false);
            loadProfile();
        }
    }

    async function addFriend() {

        setFriendError("");

        const target = addFriendUsername.trim().toLowerCase();
        if (!target) return;

        if (target === profile.username) {
            setFriendError("You can't add yourself.");
            return;
        }

        const { data: targetProfile } = await supabase
            .from("profiles")
            .select("id, username")
            .eq("username", target)
            .maybeSingle();

        if (!targetProfile) {
            setFriendError("No user with that username.");
            return;
        }

        const { error } = await supabase
            .from("top_friends")
            .insert([{ user_id: profile.id, friend_id: targetProfile.id }]);

        if (error) {
            setFriendError(error.message.includes("duplicate") ? "Already in your Top 8." : error.message);
            return;
        }

        setAddFriendUsername("");
        loadFriends(profile.id);
    }

    async function removeFriend(linkId) {

        await supabase.from("top_friends").delete().eq("id", linkId);
        loadFriends(profile.id);
    }

    async function addComment() {

        if (!user || !commentText.trim()) return;

        const { error } = await supabase
            .from("profile_comments")
            .insert([{
                profile_id: profile.id,
                author_id: user.id,
                message: commentText.trim()
            }]);

        if (!error) {
            setCommentText("");
            loadComments(profile.id);
        }
    }

    async function createPost() {

        if (!isOwner || !postTitle.trim() || !postContent.trim()) return;

        const { error } = await supabase
            .from("posts")
            .insert([{
                user_id: profile.id,
                title: postTitle.trim(),
                content: postContent.trim()
            }]);

        if (!error) {
            setPostTitle("");
            setPostContent("");
            loadPosts(profile.id);
        }
    }

    async function addPostReply() {

        if (!user || !postReply.trim() || !activePost) return;

        const { error } = await supabase
            .from("post_comments")
            .insert([{
                post_id: activePost.id,
                author_id: user.id,
                content: postReply.trim()
            }]);

        if (!error) {
            setPostReply("");
            loadPostComments(activePost);
        }
    }

    if (notFound) {
        return (
            <div className="blog-app">
                <div className="blog-window space-window">
                    <p>This user doesn't exist.</p>
                    <Link to="/space"><button>← BACK TO THE SPACE</button></Link>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="blog-app">
                <div className="blog-window space-window">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="blog-app">

            <div className="blog-window space-window">

                <Link to="/space" className="space-back-link">← ALL MEMBERS</Link>

                <div className="space-profile">

                    <div className="space-avatar">{profile.avatar_emoji || "🌙"}</div>

                    <div className="space-profile-info">

                        <div className="space-profile-name-row">
                            <h1>{profile.display_name || profile.username}</h1>
                            <span className="space-online">@{profile.username}</span>
                        </div>

                        <p className="space-mood">mood: {profile.mood || "..."}</p>
                        <p className="space-about">{profile.about}</p>

                        {isOwner && !editing && (
                            <button onClick={() => setEditing(true)}>EDIT PROFILE</button>
                        )}

                        {isOwner && editing && (
                            <div className="space-comment-input">

                                <input
                                    placeholder="avatar emoji"
                                    value={editAvatar}
                                    onChange={(e) => setEditAvatar(e.target.value)}
                                />

                                <input
                                    placeholder="display name"
                                    value={editDisplayName}
                                    onChange={(e) => setEditDisplayName(e.target.value)}
                                />

                                <input
                                    placeholder="mood"
                                    value={editMood}
                                    onChange={(e) => setEditMood(e.target.value)}
                                />

                                <textarea
                                    placeholder="about me"
                                    value={editAbout}
                                    onChange={(e) => setEditAbout(e.target.value)}
                                />

                                <div className="space-account-bar">
                                    <button onClick={saveProfileEdits}>SAVE</button>
                                    <button onClick={() => setEditing(false)}>CANCEL</button>
                                </div>

                            </div>
                        )}

                    </div>

                </div>

                <div className="space-section">

                    <h2 className="space-section-title">TOP {friends.length || 8}</h2>

                    <div className="space-top8">

                        {friends.map((f) => (
                            <div key={f.linkId} className="space-friend-tile-wrapper">
                                <Link to={`/space/${f.username}`} className="space-friend-tile">
                                    <div className="space-friend-avatar">{f.avatar_emoji || "🌙"}</div>
                                    <span>{f.display_name || f.username}</span>
                                </Link>
                                {isOwner && (
                                    <button className="space-friend-remove" onClick={() => removeFriend(f.linkId)}>×</button>
                                )}
                            </div>
                        ))}

                        {!friends.length && <p className="donations-empty">No friends added yet.</p>}

                    </div>

                    {isOwner && (
                        <div className="space-comment-input">
                            <input
                                placeholder="add friend by username..."
                                value={addFriendUsername}
                                onChange={(e) => setAddFriendUsername(e.target.value)}
                            />
                            {friendError && <p className="space-auth-error">⚠ {friendError}</p>}
                            <button onClick={addFriend}>ADD TO TOP 8</button>
                        </div>
                    )}

                </div>

                <div className="space-section">

                    <h2 className="space-section-title">COMMENTS ({comments.length})</h2>

                    {user ? (
                        <div className="space-comment-input">
                            <textarea
                                placeholder="leave a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button onClick={addComment}>POST COMMENT</button>
                        </div>
                    ) : (
                        <p className="donations-empty">
                            <Link to="/space">Log in</Link> to leave a comment.
                        </p>
                    )}

                    <div className="space-comments-list">

                        {comments.map((c) => (
                            <div key={c.id} className="space-comment">
                                <strong>
                                    <Link to={`/space/${commentAuthors[c.author_id]?.username || ""}`}>
                                        {commentAuthors[c.author_id]?.display_name || commentAuthors[c.author_id]?.username || "unknown"}
                                    </Link>
                                </strong>
                                <p>{c.message}</p>
                            </div>
                        ))}

                    </div>

                </div>

                <div className="space-section">

                    <h2 className="space-section-title">BLURBS</h2>

                    {!activePost ? (
                        <>
                            {isOwner && (
                                <div className="blog-create">
                                    <input
                                        placeholder="Blurb title..."
                                        value={postTitle}
                                        onChange={(e) => setPostTitle(e.target.value)}
                                    />
                                    <textarea
                                        placeholder="What's on your mind?"
                                        value={postContent}
                                        onChange={(e) => setPostContent(e.target.value)}
                                    />
                                    <button onClick={createPost}>POST BLURB</button>
                                </div>
                            )}

                            {posts.map((p) => (
                                <div key={p.id} className="thread" onClick={() => openPost(p)}>
                                    <h3>{p.title}</h3>
                                    <p>{p.content}</p>
                                </div>
                            ))}

                            {!posts.length && <p className="donations-empty">No blurbs yet.</p>}
                        </>
                    ) : (
                        <>
                            <button onClick={() => setActivePost(null)}>← BACK</button>

                            <h2>{activePost.title}</h2>
                            <p className="space-post-content">{activePost.content}</p>

                            <hr />

                            <h3>REPLIES</h3>

                            {postComments.map((r) => (
                                <p key={r.id} className="space-reply-line">
                                    💬 <strong>{postCommentAuthors[r.author_id]?.username || "unknown"}:</strong> {r.content}
                                </p>
                            ))}

                            {user ? (
                                <>
                                    <textarea
                                        placeholder="Write reply..."
                                        value={postReply}
                                        onChange={(e) => setPostReply(e.target.value)}
                                    />
                                    <button onClick={addPostReply}>POST REPLY</button>
                                </>
                            ) : (
                                <p className="donations-empty">
                                    <Link to="/space">Log in</Link> to reply.
                                </p>
                            )}
                        </>
                    )}

                </div>

            </div>

        </div>
    );
}
