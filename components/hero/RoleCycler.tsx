"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROLES = [
  "Data Engineer",
  "Cloud Data Engineer",
  "Data Base Administrator",
  "AI-Driven Analytics Engineer",
  "Big Data Specialist",
];

export default function RoleCycler() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % ROLES.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative inline-flex h-[1.4em] items-baseline overflow-hidden align-baseline">
      <AnimatePresence mode="wait">
        <motion.span
          key={ROLES[i]}
          initial={{ y: "100%", opacity: 0, rotateX: 35 }}
          animate={{ y: "0%", opacity: 1, rotateX: 0 }}
          exit={{ y: "-100%", opacity: 0, rotateX: -35 }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-gradient-cyber inline-block whitespace-nowrap font-display"
        >
          {ROLES[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
