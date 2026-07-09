import { useEffect, useRef } from "react";

/**
 * Custom hook for live polling of data
 * @param {Function} fetchFn - The async function to call for fetching data
 * @param {number} interval - Polling interval in milliseconds (default: 10000ms)
 */
export function useLiveUpdate(fetchFn, interval = 10000) {

    const latestFetchRef = useRef(fetchFn);

    useEffect(() => {
        latestFetchRef.current = fetchFn;
    }, [fetchFn]);

    useEffect(() => {
        let active = true;
        let timeoutId;

        const run = async () => {
            if (!active) return;

            try {
                await latestFetchRef.current();
            } catch (error) {
                console.error("Live update failed:", error);
            }

            if (!active) return;
            timeoutId = setTimeout(run, interval);
        };

        run();

        return () => {
            active = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [interval]);

}
