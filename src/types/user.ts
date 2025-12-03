import type { Role } from "./role";

// --- Interface User
export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    created_at: string;
    updated_at: string;
    roles?: Role[];
}

// --- Structure respons API for list user (pagination)
export interface UserResponse {
    current_page: number;
    data: User[];
    last_page: number;
    total: number;
    per_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    from: number;
    to: number;
    path: string;
}

// --- Interface for request create User
export interface UserCreateRequest {
    name: string;
    username: string;
    email: string;
    password: string;
    role_ids: number[];
}

// --- Interface for request update User
export interface UserUpdateRequest {
    id: number;
    name: string;
    username: string;
    email: string;
    password?: string; // optional if not change password
    role_ids: number[];
}
