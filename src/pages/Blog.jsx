import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Blog() {

    const [threads, setThreads] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [activeThread, setActiveThread] = useState(null);
    const [replies, setReplies] = useState([]);
    const [reply, setReply] = useState("");

    async function loadThreads() {

        const { data, error } = await supabase
            .from("threads")
            .select("*")
            .order("id", { ascending: false });

        if (error) console.log(error);

        setThreads(data || []);
    }

    useEffect(() => {
        loadThreads();
    }, []);

    async function createThread() {

        if (!title || !content) return;

        const { error } = await supabase
            .from("threads")
            .insert([{ title, content }]);

        if (error) {
            console.log("Insert error:", error);
            return;
        }

        setTitle("");
        setContent("");

        loadThreads();
    }

    async function openThread(thread) {

        setActiveThread(thread);

        const { data } = await supabase
            .from("replies")
            .select("*")
            .eq("thread_id", thread.id)
            .order("id", { ascending: true });

        setReplies(data || []);
    }

    async function addReply() {

        if (!reply) return;

        const { error } = await supabase
            .from("replies")
            .insert([{
                thread_id: activeThread.id,
                content: reply
            }]);

        if (error) {
            console.log("Reply error:", error);
            return;
        }

        setReply("");
        openThread(activeThread);
    }

    return (
        <div className="blog-app">

            <div className="blog-window">

                {!activeThread ? (
                    <>
                        <h1>BLOG FORUM</h1>

                        <div className="blog-create">

                            <input
                                placeholder="Thread title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <textarea
                                placeholder="Write something..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />

                            <button onClick={createThread}>
                                CREATE THREAD
                            </button>

                        </div>

                        <hr />

                        {threads.map(t => (
                            <div
                                key={t.id}
                                className="thread"
                                onClick={() => openThread(t)}
                            >
                                <h3>{t.title}</h3>
                                <p>{t.content}</p>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <button onClick={() => setActiveThread(null)}>
                            ← BACK
                        </button>

                        <h2>{activeThread.title}</h2>

                        <p>{activeThread.content}</p>

                        <hr />

                        <h3>REPLIES</h3>

                        {replies.map(r => (
                            <p key={r.id}>💬 {r.content}</p>
                        ))}

                        <input
                            placeholder="Write reply..."
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                        />

                        <button onClick={addReply}>
                            POST REPLY
                        </button>
                    </>
                )}

            </div>

        </div>
    );
}