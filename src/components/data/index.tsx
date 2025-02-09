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
import ReactJson from "react-json-view";
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
  const _className = "w-full rounded-[16px] border px-6 py-4 mb-3 hover:ring-2";
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
      <div className="mb-3 flex gap-4 flex-col">
        <span
          className={`block bg-[#1e6bff] text-white text-[16px] px-3 py-1 rounded-[20px] w-fit`}
        >
          Positive
        </span>
        <div className="flex gap-2 items-center">
          <img
            src={props.data.authorImg}
            className="block rounded-[50%] w-[48px] h-[48px]"
            alt=""
          />
          <div className="">
            <span className="font-[400] text-xl block">
              {props.data.authorFullname}
            </span>
            <span className="mt-[-4px] text-[16px] block">
              {props.data.authorUsername}
            </span>
          </div>
        </div>
        <span
          onClick={() => {
            window.open(props.data.url, "_blank");
          }}
          className="text-gray-400 text-xl block cursor-pointer  truncate"
        >
          {props.data.url}
        </span>

        <div className="flex justify-end ">
          <div className="w-fit relative group">
            <span className="text-gray-400  underline font-[500] hover:cursor-pointer">
              DETAIL
            </span>
            <div className="absolute bottom-[-100px] right-[50%] hidden opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-300 ease-linear">
              <ReactJson
                src={props.data}
                theme="apathy:inverted"
                // type ThemeKeys = "pop" | "flat" | "brewer" | "apathy" | "apathy:inverted" | "ashes" | "bespin" | "bright:inverted" | "bright" | "chalk" | "codeschool" | "colors" | "eighties" | "embers" | "google" | ... 21 more ... | "twilight
                style={{
                  width: "320px",
                  height: "240px",
                  overflow: "scroll",
                  borderRadius: "10px",
                  scrollbarWidth: "none",
                  padding: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
                collapsed={true}
              />
              ;
            </div>
          </div>
        </div>
        {/* <p>{props.data.text}</p> */}
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
