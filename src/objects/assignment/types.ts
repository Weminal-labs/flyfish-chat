export type AssignmentModelType = {
  _id: string;
  taskId: string;
  assignees: Array<string>;
  createdAt: number;
  updatedAt: number;
};

export type NewAssignmentType = {
  taskId: string;
  assignees: Array<string>;
};
