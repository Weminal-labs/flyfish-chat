import React from "react";
import { Loader } from "lucide-react";

// Import components
import { ScrollArea } from "./ui/scroll-area";

// Import objects
import { KnowledgeAPI } from "src/objects/knowledge/api";

// Import state
import { useKnowledgeState } from "src/states/knowledge";

// Import types
import type { KnowledgeType } from "src/objects/knowledge/types";

type DataCardProps = {
  data: KnowledgeType;
};

function DataCard(props: DataCardProps) {
  return (
    <div className="w-full rounded-lg border px-2 py-3 mb-3 hover:ring-2">
      <div>
        <h3 className="font-bold text-xl">{props.data.title}</h3>
        <p>{props.data.description}</p>
      </div>
    </div>
  );
}

export default function Data() {
  const { list, setListKnowledge } = useKnowledgeState();

  React.useEffect(() => {
    KnowledgeAPI.getKnowledge().then((list) => setListKnowledge(list));
  }, []);

  return (
    <div className="flex flex-col w-full h-screen max-w-[340px] max-h-[calc(100dvh-28px)]">
      <div className="mb-3">
        <div className="flex items-center">
          <Loader className="me-2" />
          <h3 className="font-bold text-2xl">Used data</h3>
        </div>
        <p>Top used topics</p>
      </div>
      {list.length === 0 ? (
        <div className="w-full h-fit flex flex-col items-center px-2 py-3 border rounded-lg">
          <h3 className="text-2xl font-bold mb-1">Opps!!</h3>
          <p>An empty list, you should crawl data first!</p>
        </div>
      ) : (
        <ScrollArea className="w-full">
          <div className="px-6 pt-2">
            {list.map((knowledge, index) => (
              <DataCard key={index} data={knowledge} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
