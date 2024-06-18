import React, { ButtonHTMLAttributes, PropsWithChildren } from "react";

type TextRevealButtonProps = PropsWithChildren<
  {
    arrowPosition: "left" | "right";
    bg?: string;
  } & ButtonHTMLAttributes<HTMLButtonElement>
>;

const TextRevealButton: React.FC<TextRevealButtonProps> = ({
  children,
  arrowPosition = "right",
  bg = "bg-gray-400",
  ...props
}) => {
  const isRight = arrowPosition === "right";

  return (
    <button
      {...props}
      className={`group/button relative inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full ${bg} font-medium text-white transition-all duration-300 hover:w-24`}
    >
      <p
        className={`inline-flex whitespace-nowrap text-xs opacity-0 transition-all duration-200 ${
          isRight
            ? "group-hover/button:-translate-x-2.5"
            : "group-hover/button:translate-x-2.5"
        } group-hover/button:opacity-100`}
      >
        {children}
      </p>
      <div className={`absolute ${isRight ? "right-1.5" : "left-1.5"}`}>
        <svg
          viewBox="0 0 15 15"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 fill-white"
        >
          <path
            d={
              isRight
                ? "M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                : "M6.85355 3.14645C6.65829 2.95118 6.34171 2.95118 6.14645 3.14645L2.14645 7.14645C1.95118 7.34171 1.95118 7.65829 2.14645 7.85355L6.14645 11.8536C6.34171 12.0488 6.65829 12.0488 6.85355 11.8536C7.04882 11.6583 7.04882 11.3417 6.85355 11.1464L3.70711 8H12.5C12.7761 8 13 7.77614 13 7.5C13 7.22386 12.7761 7 12.5 7H3.70711L6.85355 3.85355C7.04882 3.65829 7.04882 3.34171 6.85355 3.14645Z"
            }
          ></path>
        </svg>
      </div>
    </button>
  );
};

export default TextRevealButton;
