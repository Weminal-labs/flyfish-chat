import React from "react";

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

export default function ConversationSection(props: ConversationSectionProps) {
  const { setDialogs, setDoesFirstFetch } = useConversationState();

  React.useEffect(() => {
    Promise.all([
      ConversationAPI.getConversationDialogs(),
      AtomaAPI.listModels(),
    ]).then((values) => {
      const [dialogs, models] = values;

      // Set dialog
      setDialogs(dialogs);
      setDoesFirstFetch(true);
    });
  }, []);

  return (
    <section className="w-full max-h-[calc(100dvh-28px)] max-w-[860px] flex flex-col flex-1 px-3 py-2">
      <RecommendationsBox />
      <ConversationDialogs />
      <ConversationController />
    </section>
  );
}
