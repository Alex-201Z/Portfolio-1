"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedOnScroll({ children, className, delay = 0 }: AnimatedOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
      transition={{ duration: 0.5, delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
