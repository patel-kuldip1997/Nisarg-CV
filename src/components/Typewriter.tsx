"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
  className?: string;
}

export default function Typewriter({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 2000,
  className = "",
}: TypewriterProps) {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingDelay, setTypingDelay] = useState(typingSpeed);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      if (!fullText) return;

      if (isDeleting) {
        setText(fullText.substring(0, text.length - 1));
        setTypingDelay(deletingSpeed);
      } else {
        setText(fullText.substring(0, text.length + 1));
        setTypingDelay(typingSpeed);
      }

      if (!isDeleting && text === fullText) {
        setIsDeleting(true);
        setTypingDelay(delayBetweenWords);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingDelay(typingSpeed);
      }
    };

    if (words.length > 0) {
      timer = setTimeout(handleTyping, typingDelay);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, words, typingDelay, typingSpeed, deletingSpeed, delayBetweenWords]);

  if (!words || words.length === 0) return null;

  return (
    <span className={`inline-block ${className}`}>
      {text}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block ml-1 w-[2px] h-[1em] bg-current align-middle"
      />
    </span>
  );
}
