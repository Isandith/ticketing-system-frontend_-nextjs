import { getAllUsersApi } from '@/lib/API_Folder/user_api';
import { UserResponse } from '@/lib/Interfaces/user_Interface';
import { toBearerToken } from '@/lib/Services/authentication_Services';

/**
 * Returns all users available to the caller.
 */
export async function getAllUsers(accessToken?: string): Promise<UserResponse[]> {
	return getAllUsersApi(accessToken ? toBearerToken(accessToken) : undefined);
}
