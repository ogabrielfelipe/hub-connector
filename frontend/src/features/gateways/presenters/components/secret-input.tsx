import { useState } from "react";
import { Eye, EyeOff, Copy } from "lucide-react";
import { toast } from "sonner";

interface SecretInputProps {
    value: string | undefined;
}

export function SecretInput({ value }: SecretInputProps) {
    const [isVisible, setIsVisible] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value || "");
        toast.success("Copiado para a área de transferência");
    };

    const maskedValue = value &&
        value.length > 10
        ? `${value.slice(0, 8)}...${value.slice(-4)}`
        : value;

    return (
        <div className="flex items-center justify-between rounded-lg border border-yellow-400 bg-yellow-50 px-4 py-4 my-2 w-full">
            <span className="text-sm font-mono text-gray-700 truncate">
                {isVisible ? value : maskedValue}
            </span>

            <div className="flex items-center gap-2 ml-3">
                <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="text-muted-foreground hover:text-foreground transition"
                >
                    {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                <button
                    type="button"
                    onClick={handleCopy}
                    className="text-muted-foreground hover:text-foreground transition"
                >
                    <Copy size={18} />
                </button>
            </div>
        </div>
    );
}
