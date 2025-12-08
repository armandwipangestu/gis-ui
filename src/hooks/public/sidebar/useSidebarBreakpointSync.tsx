import { useEffect } from "react";
import { useMediaQuery } from "./useMediaQuery";
// import useSidebarStore from zustand (action applyBreakpoint for open/close sidebar based on screen)
import { useSidebarStore } from "../../../stores/sidebar";

// Breakpoint LG (1024px) as default
const LG_UP = "(min-width: 1024px)";

export function useSidebarBreakpointSync(query: string = LG_UP) {
    // Detection similarity CSS media query
    const isDesktop = useMediaQuery(query);

    // Get action applyBreakpoint from Zustand
    const applyBreakpoint = useSidebarStore((s) => s.applyBreakpoint);

    useEffect(() => {
        // Apply breakpoint (open/close sidebar based on screen)
        applyBreakpoint(isDesktop);
    }, [isDesktop, applyBreakpoint]);

    return isDesktop;
}
