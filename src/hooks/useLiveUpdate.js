import { useEffect } from "react";

/**
 * Custom hook for live polling of data
 * @param {Function} fetchFn - The async function to call for fetching data
 * @param {number} interval - Polling interval in milliseconds (default: 10000ms)
 */
export function useLiveUpdate(fetchFn, interval = 10000) {

    useEffect(() => {

        // Call immediately on mount
        fetchFn();

        // Set up polling interval
        const timer = setInterval(() => {
            fetchFn();
        }, interval);

        // Cleanup on unmount
        return () => clearInterval(timer);

    }, [fetchFn, interval]);

}
