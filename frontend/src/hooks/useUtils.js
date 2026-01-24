import { useCallback, useRef } from 'react';

/**
 * Debounce hook: Delays execution of a function until after 'wait' milliseconds 
 * have elapsed since the last time the debounced function was invoked.
 */
export function useDebounce(func, wait) {
    const timeout = useRef();

    return useCallback((...args) => {
        const later = () => {
            clearTimeout(timeout.current);
            func(...args);
        };

        clearTimeout(timeout.current);
        timeout.current = setTimeout(later, wait);
    }, [func, wait]);
}

/**
 * Throttle hook: Ensures a function is called at most once every 'limit' milliseconds.
 */
export function useThrottle(func, limit) {
    const inThrottle = useRef();

    return useCallback((...args) => {
        if (!inThrottle.current) {
            func(...args);
            inThrottle.current = true;
            setTimeout(() => {
                inThrottle.current = false;
            }, limit);
        }
    }, [func, limit]);
}
