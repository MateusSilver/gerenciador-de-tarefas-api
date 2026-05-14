import { LoaderCircle } from "lucide-react";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 16, className = "" }: SpinnerProps) {
  return (
    <LoaderCircle className={`animate-spin ${className || ""}`} size={size} />
  );
}
