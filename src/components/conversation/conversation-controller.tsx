import React, { useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { Send } from "lucide-react";

// Import components
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

// Import objects
import { ConversationAPI } from "src/objects/conversation/api";
import { ConversationUtils } from "src/objects/conversation/utils";
import { ConversationConstants } from "src/objects/conversation/constant";

// Import state
import { useConversationState } from "src/states/conversation";

// Import utils
import { ConversationUIUtils } from "./utils";

// Import types
import type { DialogType } from "src/objects/conversation/types";
import type { ConversationControllerProps } from "./types";
import { AIService } from "../../services/ai.service";
import SwapModalAgent from '../web3/swap/swap-modal-agent';

const inputPlaceHolder = "Start conversation with flyfish...";

/**
 * Use to render a conversation controller with suggest feature in user input.
 * @returns
 */
export default function ConversationController() {
  const {
    conversation,
    addDialog,
    addDialogs,
    removeLastDialog,
    setConversationResponseStatus,
  } = useConversationState();
  const { account, address, signAndExecuteTransactionBlock } = useWallet();
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapInfo, setSwapInfo] = useState<{
    fromSymbol: string;
    toSymbol: string;
    amount: number;
    txBytes?: string;
  } | null>(null);

  const inputRef = React.useRef<HTMLDivElement | null>(null);

  // Event handlers
  const {
    handleKeyDownEvent,
    handleInputEvent,
    handleSubmit,
    handleBlurEvent,
    handleFocusEvent,
  } = React.useMemo(() => {
    const _updateAIResponse = function (dialog: DialogType) {
      setConversationResponseStatus("WAITING");
      removeLastDialog();
      // Update dialog
      addDialog(dialog);
    };

    const _emphasizeKeyword = function (target: HTMLDivElement) {
      const text = target.textContent;

      // If input doesn't have any content, skip this function.
      if (!text) return;

      const regex = ConversationUIUtils.getKeywordRegex(text);

      if (regex) {
        // Remove text
        const keywordMatch = text.match(regex);

        if (!keywordMatch) return;

        const userInputKeyword = keywordMatch[0];

        target.textContent = text.replace(regex, "");

        const highlightKeywordElement =
          ConversationUIUtils.createHighlightKeywordElement(userInputKeyword);
        const spaceElement = document.createTextNode("\u00A0");
        const keywordMetadata = ConversationUIUtils.getKeywordMetadata(regex)!;
        let suggestionContent = keywordMetadata.suggestion;

        // Replace something
        if (suggestionContent.includes("{{WALLET ADDRESS}}")) {
          suggestionContent = suggestionContent.replace(
            "{{WALLET ADDRESS}}",
            account?.address! 
          );
        }

        const suggestionElement =
          ConversationUIUtils.createInputPlaceHolderElement(suggestionContent);

        // Set data attribute
        suggestionElement.setAttribute(
          ConversationUIUtils.SuggestionCustomAttributeKeys.type,
          "suggestion"
        );
        suggestionElement.setAttribute(
          ConversationUIUtils.SuggestionCustomAttributeKeys.value,
          "suggestion"
        );

        // Append chill to element
        target.appendChild(highlightKeywordElement);
        target.appendChild(spaceElement);
        target.appendChild(suggestionElement);

        // Move cursor to end
        ConversationUIUtils.setCusorToContenteditable(spaceElement);
      }
    };

    const _clearAll = function (target: HTMLDivElement) {
      while (target.firstChild) {
        if (target.lastChild) target.removeChild(target.lastChild);
      }
    };

    const _clear = function (target: HTMLDivElement) {
      if (target.childNodes.length > 1) return;

      const childNode = target.childNodes[0];

      if (childNode === target.querySelector("br")) {
        target.removeChild(childNode);
      }

      if (childNode === target.querySelector("span")) {
        target.removeChild(childNode);
      }
    };

    const _placeHolderElement = function (target: HTMLDivElement) {
      if (target.childNodes.length === 0) {
        target.appendChild(
          ConversationUIUtils.createInputPlaceHolderElement(inputPlaceHolder)
        );
      }
    };

    const _removePlaceHolderElement = function (target: HTMLDivElement) {
      if (
        target.childNodes.length === 1 &&
        target.childNodes[0].textContent === inputPlaceHolder
      ) {
        target.removeChild(target.childNodes[0]);
      }
    };

    const _getContent = function (target: HTMLDivElement) {
      const childNodes = target.childNodes;
      let content = "";

      for (const childNode of childNodes) {
        if (childNode) {
          content += childNode.textContent;
        } else content += childNode;
      }

      return content;
    };

    // Handle submit
    const handleSubmit = async function (target: HTMLDivElement) {
      const content = _getContent(target);
      const userDialog = ConversationUtils.createDialog(content);

      // Add placeholder for AI's Response
      const aiPlaceHolderDialog = ConversationUtils.createDialog(
        ConversationConstants.RespondingMessage,
        ConversationConstants.Senders.AI
      );
      aiPlaceHolderDialog.isBeingGenerated = true;

      // Update dialog
      addDialogs([userDialog, aiPlaceHolderDialog]);
      // Update response status
      setConversationResponseStatus("RESPONDING");

      // Clear input
      if (inputRef.current) {
        _clearAll(inputRef.current);
        inputRef.current.blur();
      }

      try {
        // Gửi message tới AI Agent
        const aiResponse = await AIService.sendMessage(content);
        console.log("PHAP-AI-RESPONSE", aiResponse);

        // Kiểm tra xem response có phải là swap action không  
        if (AIService.isSwapAction(aiResponse)) {
          const swapInfo = AIService.getSwapInfo(aiResponse);
          console.log("PHAP-swap info", swapInfo);
          if (swapInfo) {
            console.log("PHAP-swap info", swapInfo);
            setSwapInfo(swapInfo);
            setShowSwapModal(true);
          }
        }

        // Tạo dialog cho AI response
        const aiDialog = ConversationUtils.createDialog(
          aiResponse[0].text,
          ConversationConstants.Senders.AI
        );

        // Update response status
        setConversationResponseStatus("DONE");

        // Update AI response
        setTimeout(() => {
          setConversationResponseStatus("WAITING");
          removeLastDialog();
          addDialog(aiDialog);
        }, 50);

      } catch (error) {
        console.error('Error sending message:', error);
        setConversationResponseStatus("WAITING");
      }
    };
    // Handle keydown event
    const handleKeyDownEvent = function (
      e: React.KeyboardEvent<HTMLDivElement>
    ) {
      const target = e.currentTarget as HTMLDivElement;

      // User presses Enter
      // Prevent add more lines on Enter key press
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();

        // Submit
        handleSubmit(target);
      }

      // User presses Enter + Shift
      if (e.key === "Enter" && e.shiftKey) {
        target.textContent += "";
      }

      // User presses tab
      if (e.key === "Tab") {
        e.preventDefault();
        // Append last span's content to element
        const lastChildSpan = target.childNodes[target.childNodes.length - 1];

        if (!lastChildSpan) return;

        if (
          typeof lastChildSpan === "object" &&
          (lastChildSpan as HTMLSpanElement).getAttribute &&
          (lastChildSpan as HTMLSpanElement).getAttribute(
            ConversationUIUtils.SuggestionCustomAttributeKeys.type
          ) === "suggestion"
        ) {
          const lastChildSpanContentElement = document.createTextNode(
            lastChildSpan.textContent!
          );
          target.removeChild(lastChildSpan);
          target.appendChild(lastChildSpanContentElement);

          // Move cusor to last
          ConversationUIUtils.setCusorToContenteditable(
            lastChildSpanContentElement
          );
        }
      }

      // User presses normal key
      // If input has suggestion element
      const lastChildSpan = target.childNodes[target.childNodes.length - 1];

      if (!lastChildSpan) return;

      if (
        typeof lastChildSpan === "object" &&
        (lastChildSpan as HTMLSpanElement).getAttribute &&
        (lastChildSpan as HTMLSpanElement).getAttribute(
          ConversationUIUtils.SuggestionCustomAttributeKeys.type
        ) === "suggestion"
      ) {
        target.removeChild(lastChildSpan);
      }
    };
    // Handle input event
    const handleInputEvent = function (e: React.FormEvent<HTMLDivElement>) {
      const target = e.currentTarget as HTMLDivElement;
      target.style.height = "60px";
      target.style.height = target.scrollHeight + "px";

      _placeHolderElement(target);
      _emphasizeKeyword(target);
      _clear(target);
    };
    // Handle focus event
    const handleFocusEvent = function (
      e: React.FocusEvent<HTMLDivElement, Element>
    ) {
      const target = e.currentTarget as HTMLDivElement;
      const parentElement = target.parentElement as HTMLDivElement;

      // Add focus ring when textarea is focused
      parentElement.classList.add("ring-2");

      // Remove input placeholder
      _removePlaceHolderElement(target);
    };
    // Handle blur event
    const handleBlurEvent = function (
      e: React.FocusEvent<HTMLDivElement, Element>
    ) {
      const target = e.currentTarget as HTMLDivElement;
      const parentElement = target.parentElement as HTMLDivElement;

      // Remove focus ring when textarea is blurred
      parentElement.classList.remove("ring-2");
      _placeHolderElement(target);
    };

    return {
      handleKeyDownEvent,
      handleInputEvent,
      handleSubmit,
      handleBlurEvent,
      handleFocusEvent,
    };
  }, [inputRef.current]);

  React.useEffect(() => {
    if (inputRef.current && inputRef.current.childNodes.length === 0) {
      inputRef.current.appendChild(
        ConversationUIUtils.createInputPlaceHolderElement(inputPlaceHolder)
      );
    }
  }, [inputRef.current, account?.address]);

  // Handle swap transaction
  const handleSwap = async (txBytes: string) => {
    // try {
    //   if (signAndExecuteTransactionBlock) {
    //     const result = await signAndExecuteTransactionBlock({
    //       transactionBlock: txBytes,
    //     });
    //     console.log('Swap transaction result:', result);
    //     setShowSwapModal(false);
    //   }
    // } catch (error) {
    //   console.error('Error executing swap:', error);
    // }

    console.log("PHAP-TX-BYTES", txBytes);
  };

  return (
    <>
      <div className="relative w-full max-w-[840px] mx-auto border rounded-lg flex items-end px-3 py-2 bg-gray-100 hover:ring-2">
        <div
          contentEditable={conversation.responseStatus === "WAITING"}
          ref={inputRef}
          className="w-full min-h-[60px] bg-transparent max-h-[156px] focus:outline-0"
          onKeyDown={handleKeyDownEvent}
          onInput={handleInputEvent}
          onFocus={handleFocusEvent}
          onBlur={handleBlurEvent}
        />
        <Button
          disabled={conversation.responseStatus !== "WAITING"}
          onClick={() => {
            if (inputRef.current) handleSubmit(inputRef.current);
          }}
          variant="outline"
          className="ms-2"
          size="icon"
        >
          <Send />
        </Button>
      </div>

      {/* Swap Modal */}
      {swapInfo && (
        <SwapModalAgent
          isOpen={showSwapModal}
          onClose={() => setShowSwapModal(false)}
          fromSymbol={swapInfo.fromSymbol}
          toSymbol={swapInfo.toSymbol}
          amount={swapInfo.amount}
          txBytes={swapInfo.txBytes}
          onSwap={handleSwap}
        />
      )}
    </>
  );
}
