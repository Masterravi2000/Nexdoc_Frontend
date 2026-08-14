import { useState, useRef, useEffect } from "react";
import { X, ArrowUp } from "lucide-react";
import { useAppDispatch } from "../redux/hook";
import { searchApiThunk } from "../redux/search/searchThunk";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { clearAiResponse } from "../redux/search/searchSlice";
import NexaiLogo from "../components/svg_icons/NexaiLogo";

export interface NexAiSource {
  file_name: string;
  file_type: string;
  file_size: string;
  page_number: number | null;
  slide_number: number | null;
  last_modified: string;
}

export interface NexAiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: NexAiSource[];
}

export interface NexAiProps {
  messages: NexAiMessage[];
  setMessages: React.Dispatch<React.SetStateAction<NexAiMessage[]>>;
  nexaiButton?: React.Dispatch<React.SetStateAction<boolean>>;
  isTyping?: boolean;
  suggestedPrompts?: string[];
  onSendMessage?: (message: string) => void;
  onClose?: () => void;
}

export default function NexAi({
  messages = [],
  setMessages,
  nexaiButton,
  isTyping = false,
}: NexAiProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { aiResponse, loading } = useSelector(
    (state: RootState) => state.search,
  );

  const onClose = () => {
    nexaiButton?.(false);
  };

  useEffect(() => {
    if (!aiResponse) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: aiResponse?.answer,
        sources: aiResponse?.sources,
      },
    ]);
    dispatch(clearAiResponse());
  }, [aiResponse]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}`, role: "user", content: trimmed },
    ]);
    dispatch(
      searchApiThunk({
        query: trimmed,
        mode: "ai",
      }),
    );
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full w-full min-h-0 flex-col border-l-[2px] border-t-[2px] border-gray-100 bg-white">
      {/* Header */}
      <div className="flex items-center h-[83px] min-h-[83px] flex-shrink-0 justify-between border-b-[2px] border-gray-100 px-4.5">
        <div className="flex items-center gap-2.5">
          <NexaiLogo />
          <span className="text-[19px] font-semibold text-gray-800">
            Nex ai
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Nex Ai"
          className="flex p-1.5 items-center justify-center rounded-md border-[2px] border-gray-100 hover:bg-gray-200"
        >
          <X className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
        </button>
      </div>

      {/* Message thread */}
      <div
        ref={scrollRef}
        className="flex flex-1 min-h-0 flex-col gap-5 overflow-y-auto p-6 scrollbar scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-rounded-full scrollbar-track-transparen"
      >
        {messages.length === 0 && !isTyping && (
          <p className="px-4 flex-wrap text-center self-end text-xs leading-relaxed text-gray-400">
            Ask Nex Ai about your documents it can summarize, verify
            facts, or search deeper into what you've found.
          </p>
        )}

        {messages.map((message) =>
          message.role === "user" ? (
            <div key={message.id} className="flex justify-end">
              <div className="max-w-[80%] rounded-lg bg-[#03989e] px-3 py-1.5 text-sm font-[500] leading-relaxed text-white">
                {message.content}
              </div>
            </div>
          ) : (
            <div key={message.id} className="flex justify-start">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-[500] leading-relaxed text-gray-700">
                  {message.content}
                </div>
                {message.sources && message.sources.length > 0 && (
                  <div className="flex flex-row flex-wrap gap-1 items-center">
                    <span className="text-sm font-[500] leading-relaxed text-gray-900">
                      Sources :{" "}
                    </span>
                    {message.sources.map((source, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 border font-[500] border-1 border-gray-400 px-2 py-0.5 text-[10px] text-gray-900 rounded-full"
                      >
                        <span className="font-semibold">
                          {source.file_name}
                        </span>
                        {source.page_number != null && (
                          <span>&middot; Page {source.page_number}</span>
                        )}
                        {source.slide_number != null && (
                          <span>&middot; Slide {source.slide_number}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ),
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-xl bg-gray-100 px-3 py-2 text-[11px] italic text-gray-400">
              Nex Ai is typing&hellip;
            </div>
          </div>
        )}
      </div>

      {/* Suggested prompts + input */}
      <div className="border-t-[2px] border-gray-100 p-5 pb-9">
        <div className="flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 pl-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Nexai for documents..."
            className="flex-1 border-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
            aria-label="Send message"
            className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-lg bg-[#03989e] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="h-3 w-3 text-white" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
