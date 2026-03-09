/**
 * Supported backend roles used by authentication endpoints.
 */
export type Role = 'ADMIN' | 'USER';

/**
 * Credentials required for login.
 */
export interface LoginRequest {
	username: string;
	password: string;
}

/**
 * Payload for user or admin registration.
 */
export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
	role?: Role | string;
}

/**
 * Authentication response containing JWT information and user identity.
 */
export interface AuthResponse {
	token: string;
	tokenType: string;
	username: string;
	role: Role | string;
}

/**
 * Standardized API error payload returned by backend error handlers.
 */
export interface ApiErrorResponse {
	timestamp?: string;
	status?: number;
	error?: string;
	message?: string;
	path?: string;
	details?: Record<string, string>;
}
