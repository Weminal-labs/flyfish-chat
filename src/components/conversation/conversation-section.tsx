import React from "react";
import cn from "classnames";

// Import components
import RecommendationsBox from "./recommendation-box";
import ConversationDialogs from "./conversation-dialogs";
import ConversationController from "./conversation-controller";

// Import objects
import { AtomaAPI } from "src/objects/atoma/api";
import { ConversationAPI } from "src/objects/conversation/api";

// Import state
import { useConversationState } from "src/states/conversation";

// Import types
import type { ConversationSectionProps } from "./types";

export default function ConversationSection({
  className,
}: ConversationSectionProps) {
  const { setDoesFirstFetch, setAgentId, addDialog } = useConversationState();

  const _className =
    "relative h-screen max-h-[calc(100dvh-45px-16px)] flex flex-col flex-1 pb-2";

  React.useEffect(() => {
    // Promise.all([
    //   ConversationAPI.getConversationDialogs(),
    //   AtomaAPI.listModels(),
    // ]).then((values) => {
    //   const [dialogs, models] = values;
    //   // Set dialog
    //   setDialogs(dialogs);
    //   setDoesFirstFetch(true);
    // });
    ConversationAPI.getAgentIds().then((data) => {
      setAgentId(data.agents[0].id);
      setDoesFirstFetch(true);
      // Use to modify style of Swap box
      // addDialog({
      //   id: "dialog-01",
      //   sender: "user",
      //   text: "Hello",
      // });
      // addDialog({
      //   id: "dialog-02",
      //   sender: "ai",
      //   text: "random",
      //   action: "SWAP_TOKEN",
      // });
    });
  }, []);

  return (
    <section className={cn(_className, className)}>
      <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] -z-10"></div>
      <RecommendationsBox />
      <ConversationDialogs />
      <ConversationController />
    </section>
  );
}
