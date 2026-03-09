import {
	AuthResponse,
	LoginRequest,
	RegisterRequest,
} from '@/lib/Interfaces/authentication_Interface';
import { apiClient, extractApiError } from '@/lib/API_Folder/api_client';

const AUTH_BASE_PATH = '/api/v1/auth';

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

export function loginApi(payload: LoginRequest): Promise<AuthResponse> {
	return authPost('/login', payload);
}

export function registerApi(payload: RegisterRequest): Promise<AuthResponse> {
	return authPost('/register', payload);
}

export function registerAdminApi(payload: RegisterRequest, bearerToken: string): Promise<AuthResponse> {
	return authPost('/register-admin', payload, bearerToken);
}
