import React from "react";
import { PencilLine } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";

// Import components
import LoadingSpinner from "src/components/loading-spinner";
import { DatePickerForm } from "src/components/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "src/components/ui/form";
import {
  TaskPriorityFormSelect,
  TaskSizeFormSelect,
  TaskStatusFormSelect,
} from "./task-attributes-select-list";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { Button } from "src/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";

// Import hooks
import { useAuth } from "src/hooks/use-auth";

// Import objects
import { TaskUtils } from "src/objects/task/utils";
import { UserAPI } from "src/objects/user/api";

// Import states
import { useTaskState } from "src/states/task";

type TaskFormDialogProps = {
  TriggerContent: (() => JSX.Element) | JSX.Element;
};

/**
 * Use to render a task dialog form
 * @param props
 * @returns
 */
export default function TaskFormDialog({
  TriggerContent,
}: TaskFormDialogProps) {
  const { currentTask, isResponding, addTask, updateTask, updateIsResponding } =
    useTaskState();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm<any>({
    defaultValues: {
      priorityId: currentTask ? currentTask.priority._id : "",
      statusId: currentTask ? currentTask.status._id : "",
      sizeId: currentTask ? currentTask.size._id : "",
      startAt: currentTask ? currentTask.startAt : Date.now(),
      endAt: currentTask ? currentTask.endAt : Date.now(),
    },
  });

  const onSubmit: SubmitHandler<any> = (data) => {
    if (!user) return;

    const newTask = data;

    // Prepare data
    newTask.endAt = new Date(newTask.endAt).getTime();
    newTask.startAt = new Date(newTask.startAt).getTime();
    delete newTask.assignees;
    delete newTask.updatedAt;

    if (newTask.__v !== undefined || newTask.__v !== null) delete newTask.__v;

    updateIsResponding(true);

    // Create new tasks
    if (!currentTask)
      UserAPI.createTask(newTask).then((payload) => {
        if (payload) addTask(payload.data);
        updateIsResponding(false);
      });
    else
      UserAPI.updateTask(currentTask._id, newTask).then((payload) => {
        if (payload) updateTask(payload.data);
        updateIsResponding(false);
      });

    setIsOpen(false);
  };

  React.useEffect(() => {
    if (currentTask) {
      form.reset(TaskUtils.toModel(currentTask));
    } else {
      form.reset({
        priorityId: "",
        statusId: "",
        sizeId: "",
        startAt: Date.now(),
        endAt: Date.now(),
      });
    }
  }, [currentTask]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full">
        {typeof TriggerContent === "function" ? (
          <TriggerContent />
        ) : (
          TriggerContent
        )}
      </DialogTrigger>
      <DialogContent
        onCloseAutoFocus={(e: Event) => e.preventDefault()}
        className="border-b border-b-2 pb-3 mb-6"
      >
        <DialogHeader>
          <DialogTitle>Create new item</DialogTitle>
          <DialogDescription>Manage your work better</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid w-full items-center gap-1.5 mb-2">
              <p className="font-semibold">Information</p>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Input
                      className="w-full"
                      type="text"
                      id="name"
                      placeholder="Your task name..."
                      {...field}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <p className="font-semibold">Attributes</p>
              <div className="flex items-center justify-between ps-3 mb-2">
                <p>Status</p>
                <TaskStatusFormSelect form={form} name="statusId" />
              </div>
              <div className="flex items-center justify-between ps-3 mb-2">
                <p>Priority</p>
                <TaskPriorityFormSelect form={form} name="priorityId" />
              </div>
              <div className="flex items-center justify-between ps-3 mb-2">
                <p>Size</p>
                <TaskSizeFormSelect form={form} name="sizeId" />
              </div>
            </div>
            <div>
              <p className="font-semibold">Duration</p>
              <div className="flex items-center justify-between ps-3 mb-2">
                <p>Start at</p>
                <DatePickerForm
                  name="startAt"
                  form={form}
                  TriggerContent={({ fieldValue }) => {
                    return (
                      <div className="flex items-center">
                        <p className="me-3">
                          {new Date(fieldValue).toLocaleDateString()}
                        </p>
                        <PencilLine color="gray" size="16px" />
                      </div>
                    );
                  }}
                />
              </div>
              <div className="flex items-center justify-between ps-3 mb-2">
                <p>End at</p>
                <DatePickerForm
                  name="endAt"
                  form={form}
                  TriggerContent={({ fieldValue }) => {
                    return (
                      <div className="flex items-center">
                        <p className="me-3">
                          {new Date(fieldValue).toLocaleDateString()}
                        </p>
                        <PencilLine color="gray" size="16px" />
                      </div>
                    );
                  }}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full mt-3"
              variant={isResponding ? "ghost" : "default"}
              disabled={isResponding}
            >
              {isResponding ? (
                <div className="flex justify-center items-center">
                  <LoadingSpinner width="w-4" height="w-4" />
                  <span className="ms-3">Adding...</span>
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
