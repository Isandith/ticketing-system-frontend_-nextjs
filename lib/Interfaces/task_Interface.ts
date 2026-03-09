export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type TaskId = number;

export interface TaskRequest {
	title: string;
	description?: string;
	status?: TaskStatus | string;
	priority?: TaskPriority | string;
	dueDate?: string;
}

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

export interface TaskQueryParams {
	userId?: number;
	status?: TaskStatus | string;
	priority?: TaskPriority | string;
	page?: number;
	size?: number;
	sortBy?: string;
	sortDirection?: 'asc' | 'desc' | string;
}

export interface ApiMessageResponse {
	message: string;
}

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
