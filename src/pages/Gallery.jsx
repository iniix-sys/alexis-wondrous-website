import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useLiveUpdate } from "../hooks/useLiveUpdate";

export default function Gallery() {

    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    async function loadImages() {

        const { data, error } = await supabase
            .from("gallery")
            .select("*")
            .order("id", { ascending: false });

        if (!error) {
            setImages(data || []);
        }
    }

    useLiveUpdate(loadImages, 15000);

    useEffect(() => {
        if (!selectedImage) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setSelectedImage(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedImage]);

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
                    <div
                        key={img.id}
                        className="gallery-item"
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedImage(img)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                setSelectedImage(img);
                            }
                        }}
                    >

                        <img src={img.url} alt="gallery" />

                    </div>
                ))}

            </div>

            {selectedImage && (
                <div className="image-modal" onClick={() => setSelectedImage(null)}>
                    <div className="image-modal__content" onClick={(event) => event.stopPropagation()}>
                        <button
                            className="image-modal__close"
                            onClick={() => setSelectedImage(null)}
                            aria-label="Close image"
                        >
                            ×
                        </button>
                        <img src={selectedImage.url} alt="Expanded gallery" />
                    </div>
                </div>
            )}

        </div>
    );
}