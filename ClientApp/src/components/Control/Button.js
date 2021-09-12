import React from "react";
import "./Button.css";
import { AnimatePresence, motion } from "framer-motion";

const Button = ({ className, text, onClick, iconSrc, animate }) => {
  return (
    <AnimatePresence exitBeforeEnter>
      {animate ? (
          <AnimatePresence exitBeforeEnter>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`button ${className}`}
          onClick={onClick}
        >
          <span>{text}</span>
          <img src={iconSrc} />
        </motion.div>
        </AnimatePresence>
      ) : (
        <div className={`button ${className}`} onClick={onClick}>
          <span>{text}</span>
          <img src={iconSrc} />
        </div>
      )}
    </AnimatePresence>
  );
};

export default Button;
