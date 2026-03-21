import { useState, useRef } from "react";
import { 
  Sparkles, 
  Send, 
  Mic, 
  AlertCircle,
  Command
} from "lucide-react";
import { processText } from "../services/api";
import type { ParseResponse } from "../types";

type InputBoxProps = {
  setResult: (data: ParseResponse) => void;
  setVisitId: (id: number) => void;
};

export default function InputBox({ setResult, setVisitId }: InputBoxProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!input.trim()) {
      setError("Please enter patient data first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await processText(input);
      setResult(data);
      setVisitId(data.visit_id);
      setInput("");
      textareaRef.current?.blur();
    } catch {
      setError("Classification failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const startRecording = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        setError("Error with speech recognition. Please try again.");
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } else {
      setError("Speech recognition is not supported in your browser.");
    }
  };

  const charCount = input.length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 transition-all hover:shadow-md">
      {/* Card header */}
      <div className="px-4 sm:px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">
              Unified Clinical Input
            </p>
            <p className="text-xs text-gray-500 hidden sm:block">
              Type everything together — drugs, tests, observations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono">{charCount} chars</span>
          <button
            onClick={startRecording}
            disabled={isRecording}
            className={`p-1.5 rounded-lg transition-all ${
              isRecording 
                ? 'bg-red-100 text-red-600 animate-pulse' 
                : 'hover:bg-gray-100 text-gray-500'
            }`}
            title="Voice Input"
          >
            <Mic size={16} />
          </button>
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          rows={5}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          onKeyDown={e => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
          }}
          placeholder="e.g. paracetamol 500mg TDS x5 days, FBC, blood glucose, fever 38°C, review in 1 week"
          className={`w-full px-4 sm:px-5 py-4 border-none outline-none resize-none font-sans text-sm leading-relaxed text-gray-900 ${
            loading ? "bg-gray-50" : "bg-white"
          }`}
        />
      </div>

      {/* Footer bar */}
      <div className="px-4 sm:px-5 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50">
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <Command size={12} />
          <span>+ Enter to classify</span>
        </p>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Classifying...
            </>
          ) : (
            <>
              <Send size={16} />
              Classify with AI
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="px-4 sm:px-5 py-2.5 bg-red-50 border-t border-red-200 text-xs text-red-600 flex items-center gap-1.5">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}