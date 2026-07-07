import { useEffect, useState } from "react";

export default function Loader({ onFinish }) {

    const [progress, setProgress] = useState(0);

    useEffect(() => {

        const interval = setInterval(() => {

            setProgress(prev => {

                if (prev >= 100) {
                    clearInterval(interval);

                    setTimeout(() => {
                        onFinish();
                    }, 500);

                    return 100;
                }

                return prev + 2;
            });

        }, 40);

        return () => clearInterval(interval);

    }, []);

    return (
        <div className="loader">

            <div className="loader-box">

                <h1>System Booting...</h1>

                <p>hold ya horses</p>

                <div className="bar">
                    <div
                        className="bar-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <p>{progress}%</p>

            </div>

        </div>
    );
}