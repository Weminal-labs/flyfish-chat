// Import components
import ConversationSection from "src/components/conversation-section";
import Recommendation from "src/components/recommendation";

export default function HomePage() {
  return (
    <div className="w-full flex-1 flex flex-col justify-center items-center">
      <ConversationSection />
      <Recommendation />
    </div>
  );
}
