import { useState, useEffect } from "react";

export function useMediaQuery(query: string) {
    const [matches, setMathces] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return; // SSR-safe
        const mql = window.matchMedia(query);

        const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
            setMathces(
                "matches" in e ? e.matches : (e as MediaQueryList).matches
            );
        };

        // Initialize
        onChange(mql);

        // Subscribe
        if (mql.addEventListener) {
            mql.addEventListener("change", onChange as any);
        } else {
            mql.addListener(onChange as any);
        }

        return () => {
            if (mql.removeEventListener) {
                mql.removeEventListener("change", onChange as any);
            } else {
                mql.removeEventListener(onChange as any);
            }
        };
    }, [query]);

    return matches;
}
