import {
	ApiMessageResponse,
	PageResponse,
	TaskId,
	TaskQueryParams,
	TaskRequest,
	TaskResponse,
} from '@/lib/Interfaces/task_Interface';
import {
	createTaskApi,
	deleteTaskApi,
	getTaskByIdApi,
	getTasksApi,
	markTaskCompletedApi,
	updateTaskApi,
} from '@/lib/API_Folder/task_api';
import { toBearerToken } from '@/lib/Services/authentication_Services';

/**
 * Creates a new task.
 */
export async function createTask(payload: TaskRequest, accessToken?: string): Promise<TaskResponse> {
	return createTaskApi(payload, accessToken ? toBearerToken(accessToken) : undefined);
}

/**
 * Updates a task by id.
 */
export async function updateTask(taskId: TaskId, payload: TaskRequest, accessToken?: string): Promise<TaskResponse> {
	return updateTaskApi(taskId, payload, accessToken ? toBearerToken(accessToken) : undefined);
}

/**
 * Deletes a task by id.
 */
export async function deleteTask(taskId: TaskId, accessToken?: string): Promise<ApiMessageResponse> {
	return deleteTaskApi(taskId, accessToken ? toBearerToken(accessToken) : undefined);
}

/**
 * Retrieves a single task by id.
 */
export async function getTaskById(taskId: TaskId, accessToken?: string): Promise<TaskResponse> {
	return getTaskByIdApi(taskId, accessToken ? toBearerToken(accessToken) : undefined);
}

/**
 * Retrieves paginated tasks by query filters.
 */
export async function getTasks(
	params: TaskQueryParams,
	accessToken?: string,
): Promise<PageResponse<TaskResponse>> {
	return getTasksApi(params, accessToken ? toBearerToken(accessToken) : undefined);
}

/**
 * Marks a task as completed.
 */
export async function markTaskCompleted(taskId: TaskId, accessToken?: string): Promise<TaskResponse> {
	return markTaskCompletedApi(taskId, accessToken ? toBearerToken(accessToken) : undefined);
}
