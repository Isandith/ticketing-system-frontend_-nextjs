import {
	AuthResponse,
	LoginRequest,
	RegisterRequest,
} from '@/lib/Interfaces/authentication_Interface';
import {
	loginApi,
	registerAdminApi,
	registerApi,
} from '@/lib/API_Folder/authentication_api';

/**
 * Normalizes a raw token string to the `Bearer <token>` format.
 */
function toBearerToken(token: string): string {
	return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
}

/**
 * Authenticates a user with username and password.
 */
export async function login(payload: LoginRequest): Promise<AuthResponse> {
	return loginApi(payload);
}

/**
 * Registers a standard user account.
 */
export async function register(payload: RegisterRequest): Promise<AuthResponse> {
	return registerApi(payload);
}

/**
 * Registers an admin account using an authorized access token.
 */
export async function registerAdmin(payload: RegisterRequest, accessToken: string): Promise<AuthResponse> {
	return registerAdminApi(payload, toBearerToken(accessToken));
}

export { toBearerToken };
