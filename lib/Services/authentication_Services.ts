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

function toBearerToken(token: string): string {
	return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
	return loginApi(payload);
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
	return registerApi(payload);
}

export async function registerAdmin(payload: RegisterRequest, accessToken: string): Promise<AuthResponse> {
	return registerAdminApi(payload, toBearerToken(accessToken));
}

export { toBearerToken };
