import React from "react";

// Import components
import { ScrollArea } from "../ui/scroll-area";
import ConversationDialog from "./conversation-dialog";

// Import state
import { useConversationState } from "src/states/conversation";

// Import types
import type { ConversationDialogsProps } from "./types";

export default function ConversationDialogs(props: ConversationDialogsProps) {
  const { conversation, setDoesFirstRender } = useConversationState();

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const dialogRef = React.useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom of chat
  React.useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [
    containerRef.current,
    dialogRef.current,
    conversation,
    conversation?.dialogs.length,
  ]);

  // Set some state
  React.useLayoutEffect(() => {
    if (conversation.doesFirstFetch) {
      setDoesFirstRender(true);
    }
  }, [conversation.doesFirstFetch]);

  if (!conversation) return;

  const dialogs = conversation.dialogs;
  const isAIWriteAnimationEnable = conversation.doesFirstRender;

  const DialogComponents = React.useMemo(() => {
    return dialogs.map((dialog, index) => (
      <ConversationDialog
        ref={index + 1 === dialogs.length ? dialogRef : null}
        hasAIWriterAnimation={
          index + 1 === dialogs.length && isAIWriteAnimationEnable
            ? true
            : false
        }
        key={index}
        data={dialog}
      />
    ));
  }, [dialogs.length, dialogs[dialogs.length - 1]]);

  return (
    <ScrollArea ref={containerRef} className="w-full flex flex-col flex-1 pb-6">
      <div className="px-6 w-full max-w-[860px] mx-auto">
        {DialogComponents}
      </div>
    </ScrollArea>
  );
}
