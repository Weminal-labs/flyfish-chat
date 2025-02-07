// Import components
import Recommendations from "../recommendations";

// Import state
import { useConversationState } from "src/states/conversation";

// Import types
import type { RecommendationsBoxProps } from "./types";

export default function RecommendationsBox(props: RecommendationsBoxProps) {
  const { conversation } = useConversationState();

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
