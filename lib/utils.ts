import { toast } from "@/components/ui/use-toast";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text: string): void {
  if (!navigator.clipboard) {
    // Fallback for older browsers:
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      const msg = successful ? "Copied to clipboard!" : "Failed to copy";
      console.log(msg);
      toast({
        description: "Link copiado com sucesso",
      });
    } finally {
      document.body.removeChild(textArea);
    }
  } else {
    // Modern approach using Clipboard API:
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          description: "Link copiado com sucesso",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          variant: "destructive",
          description: "Erro ao copiar link",
        });
      });
  }
}
