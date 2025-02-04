import React from "react";
import { ChevronDown } from "lucide-react";

// Import components
import {
  TaskPriorityBadge,
  TaskSizeBadge,
  TaskStatusBadge,
} from "./task-attribute-badges";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "src/components/ui/dropdown-menu";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "src/components/ui/form";

// Import states
import { useTaskState } from "src/states/task";

// Import type
import type { UseFormReturn } from "react-hook-form";

type TaskAttributesListProps = {
  defaultValue?: string;
  onSelect?: (value: any) => void;
};

type TaskAttributesListFormProps = {
  name: string;
  form: UseFormReturn;
};

/**
 * Render a priority select for task
 * @returns
 */
export function TaskPrioritySelect(props: TaskAttributesListProps) {
  const { taskPriorities } = useTaskState();
  const [value, setValue] = React.useState(
    props.defaultValue ? props.defaultValue : ""
  );

  return React.useMemo(
    () => (
      <Select
        value={value}
        onValueChange={(value) => {
          if (props.onSelect) props.onSelect(value);
          setValue(value);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Priority</SelectLabel>
            {taskPriorities &&
              taskPriorities.map((priority) => (
                <SelectItem key={priority._id} value={priority._id}>
                  <TaskPriorityBadge
                    className="cursor-pointer"
                    data={priority}
                  />
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
    [taskPriorities, value]
  );
}

/**
 * Render a status select for task form
 * @returns
 */
export function TaskPriorityFormSelect(props: TaskAttributesListFormProps) {
  const { taskPriorities } = useTaskState();

  return React.useMemo(
    () => (
      <FormField
        control={props.form.control}
        name={props.name}
        render={({ field }) => (
          <FormItem>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  {taskPriorities &&
                    taskPriorities.map((priority) => (
                      <SelectItem key={priority._id} value={priority._id}>
                        <TaskPriorityBadge
                          className="cursor-pointer"
                          data={priority}
                        />
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    [taskPriorities]
  );
}

/**
 * Render a dropdown menu of priority for task
 * @param param0
 * @returns
 */
export function TaskPriorityDropdownMenu(props: TaskAttributesListProps) {
  const { taskPriorities } = useTaskState();
  const [value, setValue] = React.useState(
    props.defaultValue ? props.defaultValue : ""
  );

  if (!Element || !taskPriorities) {
    return <p>Empty list</p>;
  }

  return React.useMemo(
    () => (
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer" asChild>
          <ChevronDown size="16px" color="gray" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={value}
            onValueChange={(value) => {
              if (props.onSelect) props.onSelect(value);
              setValue(value);
            }}
          >
            {taskPriorities.map((priority) => (
              <DropdownMenuRadioItem
                key={priority._id}
                value={priority._id}
                className="cursor-pointer"
              >
                <TaskPriorityBadge data={priority} />
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [taskPriorities, value]
  );
}

/**
 * Render a size select for task
 * @returns
 */
export function TaskSizeSelect(props: TaskAttributesListProps) {
  const { taskSizes } = useTaskState();
  const [value, setValue] = React.useState(
    props.defaultValue ? props.defaultValue : ""
  );

  return React.useMemo(
    () => (
      <Select
        value={value}
        onValueChange={(value) => {
          if (props.onSelect) props.onSelect(value);
          setValue(value);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Size</SelectLabel>
            {taskSizes &&
              taskSizes.map((size) => (
                <SelectItem key={size._id} value={size._id}>
                  <TaskSizeBadge className="cursor-pointer" data={size} />
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
    [taskSizes, value]
  );
}

/**
 * Render a status select for task form
 * @returns
 */
export function TaskSizeFormSelect(props: TaskAttributesListFormProps) {
  const { taskSizes } = useTaskState();

  return React.useMemo(
    () => (
      <FormField
        control={props.form.control}
        name={props.name}
        render={({ field }) => (
          <FormItem>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Size</SelectLabel>
                  {taskSizes &&
                    taskSizes.map((size) => (
                      <SelectItem key={size._id} value={size._id}>
                        <TaskSizeBadge className="cursor-pointer" data={size} />
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    [taskSizes]
  );
}

/**
 * Render a dropdown menu of size for task
 * @param param0
 * @returns
 */
export function TaskSizeDropdownMenu(props: TaskAttributesListProps) {
  const { taskSizes } = useTaskState();
  const [value, setValue] = React.useState(
    props.defaultValue ? props.defaultValue : ""
  );

  if (!Element || !taskSizes) {
    return <p>Empty list</p>;
  }

  return React.useMemo(
    () => (
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer" asChild>
          <ChevronDown size="16px" color="gray" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Size</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={value}
            onValueChange={(value) => {
              if (props.onSelect) props.onSelect(value);
              setValue(value);
            }}
          >
            {taskSizes.map((size) => (
              <DropdownMenuRadioItem
                key={size._id}
                value={size._id}
                className="cursor-pointer"
              >
                <TaskSizeBadge data={size} />
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [taskSizes, value]
  );
}

/**
 * Render a status select for task
 * @returns
 */
export function TaskStatusSelect(props: TaskAttributesListProps) {
  const { taskStatuses } = useTaskState();
  const [value, setValue] = React.useState(
    props.defaultValue ? props.defaultValue : ""
  );

  return React.useMemo(
    () => (
      <Select
        value={value}
        onValueChange={(value) => {
          if (props.onSelect) props.onSelect(value);
          setValue(value);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            {taskStatuses &&
              taskStatuses.map((status) => (
                <SelectItem key={status._id} value={status._id}>
                  <TaskStatusBadge className="cursor-pointer" data={status} />
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
    [taskStatuses, value]
  );
}

/**
 * Render a status select for task form
 * @returns
 */
export function TaskStatusFormSelect(props: TaskAttributesListFormProps) {
  const { taskStatuses } = useTaskState();

  return React.useMemo(
    () => (
      <FormField
        control={props.form.control}
        name={props.name}
        render={({ field }) => (
          <FormItem>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {taskStatuses &&
                    taskStatuses.map((status) => (
                      <SelectItem key={status._id} value={status._id}>
                        <TaskStatusBadge
                          className="cursor-pointer"
                          data={status}
                        />
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    [taskStatuses]
  );
}

/**
 * Render a dropdown menu of status for task
 * @param param0
 * @returns
 */
export function TaskStatusDropdownMenu(props: TaskAttributesListProps) {
  const { taskStatuses } = useTaskState();
  const [value, setValue] = React.useState(
    props.defaultValue ? props.defaultValue : ""
  );

  if (!Element || !taskStatuses) {
    return <p>Empty list</p>;
  }

  return React.useMemo(
    () => (
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer" asChild>
          <ChevronDown size="16px" color="gray" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Size</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={value}
            onValueChange={(value) => {
              if (props.onSelect) props.onSelect(value);
              setValue(value);
            }}
          >
            {taskStatuses.map((status) => (
              <DropdownMenuRadioItem
                key={status._id}
                value={status._id}
                className="cursor-pointer"
              >
                <TaskStatusBadge data={status} />
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [taskStatuses, value]
  );
}
