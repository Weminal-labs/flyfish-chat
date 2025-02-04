import { API } from "src/api";

// Import utils
import { BrowserStorageUtils } from "src/utils/browser_storage";

// Import types
import type { UserType } from "./types";
import type { TaskType, TaskModelType } from "../task/types";

type UpdateTaskType = {
  task: Partial<TaskModelType>;
  assignees?: Array<string>;
};

type CreateTaskType = {
  task: TaskModelType;
  assignees?: Array<string>;
};

const taskManagerAPI = new API({
  baseURL: import.meta.env.VITE_TASK_SERVICE_ENDPOINT,
});

const identityAPI = new API({
  baseURL: import.meta.env.VITE_IDENTITY_SERVICE_ENDPOINT,
});

export class UserAPI {
  static getLocalUser() {
    const user = BrowserStorageUtils.getItem("user") as UserType;
    if (!user) throw new Error("User isn't found in local storage");
    return user;
  }

  /**
   * Use to get a user from identity service
   * @returns
   */
  static async getUser() {
    try {
      const user = UserAPI.getLocalUser();
      const response = await identityAPI.get<UserType>(`/users/${user.id}`, {
        headers: {
          Authorization: API.generateBearerToken(API.getToken()) as string,
        },
      });
      return response.data;
    } catch (error) {
      return;
    }
  }

  /**
   * Get tasks of a user
   * @returns
   */
  static async getTasks(params?: Record<string, any>) {
    if (!params) params = {};
    if (!params.limit) params.limit = 10;
    if (!params.skip) params.skip = 0;

    try {
      const user = UserAPI.getLocalUser();
      const paramsStr = new URLSearchParams(params);
      const response = await taskManagerAPI.get<Array<TaskType>>(
        `/users/${user.id}/tasks?${paramsStr}`,
        {
          headers: {
            Authorization: API.generateBearerToken(API.getToken()) as string,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("UserAPI - Get tasks:", error);
      return;
    }
  }

  /**
   * Get a task of user by its id
   * @param taskId
   * @returns
   */
  static async getTask(taskId: string | number) {
    try {
      const user = UserAPI.getLocalUser();
      const response = await taskManagerAPI.get<TaskType>(
        `users/${user.id}/tasks/${taskId}`,
        {
          headers: {
            Authorization: API.generateBearerToken(API.getToken()) as string,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("UserAPI - Get task:", error);
      return;
    }
  }

  /**
   * Create a new task for user
   * @param task
   * @returns
   */
  static async createTask(task: TaskModelType) {
    try {
      const user = UserAPI.getLocalUser();
      const response = await taskManagerAPI.post<CreateTaskType, TaskType>(
        `/users/${user.id}/task`,
        { task },
        {
          headers: {
            Authorization: API.generateBearerToken(API.getToken()) as string,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("UserAPI - Create task:", error);
      return;
    }
  }

  /**
   * Update a task of user
   * @param id
   * @param task
   * @returns
   */
  static async updateTask(id: string, task: Partial<TaskModelType>) {
    try {
      const user = UserAPI.getLocalUser();
      const response = await taskManagerAPI.patch<UpdateTaskType, TaskType>(
        `/users/${user.id}/tasks/${id}`,
        { task },
        {
          headers: {
            Authorization: API.generateBearerToken(API.getToken()) as string,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("UserAPI - Update task:", error);
      return;
    }
  }

  /**
   * Delete a task of user
   * @param taskId
   * @returns
   */
  static async deleteTask(taskId: string) {
    try {
      const user = UserAPI.getLocalUser();
      const response = await taskManagerAPI.delete<TaskType>(
        `/users/${user.id}/tasks/${taskId}`,
        {
          headers: {
            Authorization: API.generateBearerToken(API.getToken()) as string,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("UserAPI - Delete task:", error);
      return;
    }
  }
}
