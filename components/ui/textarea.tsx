import { useId } from "react";
import React from "react";

/**
 * Textarea component for multi-line text input
 *
 * @param label - Optional label text displayed above the textarea
 * @param error - Error message to display below the textarea
 * @param placeholder - Placeholder text
 * @param disabled - Disables the textarea
 * @param showCharCount - Shows character count below the textarea
 * @param maxLength - Maximum character length (required if showCharCount is true)
 */
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  showCharCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, className = "", id, showCharCount, maxLength, ...props },
    ref
  ) => {
    const [charCount, setCharCount] = React.useState(0);
    const generatedId = useId();
    const textareaId = id || generatedId;

    const baseStyles =
      "w-full px-3 py-2 text-base text-text bg-surface0 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed resize-y";

    const borderStyles = error
      ? "border-red focus:border-red focus:ring-red"
      : "border-overlay0 focus:border-blue focus:ring-blue";

    const combinedClassName =
      `${baseStyles} ${borderStyles} ${className}`.trim();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (showCharCount) {
        setCharCount(e.target.value.length);
      }
      props.onChange?.(e);
    };

    React.useEffect(() => {
      if (props.value && typeof props.value === "string" && showCharCount) {
        setCharCount(props.value.length);
      }
    }, [props.value, showCharCount]);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block mb-1.5 text-sm font-medium text-text"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={combinedClassName}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
        <div className="flex items-center justify-between mt-1.5">
          {error && (
            <p
              id={`${textareaId}-error`}
              className="text-sm text-red"
              role="alert"
            >
              {error}
            </p>
          )}
          {showCharCount && maxLength && (
            <p
              className={`text-sm ml-auto ${
                charCount > maxLength ? "text-red" : "text-subtext0"
              }`}
            >
              {charCount} / {maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
