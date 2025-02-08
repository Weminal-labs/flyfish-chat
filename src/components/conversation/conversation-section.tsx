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
  const { setDialogs, setDoesFirstFetch } = useConversationState();

  const _className =
    "relative max-h-[calc(100dvh-45px-16px)] flex flex-col flex-1 pb-2";

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
    <section className={cn(_className, className)}>
      <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <RecommendationsBox />
      <ConversationDialogs />
      <ConversationController />
    </section>
  );
}
