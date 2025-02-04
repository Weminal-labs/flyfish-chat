import { PencilLine } from "lucide-react";

// Import components
import { Button } from "src/components/ui/button";
import { Calendar } from "src/components/ui/calendar";
import {
  PopoverDialog,
  PopoverDialogContent,
  PopoverDialogTrigger,
} from "src/components/ui/popover-dialog";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "src/components/ui/form";

// Import types
import type { UseFormReturn } from "react-hook-form";

type DatePickerProps = {
  TriggerContent: (() => JSX.Element) | JSX.Element;
  date: Date;
  setDate: any;
};

type DatePickerFormProps = {
  name: string;
  form: UseFormReturn;
  TriggerContent: ({ fieldValue }: { fieldValue: any }) => JSX.Element;
};

/**
 * Render float date picker
 * @param param0
 * @returns
 */
export function DatePicker(props: DatePickerProps) {
  let Content = (
    <PencilLine className="cursor-pointer" color="gray" size="16px" />
  );

  if (typeof props.TriggerContent === "function") {
    Content = <props.TriggerContent />;
  } else if (typeof props.TriggerContent === "object") {
    Content = props.TriggerContent;
  }

  return (
    <PopoverDialog>
      <PopoverDialogTrigger asChild>{Content}</PopoverDialogTrigger>
      <PopoverDialogContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={props.date}
          onSelect={props.setDate}
          initialFocus
        />
      </PopoverDialogContent>
    </PopoverDialog>
  );
}

/**
 * Render float date picker for form
 * @param param0
 * @returns
 */
export function DatePickerForm({
  name,
  form,
  TriggerContent,
}: DatePickerFormProps) {
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <PopoverDialog>
            <PopoverDialogTrigger asChild>
              <FormControl>
                <Button variant="ghost">
                  {TriggerContent && (
                    <TriggerContent fieldValue={field.value} />
                  )}
                </Button>
              </FormControl>
            </PopoverDialogTrigger>
            <PopoverDialogContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
              />
            </PopoverDialogContent>
          </PopoverDialog>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
