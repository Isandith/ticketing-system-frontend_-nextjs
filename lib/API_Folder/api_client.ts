import axios, { AxiosError } from 'axios';
import { storage } from '@/lib/storage';
import { ApiErrorResponse } from '@/lib/Interfaces/authentication_Interface';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
	throw new Error('Missing NEXT_PUBLIC_API_BASE_URL. Configure it in .env.local');
}

/**
 * Shared Axios client configured with base URL and JSON headers.
 */
export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

apiClient.interceptors.request.use((config) => {
	const token = storage.getAccessToken();
	if (token && !config.headers.Authorization) {
		config.headers.Authorization = token;
	}
	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (axios.isAxiosError(error) && error.response?.status === 401 && typeof window !== 'undefined') {
			storage.clearUser();
			const currentPath = window.location.pathname;
			if (currentPath !== '/login' && currentPath !== '/register') {
				window.location.replace('/login');
			}
		}

		return Promise.reject(error);
	},
);

/**
 * Maps unknown API errors into a normalized Error instance for UI handling.
 */
export function extractApiError(error: unknown): Error {
	if (!axios.isAxiosError(error)) {
		return new Error('Request failed');
	}

	const axiosError = error as AxiosError<ApiErrorResponse>;
	const payload = axiosError.response?.data;
	const message =
		payload?.message ||
		payload?.error ||
		(payload?.details ? Object.values(payload.details).join(', ') : '') ||
		axiosError.message ||
		'Request failed';

	return new Error(message);
}
