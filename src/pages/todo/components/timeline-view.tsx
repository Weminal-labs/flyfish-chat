import { Ellipsis } from "lucide-react";

// Import objects
import { TaskUtils } from "src/objects/task/utils";

// Import components
import ColumnViewTaskCard from "./board-view-task-card";
import AddItem from "./add-item";
import { Button } from "src/components/ui/button";

// Import states
import { useTaskState } from "src/states/task";

export default function TimelineView() {
  const { tasksByStatus, taskStatuses } = useTaskState();

  return (
    <div className="relative w-full flex flex-1 border px-3 py-2 bg-secondary rounded-lg  overflow-x-auto">
      <div className="flex flex-1">
        {tasksByStatus === null ? (
          <p>Loading...</p>
        ) : (
          tasksByStatus
            .entries()
            .toArray()
            .map((taskByStatus) => {
              const [statusValue, tasks] = taskByStatus;
              const status = TaskUtils.getTaskAttributeByValue(
                taskStatuses,
                statusValue
              );

              let statusCircleClassName =
                "w-5 h-5 rounded-full border border-[3px]";
              let statusCircleColor = TaskUtils.getStatusColor(status);

              if (statusCircleColor)
                statusCircleClassName += " " + statusCircleColor;

              return (
                <div
                  key={status.value}
                  className="flex flex-col bg-white rounded-lg border w-[420px] min-w-[420px] h-full me-3 px-3 pt-5 pb-3 overflow-y-hidden"
                >
                  <header className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={statusCircleClassName}></div>
                        <h3 className="ms-2 font-semibold">{status.name}</h3>
                      </div>
                      <Button variant="outline" size="icon">
                        <Ellipsis />
                      </Button>
                    </div>
                    <p className="mt-3">Description here</p>
                  </header>
                  <hr className="my-3" />
                  <div className="flex flex-1 flex-col overflow-y-auto">
                    {tasks === null || !Array.isArray(tasks) ? (
                      <p>Loading...</p>
                    ) : (
                      tasks.map((task) => {
                        return (
                          <ColumnViewTaskCard key={task._id} data={task} />
                        );
                      })
                    )}
                  </div>
                  <AddItem />
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
