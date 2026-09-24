"use client";

import { FaLinkedin, FaLink } from "react-icons/fa";
import { SiGithub, SiInstagram, SiFacebook } from "react-icons/si";
import React, { useState, useRef, useEffect } from "react";
import { Mail } from "lucide-react";
import { sendEmailAction } from "@/app/actions/sendEmail";

export default function Messages() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error" | null;
  }>({ text: "", type: null });

  const containerRef = useRef<HTMLDivElement>(null);
  const maxLength = 192;

  // Handle outside clicks to close the message box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage({ text: "", type: null });

    const formData = new FormData();
    formData.append("email", email);
    formData.append("message", text);

    const result = await sendEmailAction(formData);

    if (result.success) {
      setStatusMessage({
        text: "Message sent successfully!",
        type: "success",
      });
      setText("");
      setEmail("");
    } else {
      setStatusMessage({
        text: result.error || "Failed to send message.",
        type: "error",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <aside
      ref={containerRef}
      className="flex flex-col relative w-12 h-12 items-center justify-center transition-all duration-300 ease-in-out border border-[var(--primary-color)] rounded-full bg-black/20"
    >
      {/* 1. Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative flex items-center justify-center w-16 h-6 rounded-full bg-black hover:bg-black/50 border border-[rgba(255,255,255,0.1)] text-[var(--primary-color)] transition-all cursor-pointer"
      >
        <div className="w-full h-full flex flex-col items-center gap-6 text-[var(--text-color-secondary)]">
          <Mail className="w-full h-full hover:text-[var(--primary-color)]" />
        </div>
      </button>

      {/* 2. Expanded Contact Field */}
      {isExpanded && (
        <div className="expandMessages absolute z-50 top-15 left-0 w-[280px] sm:w-[20vw] min-w-[280px] p-4 transition-all duration-300 ease-in-out border border-[var(--primary-color)] rounded-lg bg-black/95 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <h2 className="tracking-[4px] text-xl md:text-2xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              contact me
            </h2>

            <ul className="flex flex-col gap-4">
              <li className="flex flex-col gap-1 text-sm">
                <label htmlFor="email" className="text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="p-2 border border-[var(--primary-color)] rounded bg-black/50 text-white text-sm outline-none focus:ring-1 focus:ring-[var(--primary-color)]"
                />
              </li>

              <li className="flex flex-col gap-1 text-sm">
                <label htmlFor="message" className="text-gray-300">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="Enter your message"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={maxLength}
                  className="p-2 whitespace-pre-line resize-none border border-[var(--primary-color)] rounded bg-black/50 text-white text-sm outline-none focus:ring-1 focus:ring-[var(--primary-color)]"
                />
              </li>

              {/* Status & Counter Row */}
              <div className="flex justify-between items-center text-xs font-mono">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1 bg-black hover:bg-black/50 border border-[var(--primary-color)] rounded text-[var(--primary-color)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </button>

                <div className="text-right text-gray-400">
                  <span
                    className={
                      text.length >= maxLength ? "text-red-400 font-bold" : ""
                    }
                  >
                    {text.length}
                  </span>
                  /{maxLength}
                </div>
              </div>

              {/* Submission Notification Message */}
              {statusMessage.text && (
                <p
                  className={`text-xs font-mono mt-1 ${
                    statusMessage.type === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {statusMessage.text}
                </p>
              )}
            </ul>

            <h2 className="tracking-[4px] text-xl md:text-2xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mt-2">
              social
            </h2>

            <ul className="flex justify-between items-center py-2">
              <li>
                <a
                  href="https://mohamed-adil-portfolio-nine.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--primary-color)] text-white transition-colors"
                >
                  <FaLink size={24} />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Abonsama"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--primary-color)] text-white transition-colors"
                >
                  <SiGithub size={24} />
                </a>
              </li>
              <li>
                <a
                  href="https://in/mohamed-adil-9a12322b4"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--primary-color)] text-white transition-colors"
                >
                  <FaLinkedin size={24} />
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--primary-color)] text-white transition-colors"
                >
                  <SiInstagram size={24} />
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--primary-color)] text-white transition-colors"
                >
                  <SiFacebook size={24} />
                </a>
              </li>
            </ul>
          </form>
        </div>
      )}
    </aside>
  );
}