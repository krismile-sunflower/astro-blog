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
      className={cn("px-5 py-1 rounded-md hover:contrast-150", className)}
    >
     {children}
    </button>
  );
}
