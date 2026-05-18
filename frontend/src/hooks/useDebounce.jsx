import { useEffect, useState } from "react";

// Concept: Debouncing
// If a user types "React" letter by letter: R - E - A - C - T
// We do NOT want to send 5 API requests to our backend instantly. 
// useDebounce waits until the user STOPS typing for a specific delay (e.g. 500ms) before returning the final text.

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set a timer to update the debounced value after 'delay' milliseconds
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function: If the user types another letter before 'delay' finishes, 
        // we clear the old timer and start a new one!
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Only re-run the effect if value or delay changes

    return debouncedValue;
};

export default useDebounce;
