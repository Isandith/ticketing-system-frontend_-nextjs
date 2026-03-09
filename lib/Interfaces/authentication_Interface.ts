export type Role = 'ADMIN' | 'USER';

export interface LoginRequest {
	username: string;
	password: string;
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
	role?: Role | string;
}

export interface AuthResponse {
	token: string;
	tokenType: string;
	username: string;
	role: Role | string;
}

export interface ApiErrorResponse {
	timestamp?: string;
	status?: number;
	error?: string;
	message?: string;
	path?: string;
	details?: Record<string, string>;
}
