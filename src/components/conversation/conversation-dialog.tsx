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
    const containerClassName =
      "flex items-start w-full border rounded-lg px-2 py-3 mt-3";
    const isUser = props.data.sender === "user";

    return (
      <div
        ref={ref}
        className="w-full max-w-[920px] mx-auto [&>div:first-child]:hover:ring-2"
      >
        <div
          className={cn(
            { [containerClassName]: isUser },
            { [`${containerClassName} bg-slate-100`]: !isUser }
          )}
        >
          <div className="w-1/12">
            {isUser ? (
              <Avatar className="flex justify-center items-center bg-slate-50">
                <User />
              </Avatar>
            ) : (
              <Avatar>
                <AvatarImage src="/logo.svg" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="w-11/12">
            {props.hasAIWriterAnimation ? (
              <AIWriter>
                <MDContent>{props.data.message}</MDContent>
              </AIWriter>
            ) : (
              <MDContent>{props.data.message}</MDContent>
            )}
          </div>
          {/* Message controller */}
        </div>
        {!isUser && (
          <div className="mt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <CopyButton text={props.data.message} />
                  </Button>
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
    );
  }
});

export default ConversationDialog;
