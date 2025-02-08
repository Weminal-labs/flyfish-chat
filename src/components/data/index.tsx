import React from "react";
import cn from "classnames";
import { Sparkle } from "lucide-react";

// Import components
import { ScrollArea } from "../ui/scroll-area";

// Import objects
import { KnowledgeAPI } from "src/objects/knowledge/api";

// Import state
import { useKnowledgeState } from "src/states/knowledge";

// Import utils
import { DataUIUtils } from "./utils";

// Import types
import type {
  KnowledgeType,
  KnowledgeCategoryType,
} from "src/objects/knowledge/types";

type DataCategoryProps = {
  data: KnowledgeCategoryType;
};

type DataCardProps = {
  data: KnowledgeType;
};

type DataProps = {
  className?: string;
};

function DataCategory(props: DataCategoryProps) {
  return (
    <div>
      <p>{props.data.name}</p>
      <div className="ms-3">
        {props.data.topics.map((topic, index) => (
          <div key={index} className="border-s border-s-2 ps-2">
            <p>{topic.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataCard(props: DataCardProps) {
  const _className = "w-full rounded-lg border px-2 py-3 mb-3 hover:ring-2";
  const color = React.useMemo(() => DataUIUtils.getColorForDataCard(), []).join(
    ","
  );

  return (
    <div
      className={_className}
      style={{
        /* backgroundColor: `rgba(${color}, 0.2)`, */ color: `rgb(${color})`,
      }}
    >
      <div className="mb-3">
        <h3 className="font-bold text-xl">{props.data.authorFullname}</h3>
        <p>{props.data.text}</p>
      </div>
      {/* <div>
        <p className="font-bold">Categories</p>
        <div className="ms-3">
          {props.data.categories.map((category, index) => (
            <DataCategory key={index} data={category} />
          ))}
        </div>
      </div> */}
    </div>
  );
}

export default function Data({ className }: DataProps) {
  const { list, setListKnowledge } = useKnowledgeState();

  const _className = "flex flex-col max-h-[calc(100dvh-45px-16px)] border-s";

  React.useEffect(() => {
    KnowledgeAPI.getKnowledge().then((list) => setListKnowledge(list));
  }, []);
  console.log(list);
  [[], []];
  return (
    <div className={cn(_className, className)}>
      <div className="px-3 py-2 border-b">
        <div className="flex items-center">
          <Sparkle className="me-2" />
          <h3 className="font-bold text-2xl">Used data</h3>
        </div>
        <p>Most-used topics</p>
      </div>
      {list.length === 0 ? (
        <div className="w-full h-fit flex flex-col items-center px-2 py-3 border rounded-lg">
          <h3 className="text-2xl font-bold mb-1">Opps!!</h3>
          <p>An empty list, you should crawl data first!</p>
        </div>
      ) : (
        <ScrollArea className="w-full [&>div[data-radix-scroll-area-viewport]]:max-h-[calc(100dvh-45px-16px-56px-12px)] px-3">
          <div className="px-6 mt-2">
            {list.map((knowledgeList, index) =>
              knowledgeList.map((knowledge, id) => (
                <DataCard key={index * 10 + id} data={knowledge} />
              ))
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
