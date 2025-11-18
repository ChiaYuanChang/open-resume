import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { InputGroupWrapper, INPUT_CLASS_NAME } from "./InputGroup";

interface MarkdownEditorProps<K extends string> {
  label: string;
  labelClassName?: string;
  name: K;
  value?: string;
  placeholder: string;
  onChange: (name: K, value: string) => void;
}

export const MarkdownEditor = <K extends string>({
  label,
  labelClassName,
  name,
  value = "",
  placeholder,
  onChange,
}: MarkdownEditorProps<K>) => {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <InputGroupWrapper label={label} className={labelClassName}>
      <div className="relative">
        {/* Toggle buttons */}
        <div className="flex mb-2 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1 text-sm font-medium border-b-2 ${
              !isPreview
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1 text-sm font-medium border-b-2 ${
              isPreview
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Preview
          </button>
        </div>

        {/* Editor or Preview */}
        {!isPreview ? (
          <textarea
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(name, e.target.value)}
            className={`${INPUT_CLASS_NAME} resize-none min-h-[120px] font-mono text-sm`}
            rows={6}
          />
        ) : (
          <div className={`${INPUT_CLASS_NAME} min-h-[120px] bg-gray-50`}>
            {value ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  // Custom components for better styling
                  div: ({ children }) => (
                    <div className="prose prose-sm max-w-none">{children}</div>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-lg font-bold mb-2">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-bold mb-2">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-bold mb-1">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-2 last:mb-0">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-2">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="mb-1">{children}</li>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-blue-600 hover:text-blue-800 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic">{children}</em>
                  ),
                  code: ({ children }) => (
                    <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-2">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400 italic">No content to preview</p>
            )}
          </div>
        )}

        {/* Help text */}
        <div className="mt-1 text-xs text-gray-500">
          Supports Markdown: **bold**, *italic*, [links](url), # headers, - lists, etc.<br />
          <span className="text-blue-600">Tip:</span> Use double line breaks (empty line) to create new paragraphs, or add two spaces at the end of a line for a line break.
        </div>
      </div>
    </InputGroupWrapper>
  );
};