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

export async function createTask(payload: TaskRequest, accessToken?: string): Promise<TaskResponse> {
	return createTaskApi(payload, accessToken ? toBearerToken(accessToken) : undefined);
}

export async function updateTask(taskId: TaskId, payload: TaskRequest, accessToken?: string): Promise<TaskResponse> {
	return updateTaskApi(taskId, payload, accessToken ? toBearerToken(accessToken) : undefined);
}

export async function deleteTask(taskId: TaskId, accessToken?: string): Promise<ApiMessageResponse> {
	return deleteTaskApi(taskId, accessToken ? toBearerToken(accessToken) : undefined);
}

export async function getTaskById(taskId: TaskId, accessToken?: string): Promise<TaskResponse> {
	return getTaskByIdApi(taskId, accessToken ? toBearerToken(accessToken) : undefined);
}

export async function getTasks(
	params: TaskQueryParams,
	accessToken?: string,
): Promise<PageResponse<TaskResponse>> {
	return getTasksApi(params, accessToken ? toBearerToken(accessToken) : undefined);
}

export async function markTaskCompleted(taskId: TaskId, accessToken?: string): Promise<TaskResponse> {
	return markTaskCompletedApi(taskId, accessToken ? toBearerToken(accessToken) : undefined);
}
