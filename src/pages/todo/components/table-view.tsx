// Import components
import { TableViewDataTable } from "./table-view-datatable";
import { taskColumns } from "./table-view-columns";

// Import states
import { useTaskState } from "src/states/task";

export default function TableView() {
  const { tasks } = useTaskState();

  return (
    <div className="w-full flex flex-1 border bg-secondary rounded-lg overflow-auto">
      {tasks === null ? (
        <p>Loading...</p>
      ) : (
        <TableViewDataTable columns={taskColumns} data={[...tasks]} />
      )}
    </div>
  );
}
