import { getAllUsersApi } from '@/lib/API_Folder/user_api';
import { UserResponse } from '@/lib/Interfaces/user_Interface';
import { toBearerToken } from '@/lib/Services/authentication_Services';

export async function getAllUsers(accessToken?: string): Promise<UserResponse[]> {
	return getAllUsersApi(accessToken ? toBearerToken(accessToken) : undefined);
}
