import { apiClient, extractApiError } from '@/lib/API_Folder/api_client';
import {
	ApiMessageResponse,
	PageResponse,
	TaskId,
	TaskQueryParams,
	TaskRequest,
	TaskResponse,
} from '@/lib/Interfaces/task_Interface';

const TASK_BASE_PATH = '/api/v1/tasks';

/**
 * Builds query string parameters for the task list endpoint.
 */
function buildQuery(params: TaskQueryParams): string {
	const searchParams = new URLSearchParams();

	if (params.userId !== undefined) searchParams.set('userId', String(params.userId));
	if (params.status) searchParams.set('status', params.status);
	if (params.priority) searchParams.set('priority', params.priority);
	if (params.page !== undefined) searchParams.set('page', String(params.page));
	if (params.size !== undefined) searchParams.set('size', String(params.size));
	if (params.sortBy) searchParams.set('sortBy', params.sortBy);
	if (params.sortDirection) searchParams.set('sortDirection', params.sortDirection);

	const queryString = searchParams.toString();
	return queryString ? `?${queryString}` : '';
}

/**
 * Creates a new task.
 */
export async function createTaskApi(payload: TaskRequest, bearerToken?: string): Promise<TaskResponse> {
	try {
		const response = await apiClient.post<TaskResponse>(TASK_BASE_PATH, payload, {
			headers: bearerToken ? { Authorization: bearerToken } : undefined,
		});
		return response.data;
	} catch (error) {
		throw extractApiError(error);
	}
}

/**
 * Updates an existing task by id.
 */
export async function updateTaskApi(taskId: TaskId, payload: TaskRequest, bearerToken?: string): Promise<TaskResponse> {
	try {
		const response = await apiClient.put<TaskResponse>(`${TASK_BASE_PATH}/${taskId}`, payload, {
			headers: bearerToken ? { Authorization: bearerToken } : undefined,
		});
		return response.data;
	} catch (error) {
		throw extractApiError(error);
	}
}

/**
 * Deletes a task by id.
 */
export async function deleteTaskApi(taskId: TaskId, bearerToken?: string): Promise<ApiMessageResponse> {
	try {
		const response = await apiClient.delete<ApiMessageResponse>(`${TASK_BASE_PATH}/${taskId}`, {
			headers: bearerToken ? { Authorization: bearerToken } : undefined,
		});
		return response.data;
	} catch (error) {
		throw extractApiError(error);
	}
}

/**
 * Returns a single task by id.
 */
export async function getTaskByIdApi(taskId: TaskId, bearerToken?: string): Promise<TaskResponse> {
	try {
		const response = await apiClient.get<TaskResponse>(`${TASK_BASE_PATH}/${taskId}`, {
			headers: bearerToken ? { Authorization: bearerToken } : undefined,
		});
		return response.data;
	} catch (error) {
		throw extractApiError(error);
	}
}

/**
 * Returns a paginated list of tasks using supplied filters.
 */
export async function getTasksApi(params: TaskQueryParams, bearerToken?: string): Promise<PageResponse<TaskResponse>> {
	try {
		const response = await apiClient.get<PageResponse<TaskResponse>>(
			`${TASK_BASE_PATH}${buildQuery(params)}`,
			{ headers: bearerToken ? { Authorization: bearerToken } : undefined },
		);
		return response.data;
	} catch (error) {
		throw extractApiError(error);
	}
}

/**
 * Marks a task as completed.
 */
export async function markTaskCompletedApi(taskId: TaskId, bearerToken?: string): Promise<TaskResponse> {
	try {
		const response = await apiClient.patch<TaskResponse>(`${TASK_BASE_PATH}/${taskId}/complete`, undefined, {
			headers: bearerToken ? { Authorization: bearerToken } : undefined,
		});
		return response.data;
	} catch (error) {
		throw extractApiError(error);
	}
}
