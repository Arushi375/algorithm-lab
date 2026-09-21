"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Language = {
  name: string;
  code: string;
};

type CodeViewerProps = {
  languages: Record<string, Language>;
};

export default function CodeViewer({ languages }: CodeViewerProps) {
  const languageKeys = Object.keys(languages);

  const [selectedLanguage, setSelectedLanguage] = useState(
    languageKeys[0]
  );

  const [copied, setCopied] = useState(false);

  const currentLanguage = languages[selectedLanguage];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentLanguage.code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <section className="mt-10 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Implementation
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            View and copy the algorithm in your preferred language.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
        >
          {copied ? (
            <>
              <Check size={16} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy Code
            </>
          )}
        </button>
      </div>

      {/* Language tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-800 px-4 pt-3">
        {languageKeys.map((key) => {
          const language = languages[key];

          const isSelected = selectedLanguage === key;

          return (
            <button
              key={key}
              onClick={() => {
                setSelectedLanguage(key);
                setCopied(false);
              }}
              className={`whitespace-nowrap rounded-t-lg px-4 py-2 text-sm font-medium transition ${
                isSelected
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              {language.name}
            </button>
          );
        })}
      </div>

      {/* Code */}
      <div className="overflow-x-auto bg-[#0b1120] p-5">
        <pre className="text-sm leading-7 text-slate-300">
          <code>{currentLanguage.code}</code>
        </pre>
      </div>
    </section>
  );
}