import React from "react";
import AIWriter from "react-aiwriter";
import cn from "classnames";
import { ThumbsUp, ThumbsDown, User } from "lucide-react";

// Import components
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { CopyButton } from "../copy-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import MDContent from "../markdown";

// Import types
import type { ConversationDialogProps } from "./types";

const ConversationDialog = React.forwardRef<
  HTMLDivElement,
  ConversationDialogProps
>(function (props: ConversationDialogProps, ref) {
  {
    const wrapperClassName = "flex flex-col w-full max-w-[920px] mt-3";
    const containerClassName = "flex justify-start items-start w-3/4";
    const textContainerClassName =
      "w-full border break-words rounded-lg px-2 py-3 hover:ring-2";
    const isUser = props.data.sender === "user";

    return (
      <div
        ref={ref}
        className={cn(
          {
            [`${wrapperClassName} items-end`]: isUser,
          },
          { [`${wrapperClassName}`]: !isUser }
        )}
      >
        <div
          className={cn(
            {
              [`${containerClassName} flex-row-reverse`]: isUser,
            },
            { [`${containerClassName}`]: !isUser }
          )}
        >
          <div className="w-1/12">
            {isUser ? (
              <Avatar className="flex justify-center items-center bg-background ms-3">
                <User />
              </Avatar>
            ) : (
              <Avatar className="me-3">
                <AvatarImage src="/logo.svg" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="w-11/12">
            <div
              className={cn(
                {
                  [`${textContainerClassName} bg-white`]: isUser,
                },
                { [`${textContainerClassName} bg-slate-50`]: !isUser }
              )}
            >
              {props.hasAIWriterAnimation ? (
                <AIWriter>
                  <MDContent>{props.data.message}</MDContent>
                </AIWriter>
              ) : (
                <MDContent>{props.data.message}</MDContent>
              )}
            </div>
            {/* Message controller */}
            {!isUser && (
              <div className="mt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <CopyButton text={props.data.message} />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Copy</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ThumbsUp />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Like</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ThumbsDown />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Dislike</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
});

export default ConversationDialog;
