import { ChevronUp } from "lucide-react";
import React, { useState, useEffect } from "react";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`focus:ring-2focus:ring-opacity-50 fixed bottom-4 left-4 z-40 rounded-full bg-white p-3 shadow-xl transition-opacity duration-300 hover:bg-neutral-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      aria-label="Scroll to top"
    >
      <ChevronUp className="text-black" />
    </button>
  );
};

export default ScrollToTopButton;
