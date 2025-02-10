import cn from "classnames";

export class ConversationUIUtils {
  static KeywordAttributeKeys = {
    Type: "data-type",
    RequestAction: "data-request-action",
  };

  static SuggestionCustomAttributeKeys = {
    Type: "data-type",
    Value: "data-suggestion-value",
  };

  static Keywords = [
    {
      regex: /(swap)$/i,
      suggestion: "{{AMOUNT}} of {{Token A}} to {{Token B}}",
      value: "swap",
    },
    {
      regex: /(balance)$/i,
      suggestion: "of {{WALLET ADDRESS}}",
      value: "balance",
    },
    {
      regex: /(transfer)$/i,
      suggestion: "{{AMOUNT}} to {{WALLET ADDRESS}}",
      value: "transfer",
    },
    {
      regex: /(deposit)$/i,
      suggestion: "DONT KNOW YET",
      value: "deposit",
    },
    {
      regex: /(portfolio)$/i,
      suggestion: "of {{WALLET ADDRESS}}",
      value: "portfolio",
    },
    {
      regex: /(repay)$/i,
      suggestion: "{{AMOUNT}} to {{WALLET ADDRESS}}",
      value: "repay",
    },
    {
      regex: /(withdraw)$/i,
      suggestion: "{{AMOUNT}} from my {{WALLET ADDRESS}}",
      value: "withdraw",
    },
  ];

  /**
   * Use to check keyword of given value
   * @param value
   * @returns
   */
  static hasKeywordValue(value?: string | null) {
    if (!value) return false;

    for (const keyword of ConversationUIUtils.Keywords) {
      if (keyword.value === value) {
        return true;
      }
    }

    return false;
  }

  /**
   * Use to get keyword metadata from regex of a keyword
   * @param regex
   * @returns
   */
  static getKeywordMetadata(regex: RegExp) {
    for (const keyword of ConversationUIUtils.Keywords) {
      if (keyword.regex === regex) {
        return keyword;
      }
    }
  }

  /**
   * Use to get full metadata of keyword with its value
   * @param value
   */
  static getKeywordMetadataByValue(value: string) {
    for (const keyword of ConversationUIUtils.Keywords) {
      if (keyword.value === value) {
        return keyword;
      }
    }
  }

  /**
   * Use to move cursor to a node (element)
   * @param target
   */
  static setCusorToContenteditable(target: Node) {
    // Move text cursor to the end, use this function in some cases like:
    // 1. Add new element to target.

    // About this solution is in:
    // https://stackoverflow.com/questions/1125292/how-to-move-the-cursor-to-the-end-of-a-contenteditable-entity/3866442#3866442

    let range, selection;
    if (document.createRange) {
      //Firefox, Chrome, Opera, Safari, IE 9+
      range = document.createRange(); //Create a range (a range is a like the selection but invisible)
      range.selectNodeContents(target); //Select the entire contents of the element with the range
      range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
      selection = window.getSelection()!; //get the selection object (allows you to change selection)
      selection.removeAllRanges(); //remove any selections already made
      selection.addRange(range); //make the range you have just created the visible selection
    } else if (document.getSelection()) {
      //IE 8 and lower
      range = (document.body as any).createTextRange(); //Create a range (a range is a like the selection but invisible)
      range.moveToElementText(target); //Select the entire contents of the element with the range
      range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
      range.select(); //Select the range (make it the visible selection
    }
  }

  /**
   * Use to create placeholder for conversation controller
   * @param content
   * @returns
   */
  static createInputPlaceHolderElement(content: string) {
    const span = document.createElement("span");

    span.textContent = content;
    span.className = "text-gray-500 select-none";

    return span;
  }

  /**
   * Use to create highlight keyword element
   * @param keyword
   */
  static createHighlightKeywordElement(keyword: string) {
    // Modify display time of tooltip here
    const displayTimeOfTooltip = 2000;

    const span = document.createElement("span");
    const spanClassName =
      "relative z-20 font-bold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text";
    const pseudoBeforeClassName =
      "before:absolute before:w-full before:h-full before:z-10 before:bg-gradient-to-r before:from-[#ffffff] before:via-green-500 before:to-indigo-400 before:left-0 before:top-0 before:blur-[12px] before:opacity-30";
    const pseudoAfterClassName =
      "after:absolute after:inline-block after:w-auto after:left-[-50%] after:top-[-200%] after:content-['Press_Tab_to_apply'] after:font-normal after:text-sm after:text-primary after:z-20 after:whitespace-nowrap after:bg-white after:px-3 after:py-2 after:rounded-lg after:border";

    // const keywordMetadata = ConversationUIUtils.getKeywordMetadataByValue(
    //   keyword.toLowerCase()
    // );

    // Set attributes
    span.textContent = keyword;
    span.className = cn(
      spanClassName,
      pseudoBeforeClassName,
      pseudoAfterClassName
    );
    span.setAttribute(
      ConversationUIUtils.KeywordAttributeKeys.RequestAction,
      keyword.toLowerCase()
    );
    span.setAttribute(ConversationUIUtils.KeywordAttributeKeys.Type, "keyword");

    // Set timeout
    setTimeout(() => {
      span.classList.remove(...pseudoAfterClassName.split(" "));
    }, displayTimeOfTooltip);

    return span;
  }

  /**
   * Use to check if user input has keyword in last input and
   * return regex of keyword
   * @param content
   * @returns
   */
  static getKeywordRegex(content: string) {
    for (const keywordRegex of ConversationUIUtils.Keywords) {
      if (keywordRegex.regex.test(content)) {
        return keywordRegex.regex;
      }
    }

    return null;
  }
}
