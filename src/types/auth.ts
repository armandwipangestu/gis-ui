import type { User } from "./user";

// --- Type permissions (key-value boolean map)
export type Permissions = {
    [key: string]: boolean;
};

// --- Interface Credentials (payload login)
export interface Credentials {
    username: string;
    password: string;
}

// --- Interface AuthState (state authentication to client)
export interface AuthState {
    user: User | null;
    token: string;
    permissions: Permissions;
    // Function to process login, Return `Promise<void>` so that can be `await` at layer call
    login: (credentials: Credentials) => Promise<void>;
    // Function to delete state authentication (clear `user.token` and `permissions`)
    logout: () => void;
}
