import React from "react";
import { Send } from "lucide-react";

// Import components
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

// Import objects
import { ConversationAPI } from "src/objects/conversation/api";
import { ConversationUtils } from "src/objects/conversation/utils";
import { ConversationConstants } from "src/objects/conversation/constant";

// Import state
import { useConversationState } from "src/states/conversation";

// Import types
import type { DialogType } from "src/objects/conversation/types";
import type { ConversationControllerProps } from "./types";

export default function ConversationController(
  props: ConversationControllerProps
) {
  const {
    conversation,
    addDialog,
    addDialogs,
    removeLastDialog,
    setConversationResponseStatus,
  } = useConversationState();

  const textAreaInputRef = React.useRef<HTMLTextAreaElement | null>(null);

  // Event handlers
  const {
    handleKeyDownEvent,
    handleInputEvent,
    handleSubmit,
    handleBlurEvent,
    handleFocusEvent,
  } = React.useMemo(() => {
    const _updateAIResponse = function (dialog: DialogType) {
      setConversationResponseStatus("WAITING");
      removeLastDialog();
      // Update dialog
      addDialog(dialog);
    };

    // Handle submit
    const handleSubmit = function (input: string) {
      const userDialog = ConversationUtils.createDialog(input);

      // Add placeholder for AI's Response
      const aiPlaceHolderDialog = ConversationUtils.createDialog(
        ConversationConstants.RespondingMessage,
        ConversationConstants.Senders.AI
      );
      aiPlaceHolderDialog.isBeingGenerated = true;

      // Update dialog
      addDialogs([userDialog, aiPlaceHolderDialog]);
      // Update response status
      setConversationResponseStatus("RESPONDING");

      // Clear data
      if (textAreaInputRef.current) textAreaInputRef.current.value = "";

      // Send request
      ConversationAPI.askBot(userDialog.message).then((data) => {
        if (!data) return;

        // Frontend gets response from AI, there are many steps to do:
        // 1. Create dialog for AI (shouldn't replace).
        // 2. Process Reasoning by add it to dialog (I can replace this step).
        // 3. Update response status to DONE (shouldn't replace).
        // 4. Create a new timeout for final change (shouldn't replace).

        // To do: create dialog for AI
        const aiDialog = ConversationUtils.createDialog(
          data.text,
          ConversationConstants.Senders.AI
        );

        // To do: create a log for reasoning

        // Update response status
        setConversationResponseStatus("DONE");

        // To do: after 50ms, update conversation response status
        // This timeout will allow program do anything else, other jobs.
        const timeout = setTimeout(() => {
          _updateAIResponse(aiDialog);
        }, 50);

        // clearTimeout(timeout);
      });
    };
    // Handle keydown event
    const handleKeyDownEvent = function (
      e: React.KeyboardEvent<HTMLTextAreaElement>
    ) {
      // Prevent add more lines on Enter key press
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();

        const target = e.currentTarget as HTMLTextAreaElement;
        // Submit
        handleSubmit(target.value);
      }

      if (e.key === "Enter" && e.shiftKey) {
        e.currentTarget.value += "";
      }
    };
    // Handle input event
    const handleInputEvent = function (
      e: React.FormEvent<HTMLTextAreaElement>
    ) {
      const target = e.target as HTMLTextAreaElement;
      target.style.height = "60px";
      target.style.height = target.scrollHeight + "px";
    };
    // Handle focus event
    const handleFocusEvent = function (
      e: React.FocusEvent<HTMLTextAreaElement, Element>
    ) {
      const target = e.currentTarget as HTMLTextAreaElement;
      const parentElement = target.parentElement as HTMLDivElement;

      // Add focus ring when textarea is focused
      parentElement.classList.add("ring-2");
    };
    // Handle blur event
    const handleBlurEvent = function (
      e: React.FocusEvent<HTMLTextAreaElement, Element>
    ) {
      const target = e.currentTarget as HTMLTextAreaElement;
      const parentElement = target.parentElement as HTMLDivElement;

      // Remove focus ring when textarea is blurred
      parentElement.classList.remove("ring-2");
    };

    return {
      handleKeyDownEvent,
      handleInputEvent,
      handleSubmit,
      handleBlurEvent,
      handleFocusEvent,
    };
  }, [textAreaInputRef.current]);

  return (
    <div className="sticky bottom-0 w-full max-w-[840px] mx-auto border rounded-lg flex items-end px-3 py-2 bg-gray-100 hover:ring-2">
      <Textarea
        ref={textAreaInputRef}
        disabled={conversation.responseStatus !== "WAITING"}
        className="bg-transparent max-h-[156px] border-none shadow-none focus-visible:ring-0 resize-none"
        placeholder="Start conversation with flyfish..."
        onKeyDown={handleKeyDownEvent}
        onInput={handleInputEvent}
        onFocus={handleFocusEvent}
        onBlur={handleBlurEvent}
      />
      <Button
        disabled={conversation.responseStatus !== "WAITING"}
        onClick={() => {
          if (textAreaInputRef.current)
            handleSubmit(textAreaInputRef.current.value);
        }}
        variant="outline"
        className="ms-2"
        size="icon"
      >
        <Send />
      </Button>
    </div>
  );
}
