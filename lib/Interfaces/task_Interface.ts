/**
 * Allowed task status values used by the backend API.
 */
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

/**
 * Allowed task priority values used by the backend API.
 */
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Identifier type used by task endpoints.
 */
export type TaskId = number;

/**
 * Request body for creating or updating a task.
 */
export interface TaskRequest {
	title: string;
	description?: string;
	status?: TaskStatus | string;
	priority?: TaskPriority | string;
	dueDate?: string;
}

/**
 * Task record returned by the backend API.
 */
export interface TaskResponse {
	id: number;
	title: string;
	description: string;
	status: TaskStatus | string;
	priority: TaskPriority | string;
	dueDate: string;
	createdAt: string;
	updatedAt: string;
	userId: number;
}

/**
 * Query parameters accepted by the paginated task list endpoint.
 */
export interface TaskQueryParams {
	userId?: number;
	status?: TaskStatus | string;
	priority?: TaskPriority | string;
	page?: number;
	size?: number;
	sortBy?: string;
	sortDirection?: 'asc' | 'desc' | string;
}

/**
 * Generic response wrapper for endpoints that only return a message.
 */
export interface ApiMessageResponse {
	message: string;
}

/**
 * Generic paginated response structure returned by Spring Data endpoints.
 */
export interface PageResponse<T> {
	content: T[];
	number: number;
	size: number;
	totalElements: number;
	totalPages: number;
	numberOfElements?: number;
	first?: boolean;
	last?: boolean;
	empty?: boolean;
}
