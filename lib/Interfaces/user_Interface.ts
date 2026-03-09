/**
 * User record returned by user management endpoints.
 */
export interface UserResponse {
	id: number;
	username: string;
	email: string;
	role: string;
	createdAt: string;
	updatedAt: string;
}
