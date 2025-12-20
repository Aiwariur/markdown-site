import { useState, useRef, useEffect, useCallback } from "react";
import { Copy, MessageSquare, Sparkles, Search, Check, AlertCircle, FileText, Download } from "lucide-react";

// Maximum URL length for query parameters (conservative limit)
const MAX_URL_LENGTH = 6000;

// AI service configurations
interface AIService {
  id: string;
  name: string;
  icon: typeof Copy;
  baseUrl: string;
  description: string;
  supportsUrlPrefill: boolean;
  // Custom URL builder for services with special formats
  buildUrl?: (prompt: string) => string;
}

// All services send the full markdown content directly
const AI_SERVICES: AIService[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: MessageSquare,
    baseUrl: "https://chatgpt.com/",
    description: "Analyze with ChatGPT",
    supportsUrlPrefill: true,
    // ChatGPT accepts ?q= with full text content
    buildUrl: (prompt) => `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
  },
  {
    id: "claude",
    name: "Claude",
    icon: Sparkles,
    baseUrl: "https://claude.ai/new",
    description: "Analyze with Claude",
    supportsUrlPrefill: true,
    buildUrl: (prompt) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
  },
  {
    id: "perplexity",
    name: "Perplexity",
    icon: Search,
    baseUrl: "https://www.perplexity.ai/search",
    description: "Research with Perplexity",
    supportsUrlPrefill: true,
    buildUrl: (prompt) => `https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}`,
  },
];

// Extended props interface with optional metadata
interface CopyPageDropdownProps {
  title: string;
  content: string;
  url: string;
  slug: string;
  description?: string;
  date?: string;
  tags?: string[];
  readTime?: string;
}

// Enhanced markdown format for better LLM parsing
function formatAsMarkdown(props: CopyPageDropdownProps): string {
  const { title, content, url, description, date, tags, readTime } = props;
  
  // Build metadata section
  const metadataLines: string[] = [];
  metadataLines.push(`Source: ${url}`);
  if (date) metadataLines.push(`Date: ${date}`);
  if (readTime) metadataLines.push(`Reading time: ${readTime}`);
  if (tags && tags.length > 0) metadataLines.push(`Tags: ${tags.join(", ")}`);
  
  // Build the full markdown document
  let markdown = `# ${title}\n\n`;
  
  // Add description if available
  if (description) {
    markdown += `> ${description}\n\n`;
  }
  
  // Add metadata block
  markdown += `---\n${metadataLines.join("\n")}\n---\n\n`;
  
  // Add main content
  markdown += content;
  
  return markdown;
}

// Format content as an Agent Skill file for AI agents
function formatAsSkill(props: CopyPageDropdownProps): string {
  const { title, content, url, description, tags } = props;
  
  const generatedDate = new Date().toISOString().split("T")[0];
  const tagList = tags && tags.length > 0 ? tags.join(", ") : "none";
  
  let skill = `# ${title}\n\n`;
  skill += `## Metadata\n`;
  skill += `- Source: ${url}\n`;
  skill += `- Tags: ${tagList}\n`;
  skill += `- Generated: ${generatedDate}\n\n`;
  
  if (description) {
    skill += `## When to use this skill\n`;
    skill += `${description}\n\n`;
  }
  
  skill += `## Instructions\n`;
  skill += content;
  
  return skill;
}

// Check if URL length exceeds safe limits
function isUrlTooLong(url: string): boolean {
  return url.length > MAX_URL_LENGTH;
}

// Feedback state type
type FeedbackState = "idle" | "copied" | "error" | "url-too-long";

export default function CopyPageDropdown(props: CopyPageDropdownProps) {
  const { title } = props;
  
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  // Clear feedback after delay
  const clearFeedback = useCallback(() => {
    setTimeout(() => {
      setFeedback("idle");
      setFeedbackMessage("");
    }, 2000);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    function handleKeyDown(event: KeyboardEvent) {
      const menu = menuRef.current;
      if (!menu) return;

      const items = menu.querySelectorAll<HTMLButtonElement>(".copy-page-item");
      const currentIndex = Array.from(items).findIndex(
        (item) => item === document.activeElement
      );

      switch (event.key) {
        case "Escape":
          setIsOpen(false);
          triggerRef.current?.focus();
          break;
        case "ArrowDown":
          event.preventDefault();
          if (currentIndex < items.length - 1) {
            items[currentIndex + 1].focus();
          } else {
            items[0].focus();
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (currentIndex > 0) {
            items[currentIndex - 1].focus();
          } else {
            items[items.length - 1].focus();
          }
          break;
        case "Home":
          event.preventDefault();
          items[0]?.focus();
          break;
        case "End":
          event.preventDefault();
          items[items.length - 1]?.focus();
          break;
        case "Tab":
          // Close dropdown on tab out
          if (!event.shiftKey && currentIndex === items.length - 1) {
            setIsOpen(false);
          }
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus first item when dropdown opens
  useEffect(() => {
    if (isOpen && firstItemRef.current) {
      // Small delay to ensure menu is rendered
      setTimeout(() => firstItemRef.current?.focus(), 10);
    }
  }, [isOpen]);

  // Safe clipboard write with error handling
  const writeToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fallback for older browsers or permission issues
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        return true;
      } catch {
        console.error("Failed to copy to clipboard:", error);
        return false;
      }
    }
  };

  // Handle copy page action with error handling
  const handleCopyPage = async () => {
    const markdown = formatAsMarkdown(props);
    const success = await writeToClipboard(markdown);
    
    if (success) {
      setFeedback("copied");
      setFeedbackMessage("Copied!");
    } else {
      setFeedback("error");
      setFeedbackMessage("Failed to copy");
    }
    
    clearFeedback();
    setTimeout(() => setIsOpen(false), 1500);
  };

  // Generic handler for opening AI services
  // All services receive the full markdown content directly
  const handleOpenInAI = async (service: AIService) => {
    const markdown = formatAsMarkdown(props);
    const prompt = `Please analyze this article:\n\n${markdown}`;
    
    // Build the target URL using the service's buildUrl function
    if (!service.buildUrl) {
      // Fallback: copy to clipboard and open base URL
      const success = await writeToClipboard(markdown);
      if (success) {
        setFeedback("url-too-long");
        setFeedbackMessage("Copied! Paste in " + service.name);
        window.open(service.baseUrl, "_blank");
      } else {
        setFeedback("error");
        setFeedbackMessage("Failed to copy content");
      }
      clearFeedback();
      return;
    }
    
    const targetUrl = service.buildUrl(prompt);
    
    // Check URL length - if too long, copy to clipboard instead
    if (isUrlTooLong(targetUrl)) {
      const success = await writeToClipboard(markdown);
      if (success) {
        setFeedback("url-too-long");
        setFeedbackMessage("Copied! Paste in " + service.name);
        window.open(service.baseUrl, "_blank");
      } else {
        setFeedback("error");
        setFeedbackMessage("Failed to copy content");
      }
      clearFeedback();
    } else {
      // URL is within limits, open directly with prefilled content
      window.open(targetUrl, "_blank");
      setIsOpen(false);
    }
  };

  // Handle download skill file
  const handleDownloadSkill = () => {
    const skillContent = formatAsSkill(props);
    const blob = new Blob([skillContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${props.slug}-skill.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up object URL
    URL.revokeObjectURL(url);
    
    setFeedback("copied");
    setFeedbackMessage("Downloaded!");
    clearFeedback();
    setTimeout(() => setIsOpen(false), 1500);
  };

  // Get feedback icon
  const getFeedbackIcon = () => {
    switch (feedback) {
      case "copied":
        return <Check size={16} className="copy-page-icon feedback-success" />;
      case "error":
        return <AlertCircle size={16} className="copy-page-icon feedback-error" />;
      case "url-too-long":
        return <Check size={16} className="copy-page-icon feedback-warning" />;
      default:
        return <Copy size={16} className="copy-page-icon" />;
    }
  };

  return (
    <div className="copy-page-dropdown" ref={dropdownRef}>
      {/* Trigger button with ARIA attributes */}
      <button
        ref={triggerRef}
        className="copy-page-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="copy-page-menu"
        aria-label={`Copy or share: ${title}`}
      >
        <Copy size={14} aria-hidden="true" />
        <span>Copy page</span>
        <svg
          className={`dropdown-chevron ${isOpen ? "open" : ""}`}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M2.5 4L5 6.5L7.5 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown menu with ARIA role */}
      {isOpen && (
        <div
          ref={menuRef}
          id="copy-page-menu"
          className="copy-page-menu"
          role="menu"
          aria-label="Copy and share options"
        >
          {/* Copy page option */}
          <button
            ref={firstItemRef}
            className="copy-page-item"
            onClick={handleCopyPage}
            role="menuitem"
            tabIndex={0}
          >
            {getFeedbackIcon()}
            <div className="copy-page-item-content">
              <span className="copy-page-item-title">
                {feedback !== "idle" ? feedbackMessage : "Copy page"}
              </span>
              <span className="copy-page-item-desc">
                Copy as Markdown for LLMs
              </span>
            </div>
          </button>

          {/* AI service options */}
          {AI_SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                className="copy-page-item"
                onClick={() => handleOpenInAI(service)}
                role="menuitem"
                tabIndex={0}
              >
                <Icon size={16} className="copy-page-icon" aria-hidden="true" />
                <div className="copy-page-item-content">
                  <span className="copy-page-item-title">
                    Open in {service.name}
                    <span className="external-arrow" aria-hidden="true">↗</span>
                  </span>
                  <span className="copy-page-item-desc">
                    {service.description}
                  </span>
                </div>
              </button>
            );
          })}

          {/* View as Markdown option */}
          <button
            className="copy-page-item"
            onClick={() => {
              window.open(`/raw/${props.slug}.md`, "_blank");
              setIsOpen(false);
            }}
            role="menuitem"
            tabIndex={0}
          >
            <FileText size={16} className="copy-page-icon" aria-hidden="true" />
            <div className="copy-page-item-content">
              <span className="copy-page-item-title">
                View as Markdown
                <span className="external-arrow" aria-hidden="true">↗</span>
              </span>
              <span className="copy-page-item-desc">
                Open raw .md file
              </span>
            </div>
          </button>

          {/* Generate Skill option */}
          <button
            className="copy-page-item"
            onClick={handleDownloadSkill}
            role="menuitem"
            tabIndex={0}
          >
            <Download size={16} className="copy-page-icon" aria-hidden="true" />
            <div className="copy-page-item-content">
              <span className="copy-page-item-title">
                Generate Skill
              </span>
              <span className="copy-page-item-desc">
                Download as AI agent skill
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
