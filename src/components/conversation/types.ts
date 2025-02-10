// Import types
import type { DialogType } from "src/objects/conversation/types";

export type RecommendationsBoxProps = {};
export type TextContentContainerProps = {
  hasAIWriterAnimation?: boolean;
  isUser: boolean;
  data: DialogType;
};
export type ConversationDialogProps = {
  data: DialogType;
  hasAIWriterAnimation?: boolean;
};
export type ConversationDialogsProps = {};
export type ConversationControllerProps = {};
export type ConversationSectionProps = {
  className?: string;
};
