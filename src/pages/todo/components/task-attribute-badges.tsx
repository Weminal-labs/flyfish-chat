import React from "react";

// Import components
import { Badge } from "src/components/ui/badge";

// Import objects
import { TaskUtils } from "src/objects/task/utils";

import { cn } from "src/lib/utils";

type BadgeProps = {
  data: any;
} & React.HTMLAttributes<HTMLDivElement>;

export function TaskSizeBadge({ className, data, ...props }: BadgeProps) {
  return (
    <Badge
      className={cn(TaskUtils.getSizeColor(data), className)}
      variant="outline"
      {...props}
    >
      {data.name}
    </Badge>
  );
}

export function TaskPriorityBadge({ className, data, ...props }: BadgeProps) {
  return (
    <Badge
      className={cn(TaskUtils.getPriorityColor(data), className)}
      variant="outline"
      {...props}
    >
      {data.name}
    </Badge>
  );
}

export function TaskStatusBadge({ className, data, ...props }: BadgeProps) {
  return (
    <Badge
      className={cn(TaskUtils.getStatusColor(data), className)}
      variant="outline"
      {...props}
    >
      {data.name}
    </Badge>
  );
}
