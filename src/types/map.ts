// --- Interface Map
export interface Map {
    id: number;
    category_id: number;
    image: string;
    name: string;
    slug: string;
    description: string;
    address: string;
    latitude: string;
    longitude: string;
    geometry: string;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
}

// --- Structure respons API for list Map (pagination)
export interface MapsResponse {
    current_page: number;
    data: Map[];
    last_page: number;
    total: number;
    per_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    from: number;
    to: number;
    path: string;
}

// --- Interface for request create Map
export interface MapCreateRequest {
    image: File | null;
    name: string;
    description: string;
    address: string;
    latitude: string;
    longitude: string;
    geometry?: string;
    status?: "active" | "inactive";
    category_id: number;
}

// --- Interface for request update Map
export interface MapUpdateRequest {
    id: number;
    image?: File | null;
    name: string;
    description: string;
    address: string;
    latitude: string;
    longitude: string;
    geometry?: string;
    status?: "active" | "inactive";
    category_id: number;
}
