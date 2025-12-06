import { useEffect } from "react";
import { useMap } from "react-leaflet";

// Interface RecenterOnProps (type props for center & zoom)
interface RecenterOnProps {
    center: [number, number];
    zoom: number;
}

export function RecenterOnProps({ center, zoom }: RecenterOnProps) {
    const map = useMap();

    useEffect(() => {
        // setView without animation so that responsive and not distract the interaction
        map.setView(center, zoom, { animate: false });
    }, [center[0], center[1], zoom, map]); // Dependency used coordinate per index so that re-rendering only occurs when the value changes.

    return null;
}
