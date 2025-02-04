// Import types
import type {
  TaskType,
  TaskModelType,
  TaskPriorityType,
  TaskSizeType,
  TaskStatusType,
} from "src/objects/task/types";

export class TaskUtils {
  /**
   * Get task by its `id`
   * @param tasks
   * @param id
   * @returns
   */
  static getTaskById(tasks: Array<TaskType> | null, id: string) {
    if (!tasks) return null;
    return tasks.find((task) => task._id === id);
  }

  /**
   * Get attribute in attributes list of task by `name`
   * @param attributes
   * @param name
   * @returns
   */
  static getTaskAttributeByName(attributes: Array<any> | null, name: string) {
    if (!attributes) return null;
    return attributes.find((attribute) => attribute.name === name);
  }

  /**
   * Get attribute in attributes list of task by `id`
   * @param attributes
   * @param name
   * @returns
   */
  static getTaskAttributeById(attributes: Array<any> | null, id: string) {
    if (!attributes) return null;
    return attributes.find((attribute) => attribute._id === id);
  }

  /**
   * Get attribute in attributes list of task by `value`
   * @param attributes
   * @param name
   * @returns
   */
  static getTaskAttributeByValue(attributes: Array<any> | null, value: string) {
    if (!attributes) return null;
    return attributes.find((attribute) => attribute.value === value);
  }

  /**
   * Get color by status
   * @param status
   * @returns
   */
  static getStatusColor(status: TaskStatusType | string) {
    let result = "";
    let value = "";

    if (typeof status === "string") value = status;
    else value = status.value;

    switch (value) {
      case "not_started": {
        result = `border-gray-400 bg-gray-100`;
        break;
      }

      case "considering": {
        result = `border-blue-700 bg-blue-100`;
        break;
      }

      case "bug": {
        result = `border-red-700 bg-red-100`;
        break;
      }

      case "drop": {
        result = `border-orange-700 bg-orange-100`;
        break;
      }

      case "done": {
        result = `border-green-700 bg-green-100`;
        break;
      }

      case "in_process": {
        result = `border-yellow-700 bg-yellow-100`;
        break;
      }
    }

    return result;
  }

  /**
   * Get background & text color of Priority
   * @param target
   * @returns
   */
  static getPriorityColor(target?: TaskType | TaskPriorityType | null) {
    let result = "";
    let value = "";

    if (!target) return result;
    if ((target as TaskType).priority)
      value = (target as TaskType).priority.value;
    if ((target as TaskPriorityType).value)
      value = (target as TaskPriorityType).value;

    switch (value) {
      case "p0": {
        result = `bg-red-700 text-white`;
        break;
      }

      case "p1": {
        result = `bg-red-500 text-white`;
        break;
      }

      case "p2": {
        result = `bg-orange-500 text-white`;
        break;
      }

      case "p3": {
        result = `bg-yellow-400 text-white`;
        break;
      }

      case "p4": {
        result = `bg-green-500 text-white`;
        break;
      }
    }

    return result;
  }

  /**
   * Get outline / borer & text color of Size
   * @param target
   * @returns
   */
  static getSizeColor(target?: TaskType | TaskSizeType | null) {
    let result = "";
    let value = "";

    if (!target) return result;
    if ((target as TaskType).size) value = (target as TaskType).size.value;
    if ((target as TaskSizeType).value) value = (target as TaskSizeType).value;

    switch (value) {
      case "xxs": {
        result = `bg-lime-50 border-lime-700 text-lime-700`;
        break;
      }

      case "xs": {
        result = `bg-green-50 border-green-700 text-green-700`;
        break;
      }

      case "s": {
        result = `bg-teal-50 border-teal-700 text-teal-700`;
        break;
      }

      case "m": {
        result = `bg-gray-50 border-gray-400 text-gray-800`;
        break;
      }

      case "l": {
        result = `bg-blue-50 border-blue-600 text-blue-600`;
        break;
      }

      case "xl": {
        result = `bg-pink-50 border-pink-700 text-pink-700`;
        break;
      }

      case "xxl": {
        result = `bg-purple-50 border-purple-800 text-purple-800`;
        break;
      }
    }

    return result;
  }

  /**
   * Get start and end date as string format
   * @param task
   * @returns
   */
  static getStartEndDateStr(task?: TaskType | null) {
    if (!task) return;

    let startStr = new Date(task.startAt).toDateString();
    let endStr = new Date(task.endAt).toDateString();

    return `${startStr} - ${endStr}`;
  }

  static toModel(task?: TaskType) {
    if (!task) return;

    let taskModel = { ...task };

    // Add some fields
    (taskModel as unknown as TaskModelType).creatorId = "";
    (taskModel as unknown as TaskModelType).sizeId = taskModel.size._id;
    (taskModel as unknown as TaskModelType).priorityId = taskModel.priority._id;
    (taskModel as unknown as TaskModelType).statusId = taskModel.status._id;

    // Delete some fields
    delete (taskModel as Partial<TaskType>).priority;
    delete (taskModel as Partial<TaskType>).size;
    delete (taskModel as Partial<TaskType>).status;
    delete (taskModel as Partial<TaskType>).creator;

    return taskModel;
  }
}
