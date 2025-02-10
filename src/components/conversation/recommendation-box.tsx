// Import components
import Recommendations from "../recommendations";
import { useConversationState } from "src/states/conversation";
// Import state

// Import types
import type { RecommendationsBoxProps } from "./types";

export default function RecommendationsBox(props: RecommendationsBoxProps) {
  const { conversation } = useConversationState();

  if (conversation.dialogs.length > 0) return;

  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <div className="flex flex-col">
        <img className="w-full max-w-[320px]" src="/logo.svg" />
        <h1 className="font-bold text-3xl">How can I help you?</h1>
      </div>
      <Recommendations className="mx-auto" />
    </div>
  );
}
