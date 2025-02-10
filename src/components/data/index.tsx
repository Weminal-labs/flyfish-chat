import React from "react";
import cn from "classnames";
import { Sparkle } from "lucide-react";
import ReactJson from "react-json-view";

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
  const _className = "w-full rounded-[16px] border mb-3 hover:ring-2";
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
      <div className="py-4 px-6">
        <div className="mb-3 flex gap-4 flex-col">
          <span
            className={`block bg-[#1e6bff] text-white text-[14px] px-3 py-1 rounded-[20px] w-fit`}
          >
            Positive
          </span>
          <div className="flex gap-2 items-center">
            <img
              src={props.data.authorImg}
              className="block rounded-[50%] w-[34px] h-[34px]"
              alt=""
            />
            <div className="">
              <span className="font-[400] text-[16px] block">
                {props.data.authorFullname}
              </span>
              <span className="mt-[-4px] text-[12px] block">
                {props.data.authorUsername}
              </span>
            </div>
          </div>
          <span
            onClick={() => {
              window.open(
                `https://walruscan.com/testnet/blob/${props.data.uploadInfo.blobId}`,
                "_blank"
              );
            }}
            className="text-[#0057FF] max-w-[200px] text-[14px] underline font-[500] mt-[-8px] block cursor-pointer truncate overflow-hidden text-ellipsis"
          >
            BlobID: {props.data.uploadInfo.blobId || "Undefinded"}
          </span>
          <span
            onClick={() => {
              window.open(props.data.url, "_blank");
            }}
            className="text-gray-400 max-w-[364px] block text-[16px] mt-[-8px] cursor-pointer  "
          >
            {props.data.text}
          </span>

          <div className="flex justify-end ">
            <div className="w-fit relative group">
              <span className="text-[#919191] text-[14px]  group-hover:underline font-[700] hover:cursor-pointer">
                DETAIL
              </span>
              <div
                style={{
                  boxShadow: "-4px 18px 81px 18px rgba(0, 0, 0, 0.25)",
                }}
                className="absolute rounded-[14px] px-4   right-0 opacity-0 h-0 overflow-hidden w-[282px]  group-hover:h-[68px] flex items-center bg-white  group-hover:flex transition-all duration-300 ease-linear group-hover:opacity-100 group-hover:transition-all group-hover:duration-300 group-hover:ease-out"
              >
                <span
                  onClick={() => {
                    window.open(props.data.url, "_blank");
                  }}
                  className="text-[#0057FF] text-[16px] block cursor-pointer hover:underline overflow-hidden text-ellipsis"
                >
                  {props.data.url}
                </span>
              </div>
            </div>
          </div>
          {/* <p>{props.data.text}</p> */}
        </div>
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

  const _className =
    "flex flex-col h-screen max-h-[calc(100dvh-45px-16px)] border-s";

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
          <h3 className="font-bold text-2xl">Crawl Result</h3>
        </div>
        <p>Stores data on the fly</p>
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
