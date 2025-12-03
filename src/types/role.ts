import type { Permission } from "./permission";

// --- Interface role
export interface Role {
    id: number;
    name: string;
    permission?: Permission[];
    created_at: string;
    updated_at: string;
}

// --- Structure respons API for list Role (pagination)
export interface RoleResponse {
    current_page: number;
    data: Role[];
    last_page: number;
    total: number;
    per_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    from: number;
    to: number;
    path: string;
}

// --- Interface for request create Role
export interface RoleCreateRequest {
    name: string;
    permission_ids: number[];
}

// --- Interface for request update Role
export interface RoleUpdateRequest {
    id: number;
    name: string;
    permission_ids: number[];
}
