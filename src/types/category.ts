import type { Map } from "./map";

// --- Interface Category
export interface Category {
    id: number;
    image: string;
    name: string;
    slug: string;
    description: string;
    color: string;
    Maps?: Map[]; // relationship one-to-many to Map (optional for public response)
    created_at: string;
    updated_at: string;
}

// --- Structure respons API for list Category (pagination)
export interface CategoriesResponse {
    current_page: number;
    data: Category[];
    last_page: number;
    total: number;
    per_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    from: number;
    to: number;
    path: string;
}

// --- Interface for request create Category
export interface CategoryCreateRequest {
    image: File | null; // File upload (form-data)
    name: string;
    description: string;
    color: string; // example: "#000000"
}

// --- Interface for request update Category
export interface CategoryUpdateRequest {
    id: number;
    image?: File | null; // optional: include only if want to change image
    name: string;
    description: string;
    color: string;
}
