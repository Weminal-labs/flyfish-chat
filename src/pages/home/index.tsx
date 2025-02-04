// Import components
import ConversationSection from "src/components/conversation-section";
import Recommendation from "src/components/recommendation";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full max-h-[calc(100dvh-28px)]">
      <ConversationSection />
      <Recommendation />
    </div>
  );
}
