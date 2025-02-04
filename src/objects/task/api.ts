import { API } from "src/api";

// Import types
import type {
  TaskPriorityType,
  TaskSizeType,
  TaskStatusType,
} from "../task/types";

const taskManagerAPI = new API({
  baseURL: import.meta.env.VITE_TASK_SERVICE_ENDPOINT,
});

export class TaskAPI {
  /**
   * Get statuses of tasks
   * @returns
   */
  static async getTasksStatuses() {
    try {
      const response = await taskManagerAPI.get<Array<TaskStatusType>>(
        `/tasks/statuses`
      );
      return response.data;
    } catch (error) {
      console.error("TaskAPI - Get tasks' statuses:", error);
      return;
    }
  }

  /**
   * Get statuses of tasks
   * @returns
   */
  static async getTasksPriorities() {
    try {
      const response = await taskManagerAPI.get<Array<TaskPriorityType>>(
        `/tasks/priorities`
      );
      return response.data;
    } catch (error) {
      console.error("TaskAPI - Get tasks' priorities:", error);
      return;
    }
  }

  /**
   * Get sizes of tasks
   * @returns
   */
  static async getTasksSizes() {
    try {
      const response = await taskManagerAPI.get<Array<TaskSizeType>>(
        `/tasks/sizes`
      );
      return response.data;
    } catch (error) {
      console.error("TaskAPI - Get tasks' sizes:", error);
      return;
    }
  }
}
