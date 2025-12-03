// --- Interface Setting
export interface Setting {
    id: number;
    title: string;
    description: string;
    map_center_lat: string; // save as string to save when parsing to number
    map_center_lng: string; // save as string to save when parsing to number
    map_zoom: number; // integer (mis. 0..22)
    village_boundary: string; // GeoJSON dalam string (FE bebas parse/validation)
    created_at: string;
    updated_at: string;
}

// --- Interface for request update Setting (JSON body)
export interface SettingUpdateRequest {
    title: string;
    description: string;
    map_center_lat: string; // send as string, backend who validate/convertion
    map_center_lng: string; // send as string, backend who validate/convertion
    map_zoom: number; // example: 13, 14, 15
    village_boundary: string; // send as string GeoJSON (not object)
}
