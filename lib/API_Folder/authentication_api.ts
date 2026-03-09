import {
	AuthResponse,
	LoginRequest,
	RegisterRequest,
} from '@/lib/Interfaces/authentication_Interface';
import { apiClient, extractApiError } from '@/lib/API_Folder/api_client';

const AUTH_BASE_PATH = '/api/v1/auth';

/**
 * Performs an authentication POST request under the auth API path.
 */
async function authPost(
	path: string,
	body: LoginRequest | RegisterRequest,
	bearerToken?: string,
): Promise<AuthResponse> {
	try {
		const response = await apiClient.post<AuthResponse>(`${AUTH_BASE_PATH}${path}`, body, {
			headers: bearerToken ? { Authorization: bearerToken } : undefined,
		});
		return response.data;
	} catch (error) {
		throw extractApiError(error);
	}
}

/**
 * Calls the backend login endpoint.
 */
export function loginApi(payload: LoginRequest): Promise<AuthResponse> {
	return authPost('/login', payload);
}

/**
 * Calls the backend user registration endpoint.
 */
export function registerApi(payload: RegisterRequest): Promise<AuthResponse> {
	return authPost('/register', payload);
}

/**
 * Calls the backend admin registration endpoint with authorization.
 */
export function registerAdminApi(payload: RegisterRequest, bearerToken: string): Promise<AuthResponse> {
	return authPost('/register-admin', payload, bearerToken);
}
