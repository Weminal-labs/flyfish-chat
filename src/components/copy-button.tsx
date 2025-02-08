import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Copy, Check } from "lucide-react";

// Import components
import { Button } from "./ui/button";

type CopyCodeButtonProps = {
  text: string;
};

export function CopyButton(props: CopyCodeButtonProps) {
  const [isCopy, setIsCopy] = React.useState(false);

  React.useEffect(() => {
    let timeoutId: any;
    if (isCopy) {
      timeoutId = setTimeout(() => {
        setIsCopy(false);
      }, 2000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isCopy]);

  return (
    <CopyToClipboard text={props.text} onCopy={() => setIsCopy(true)}>
      <Button variant="ghost" size="icon">
        {isCopy ? <Check size={16} /> : <Copy size={16} />}
      </Button>
    </CopyToClipboard>
  );
}

export function CopyCodeButton(props: CopyCodeButtonProps) {
  const [isCopy, setIsCopy] = React.useState(false);

  React.useEffect(() => {
    let timeoutId: any;
    if (isCopy) {
      timeoutId = setTimeout(() => {
        setIsCopy(false);
      }, 2000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isCopy]);
  return (
    <CopyToClipboard text={props.text} onCopy={() => setIsCopy(true)}>
      {isCopy ? (
        <div className="flex flex-row items-center ms-4 cursor-pointer">
          <span className="material-symbols-outlined">done</span>
          <div className="text-sm ms-2">copied</div>
        </div>
      ) : (
        <div className="flex flex-row items-center ms-4 cursor-pointer">
          <span className="material-symbols-outlined">content_copy</span>
          <div className="text-sm ms-2">copy</div>
        </div>
      )}
    </CopyToClipboard>
  );
}
