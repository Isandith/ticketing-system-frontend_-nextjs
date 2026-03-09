import { apiClient, extractApiError } from '@/lib/API_Folder/api_client';
import { UserResponse } from '@/lib/Interfaces/user_Interface';

const USER_BASE_PATH = '/api/v1/users';

export async function getAllUsersApi(bearerToken?: string): Promise<UserResponse[]> {
	try {
		const response = await apiClient.get<UserResponse[]>(USER_BASE_PATH, {
			headers: bearerToken ? { Authorization: bearerToken } : undefined,
		});
		return response.data;
	} catch (error) {
		throw extractApiError(error);
	}
}
