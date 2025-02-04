import { create } from "zustand";

// Import utils
import { OtherUtils } from "src/utils/other";

// Import types
import type {
  TaskType,
  TaskPriorityType,
  TaskSizeType,
  TaskStatusType,
} from "src/objects/task/types";

type TaskState = {
  currentTask: TaskType | null;
  tasks: Array<TaskType> | null;
  tasksByStatus: Map<string, Array<TaskType> | null> | null;
  taskStatuses: Array<TaskStatusType> | null;
  taskPriorities: Array<TaskPriorityType> | null;
  taskSizes: Array<TaskSizeType> | null;
  isResponding: boolean;
};

type TaskActions = {
  // For task
  setCurrentTask(task: TaskType | null): void;
  setTasks(tasks: Array<TaskType> | null): void;
  addTasks(tasks: Array<TaskType> | null): void;
  addTask(task: TaskType): void;
  addTaskToGroup(groupName: string, task: TaskType | string): void;
  updateTask(task: TaskType): void;
  deleteTaskFromGroup(task: TaskType | string): void;
  deteteTask(task: TaskType): void;
  updateIsResponding(status?: boolean): void;
  clearTasks(): void;

  // For status of task
  setTaskStatuses(statuses?: Array<TaskStatusType> | null): void;

  // For priority of task
  setTaskPriorities(statuses?: Array<TaskPriorityType> | null): void;

  // For size of task
  setTaskSizes(statuses?: Array<TaskSizeType> | null): void;
};

/**
 * Use this function to add tasks to a group
 * @param tasksGroups
 * @param tasks
 */
function addTasksToGroupByOrder(
  tasksGroups: Map<string, Array<TaskType> | null>,
  tasks: Array<TaskType>
) {
  for (const task of tasks) {
    // Get taskList that is stored in Map
    let taskList = tasksGroups.get(task.status.value);

    // If taskList is null, create new list
    if (!taskList) {
      taskList = [];
      tasksGroups.set(task.status.value, taskList);
    }

    // Append to task list by reference
    if (taskList.length === 0) {
      taskList.push(task);
    }
    // Add to list by order
    else {
      let i = 0;
      while (true) {
        // If new task has priority greater than the current task.
        if (task.priority.order > taskList[i].priority.order) {
          if (i === taskList.length - 1) {
            taskList.push(task);
            break;
          }
          i++;
          continue;
        }

        // If new task has priority equal to the current task.
        if (task.priority.order === taskList[i].priority.order) {
          // If new task has size greater than the current task.
          if (task.size.order > taskList[i].size.order) {
            if (i === taskList.length - 1) {
              taskList.push(task);
              break;
            }
            i++;
            continue;
          }

          // If new task has size equal to or less than the current task.
          taskList.splice(i, 0, task);
          break;
        }

        // If new task has size less than the current task.
        taskList.splice(i, 0, task);
        break;
      }
    }
  }
}

/**
 * Use this function to add a task to a group
 * @param tasksGroups
 * @param task
 */
function addTaskToGroupByOrder(
  tasksGroups: Map<string, Array<TaskType> | null>,
  task: TaskType
) {
  // Get taskList that is stored in Map
  let taskList = tasksGroups.get(task.status.value);

  // If taskList is null, create new list
  if (!taskList) {
    taskList = [];
    tasksGroups.set(task.status.value, taskList);
  }

  if (taskList.length === 0) {
    taskList.push(task);
    return;
  }

  let i = 0;
  while (true) {
    // If new task has priority greater than the current task.
    if (task.priority.order > taskList[i].priority.order) {
      if (i === taskList.length - 1) {
        taskList.push(task);
        break;
      }
      i++;
      continue;
    }

    // If new task has priority equal to the current task.
    if (task.priority.order === taskList[i].priority.order) {
      // If new task has size greater than the current task.
      if (task.size.order > taskList[i].size.order) {
        if (i === taskList.length - 1) {
          taskList.push(task);
          break;
        }
        i++;
        continue;
      }

      // If new task has size equal to or less than the current task.
      taskList.splice(i, 0, task);
      break;
    }

    // If new task has size less than the current task.
    taskList.splice(i, 0, task);
    break;
  }
}

/**
 * Use this function to delete a task from a list.
 * @param list
 * @param task
 */
function deleteTaskFromList(list: Array<TaskType>, task: TaskType | string) {
  let taskId;

  if (typeof task === "string") {
    taskId = task;
  } else {
    taskId = task._id;
  }

  // Find index
  const taskIndex = list.findIndex((task) => task._id === taskId);

  // Delete
  list.splice(taskIndex, 1);

  return list;
}

/**
 * Use this function to remove a task from a group
 * @param tasksGroups
 * @param task
 */
function deleteTaskFromGroup(
  groupName: string,
  tasksGroups: Map<string, Array<TaskType> | null>,
  task: TaskType
) {
  const taskList = tasksGroups.get(groupName);

  if (!taskList) {
    console.error(`The group ${groupName} doesn't exist`);
    return;
  }

  // Delete task
  deleteTaskFromList(taskList, task);
}

const initialState = {
  currentTask: null,
  tasks: null,
  tasksByStatus: null,
  taskStatuses: null,
  taskPriorities: null,
  taskSizes: null,
  isResponding: false,
};

export const useTaskState = create<TaskState & TaskActions>((set) => {
  return {
    ...initialState,
    updateIsResponding(status?: boolean) {
      set((state) => ({ ...state, isResponding: Boolean(status) }));
    },

    setCurrentTask(task) {
      set((state) => {
        return { ...state, currentTask: task };
      });
    },

    setTasks(tasks) {
      set((state) => {
        if (state.taskStatuses && !state.tasksByStatus) {
          state.taskStatuses.sort((a, b) => a.order - b.order);

          state.tasksByStatus = new Map<string, Array<TaskType> | null>(
            state.taskStatuses.map((status) => [status.value, null])
          );
        }

        // If task and state.tasksByStatus are not null,
        // classify tasks with status
        if (tasks && state.tasksByStatus)
          addTasksToGroupByOrder(state.tasksByStatus, tasks);

        return { ...state, tasks: tasks, tasksByStatus: state.tasksByStatus };
      });
    },

    addTasks(tasks) {
      set((state) => {
        if (!tasks) return state;

        // Add tasks to global tasks
        if (state.tasks) state.tasks.concat(tasks);

        // If task and state.tasksByStatus are not null,
        // classify tasks with status
        if (tasks && state.tasksByStatus)
          addTasksToGroupByOrder(state.tasksByStatus, tasks);

        return {
          ...state,
          tasks: state.tasks,
          tasksByStatus: state.tasksByStatus,
        };
      });
    },

    addTask(task: TaskType) {
      set((state) => {
        if (!state.tasks) state.tasks = [];

        // Push to global tasks
        state.tasks.push(task);

        // Add to group
        if (state.tasksByStatus)
          addTaskToGroupByOrder(state.tasksByStatus, task);

        return { ...state, tasks: state.tasks };
      });
    },

    addTaskToGroup(task: TaskType | string) {
      set((state) => {
        if (!state.tasks) return state;

        let _task;
        if (typeof task === "string") {
          _task = state.tasks.find((t) => t._id === task);
        }

        if (!_task) return state;
        if (!state.tasksByStatus) return state;

        // Add task to group
        addTaskToGroupByOrder(state.tasksByStatus, _task);

        return { ...state, tasksByStatus: state.tasksByStatus };
      });
    },

    updateTask(task: TaskType) {
      set((state) => {
        if (!state.tasks) return state;
        if (!task) return state;

        const oldTaskIndex = state.tasks.findIndex((t) => t._id === task._id);

        // If new task in another group, change this new task group
        if (state.tasksByStatus) {
          // Delete from old group
          deleteTaskFromGroup(
            state.tasks[oldTaskIndex].status.value,
            state.tasksByStatus,
            state.tasks[oldTaskIndex]
          );

          // Add to new group
          addTaskToGroupByOrder(state.tasksByStatus, task);
        }

        // Update in global tasks
        // We don't need to update task in group because
        // group is a list of references like global tasks.
        // So if we change the task in global list by its reference,
        // the actual task is changed.
        OtherUtils.replaceAt(state.tasks, oldTaskIndex, task);

        return {
          ...state,
          tasks: state.tasks,
          tasksByStatus: state.tasksByStatus,
        };
      });
    },

    deleteTaskFromGroup(task: TaskType | string) {
      set((state) => {
        if (!state.tasks) return state;

        let _task;
        if (typeof task === "string") {
          _task = state.tasks.find((t) => t._id === task);
        }

        if (!_task) return state;

        // Delete from group
        if (state.tasksByStatus)
          deleteTaskFromGroup(_task.status.value, state.tasksByStatus, _task);

        return { ...state, tasksByStatus: state.tasksByStatus };
      });
    },

    deteteTask(task: TaskType) {
      set((state) => {
        if (!state.tasks) return state;

        // Delete from global store
        deleteTaskFromList(state.tasks, task);

        // Delete from group to completely delete task
        if (state.tasksByStatus)
          deleteTaskFromGroup(task.status.value, state.tasksByStatus, task);

        return {
          ...state,
          tasks: state.tasks,
          tasksByStatus: state.tasksByStatus,
        };
      });
    },

    clearTasks() {
      set((state) => {
        return {
          ...state,
          ...initialState,
          taskSizes: state.taskSizes,
          taskPriorities: state.taskPriorities,
          taskStatuses: state.taskStatuses,
        };
      });
    },

    // For status of task
    setTaskStatuses(statuses: Array<TaskStatusType> | null) {
      set((state) => {
        return { ...state, taskStatuses: statuses };
      });
    },

    // For priority of task
    setTaskPriorities(priorities: Array<TaskPriorityType> | null) {
      set((state) => {
        return { ...state, taskPriorities: priorities };
      });
    },

    // For size of task
    setTaskSizes(sizes: Array<TaskSizeType> | null) {
      set((state) => {
        return { ...state, taskSizes: sizes };
      });
    },
  };
});
