import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useLiveUpdate } from "../hooks/useLiveUpdate";

export default function Guestbook() {

    const [names, setNames] = useState([]);
    const [input, setInput] = useState("");

    async function loadNames() {

        const { data } = await supabase
            .from("guestbook")
            .select("*")
            .order("id", { ascending: false });

        setNames(data || []);
    }

    useLiveUpdate(loadNames, 15000);

    async function addName() {

        if (!input.trim()) return;

        const { error } = await supabase
            .from("guestbook")
            .insert([{ name: input }]);

        if (!error) {
            setInput("");
            loadNames();
        }
    }

    return (
        <div className="guestbook-page">

            <h1 className="guestbook-title">
                THE WALL
            </h1>

            <p className="guestbook-subtitle">
                FACE THE WALL ...and sign it
            </p>

            <div className="guestbook-input">

                <input
                    placeholder="your name..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <button onClick={addName}>
                    TAG WALL
                </button>

            </div>

            <div className="brick-wall">

                {names.map((n) => (
                    <div key={n.id} className="brick">
                        {n.name}
                    </div>
                ))}

            </div>

        </div>
    );
}