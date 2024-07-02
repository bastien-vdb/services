import clsx from "clsx";

const TextGradient = ({
  text,
  additionalClassName,
}: {
  text: string;
  additionalClassName: string;
}) => {
  return (
    <h1
      className={clsx(
        "animate-textGradient bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-3xl font-semibold text-transparent",
        additionalClassName
      )}
    >
      {text}
    </h1>
  );
};

export default TextGradient;
