import { cn } from "@utils/style";
import type React from "preact/compat";
import type { Signal } from '@preact/signals';

type ButtonProps = {
  count: Signal<number>;
  className: string;
  children: React.ReactNode;
};
export default function Button(props: ButtonProps) {
  const { count, className, children } = props;
  const handle = () => {
   count.value++;
  };
  return (
    <>
	{count}
	<button
      onClick={handle}
      className={cn("px-5 py-1 rounded-md hover:contrast-150", className)}
    >
     {children}
    </button>
	</>
  );
}
