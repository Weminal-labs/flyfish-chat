// Import components
import ConversationSection from "src/components/conversation-section";
import Data from "src/components/Data";

export default function HomePage() {
  return (
    <div className="flex-1 flex justify-center items-center w-full max-h-[calc(100dvh-28px)]">
      <ConversationSection />
      <Data />
    </div>
  );
}
