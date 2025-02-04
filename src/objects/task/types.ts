// Import types
import type { UserType } from "../user/types";

export type TaskModelType = {
  _id: string;
  creatorId: string;
  priorityId: string;
  statusId: string;
  sizeId: string;
  name: string;
  description: string;
  assignees: Array<string>;
  startAt: number;
  endAt: number;
  createdAt: number;
  updatedAt: number;
};

export type TaskType = Omit<
  TaskModelType,
  "creatorId" | "priorityId" | "statusId" | "sizeId"
> & {
  creator: UserType;
  priority: TaskPriorityType;
  status: TaskStatusType;
  size: TaskSizeType;
  assignees?: Array<any>;
};

export type TaskSizeModelType = {
  _id: string;
  order: number;
  name: string;
  value: string;
  createdAt: number;
  updatedAt: number;
};

export type TaskSizeType = TaskSizeModelType;

export type TaskPriorityModelType = {
  _id: string;
  order: number;
  name: string;
  value: string;
  createdAt: number;
  updatedAt: number;
};

export type TaskPriorityType = TaskPriorityModelType;

export type TaskStatusModelType = {
  _id: string;
  order: number;
  name: string;
  value: string;
  createdAt: number;
  updatedAt: number;
};

export type TaskStatusType = TaskStatusModelType;
