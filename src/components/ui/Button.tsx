import { cn } from "@utils/style";
import type React from "preact/compat";

type ButtonProps = {
  onClick: any;
  className: string;
  children: React.ReactNode;
};
export default function Button(props: ButtonProps) {
  const { onClick, className, children } = props;
  return (
    <button
      onClick={onClick}
      className={cn("px-5 py-1 rounded-none border border-pixel-accent text-pixel-accent hover:bg-pixel-accent hover:text-neutralbg", className)}
    >
     {children}
    </button>
  );
}
