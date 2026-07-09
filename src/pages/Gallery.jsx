import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useLiveUpdate } from "../hooks/useLiveUpdate";

export default function Gallery() {

    const [images, setImages] = useState([]);

    async function loadImages() {

        const { data, error } = await supabase
            .from("gallery")
            .select("*")
            .order("id", { ascending: false });

        if (!error) {
            setImages(data || []);
        }
    }

    useLiveUpdate(loadImages, 8000);

    return (
        <div className="gallery-page">

            <h1 className="gallery-title">
                THE GALLERY
            </h1>

            <p className="gallery-subtitle">
                uhhhhhhhhhhhh photos n shit
            </p>

            <div className="gallery-grid">

                {images.map(img => (
                    <div key={img.id} className="gallery-item">

                        <img src={img.url} alt="gallery" />

                    </div>
                ))}

            </div>

        </div>
    );
}