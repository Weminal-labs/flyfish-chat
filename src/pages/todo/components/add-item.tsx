import React from "react";
import { Plus } from "lucide-react";

// Import componnents
import { Button } from "src/components/ui/button";

export type AddItemProps = {} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const AddItem = React.forwardRef<HTMLButtonElement, AddItemProps>(
  (props, ref) => {
    return (
      <Button ref={ref} {...props} variant="outline">
        <Plus /> Add new item
      </Button>
    );
  }
);

export default AddItem;
