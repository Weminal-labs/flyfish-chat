import React from "react";
import cn from "classnames";
import { Send, ThumbsUp, ThumbsDown, User } from "lucide-react";

// Import components
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { CopyButton } from "./copy-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Recommendations from "./recommendations";
import MDContent from "./markdown";

// Import objects
import { AtomaAPI } from "src/objects/atoma/api";
import { FlyFishAPI } from "src/objects/fly-fish/api";
import { ConversationUtils } from "src/objects/conversation/utils";
import { ConversationConstants } from "src/objects/conversation/constant";

// Import state
import { useConversation } from "src/states/conversation";

// Import types
import type { DialogType } from "src/objects/conversation/types";

type RecommendationsBoxProps = {};
type ConversationDialogProps = {
  data: any;
};
type ConversationDialogsProps = {};
type ConversationControllerProps = {};
export type ConversationSectionProps = {};

function RecommendationsBox(props: RecommendationsBoxProps) {
  const { conversation } = useConversation();

  if (conversation) return;
  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <div>
        <h1 className="font-bold text-2xl">How can I help you?</h1>
      </div>
      <Recommendations />
    </div>
  );
}

function ConversationDialog(props: ConversationDialogProps) {
  const containerClassName =
    "flex items-start w-full border rounded-lg px-2 py-3 mt-3";
  const isUser = props.data.sender === "user";

  return (
    <div className="w-full max-w-[920px] mx-auto [&>div:first-child]:hover:ring-2">
      <div
        className={cn(
          { [containerClassName]: isUser },
          { [`${containerClassName} bg-slate-100`]: !isUser }
        )}
      >
        <div className="w-1/12">
          {isUser ? (
            <Avatar className="flex justify-center items-center bg-slate-50">
              <User />
            </Avatar>
          ) : (
            <Avatar>
              <AvatarImage src="/logo.svg" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="w-11/12">
          <MDContent>{props.data.message}</MDContent>
        </div>
        {/* Message controller */}
      </div>
      {!isUser && (
        <div className="mt-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <CopyButton text={props.data.message} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Copy</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ThumbsUp />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Like</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ThumbsDown />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Dislike</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}

function ConversationDialogs(props: ConversationDialogsProps) {
  const { conversation } = useConversation();

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom of chat
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
    }
  }, [containerRef.current, conversation, conversation?.dialogs.length]);

  if (!conversation) return;

  const dialogs = conversation.dialogs;

  return (
    <div
      ref={containerRef}
      className="flex flex-col flex-1 overflow-y-auto pb-6"
    >
      {dialogs.map((dialog, index) => (
        <ConversationDialog key={index} data={dialog} />
      ))}
    </div>
  );
}

function ConversationController(props: ConversationControllerProps) {
  const {
    conversation,
    addDialog,
    addDialogs,
    removeLastDialog,
    setConversationResponseStatus,
  } = useConversation();

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
      FlyFishAPI.askBot(userDialog.message).then((data) => {
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
    <div className="sticky bottom-0 w-full max-w-[960px] mx-auto border rounded-lg flex items-end px-3 py-2 bg-gray-100 hover:ring-2">
      <Textarea
        ref={textAreaInputRef}
        disabled={conversation.responseStatus !== "WAITING"}
        className="bg-transparent max-h-[156px] border-none shadow-none focus-visible:ring-0 resize-none"
        placeholder="Start conversation with Marine Mind..."
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

export default function ConversationSection(props: ConversationSectionProps) {
  const { setDialogs } = useConversation();

  React.useEffect(() => {
    Promise.all([
      FlyFishAPI.getConversationDialogs(),
      AtomaAPI.listModels(),
    ]).then((values) => {
      const [dialogs, models] = values;

      // Set dialog
      setDialogs(dialogs);
    });
  }, []);

  return (
    <section className="w-full flex flex-col flex-1 px-3 py-2 overflow-hidden">
      <RecommendationsBox />
      <ConversationDialogs />
      <ConversationController />
    </section>
  );
}
