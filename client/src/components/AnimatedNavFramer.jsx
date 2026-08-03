import * as React from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Navigation, Terminal as TerminalIcon, UserPlus } from "lucide-react";
import { cn } from "../lib/utils";
import TerminalModal from "./TerminalModal.jsx";

const LOGO_URL = "https://cdn.discordapp.com/icons/1502687570532892822/63f1bd18e0e26427b501578177600e0c.webp?size=240&quality=lossless";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
  { name: "Team", href: "/team" },
];

const EXPAND_SCROLL_THRESHOLD = 80;

const containerVariants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: "auto",
    transition: {
      y: { type: "spring", damping: 18, stiffness: 250 },
      opacity: { duration: 0.3 },
      type: "spring",
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  collapsed: {
    y: 0,
    opacity: 1,
    width: "3rem",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const logoVariants = {
  expanded: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -25, rotate: -180, transition: { duration: 0.3 } },
};

const itemVariants = {
  expanded: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.2 } },
};

const collapsedIconVariants = {
  expanded: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  collapsed: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", damping: 15, stiffness: 300, delay: 0.15 },
  },
};

export default function AnimatedNavFramer() {
  const [isExpanded, setExpanded] = React.useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = React.useState(false);

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;

    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest;
    } else if (
      !isExpanded &&
      latest < previous &&
      scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD
    ) {
      setExpanded(true);
    }

    lastScrollY.current = latest;
  });

  const handleNavClick = (e) => {
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={containerVariants}
          whileHover={!isExpanded ? { scale: 1.1 } : {}}
          whileTap={!isExpanded ? { scale: 0.95 } : {}}
          onClick={handleNavClick}
          className={cn(
            "flex items-center overflow-hidden rounded-full border h-12",
            "bg-obsidian-900/80 border-white/10 backdrop-blur-sm shadow-lg",
            !isExpanded && "cursor-pointer justify-center"
          )}
        >
          {/* Brand Logo */}
          <motion.div
            variants={logoVariants}
            className="flex-shrink-0 flex items-center gap-2 pl-4 pr-2"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0">
              <img
                src={LOGO_URL}
                alt="NVIDIA Club"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Nav Links */}
          <motion.div
            className={cn(
              "flex items-center gap-1 sm:gap-2 pr-2",
              !isExpanded && "pointer-events-none"
            )}
          >
            {navItems.map((item) => (
              <motion.div key={item.name} variants={itemVariants}>
                <Link
                  to={item.href}
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm font-medium text-gray-300 hover:text-nvidia transition-colors px-2 py-1 rounded-full hover:bg-white/5"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}

            {/* CLI Terminal Button */}
            <motion.div variants={itemVariants}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTerminalOpen(true);
                }}
                className="text-sm font-medium text-nvidia hover:text-nvidia-light transition-colors px-2 py-1 rounded-full hover:bg-nvidia/10 flex items-center gap-1"
              >
                <TerminalIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CLI</span>
              </button>
            </motion.div>

            {/* Join Club Button */}
            <motion.div variants={itemVariants}>
              <Link
                to="/events"
                onClick={(e) => e.stopPropagation()}
                className="text-sm font-semibold text-black bg-nvidia hover:bg-nvidia-light transition-colors px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-nvidia-glow"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Join</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Collapsed Menu Icon */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              variants={collapsedIconVariants}
              animate={isExpanded ? "expanded" : "collapsed"}
            >
              <div className="w-6 h-6 rounded-md overflow-hidden">
                <img
                  src={LOGO_URL}
                  alt="NVIDIA Club"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </motion.nav>
      </div>

      {/* Terminal Modal */}
      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
    </>
  );
}
