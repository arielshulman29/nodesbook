import { useState } from "react";

export type CopiedValue = string | null;
export type CopyFn = (text: string) => void;

export const useCopyToClipboard = (): [CopiedValue, CopyFn] => {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const CopyTextElement = async (text: string): Promise<boolean> => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Prevent scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      await document.execCommand("copy");
      setCopiedText(text);
      return true;
    } catch (error) {
      setCopiedText(null);
      return false;
    } finally {
      textArea.remove();
    }
  };

  const copy: CopyFn = async (text: string) => {
    let success = false;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      success = true;
    } catch (error) {
      success = await CopyTextElement(text);
    }
  };

  return [copiedText, copy];
};
