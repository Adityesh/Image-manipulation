import { motion } from "framer-motion";
import React from "react";
import "./Loader.css";
import { useSelector } from "react-redux";
import loader from "../../assets/loader.svg";
const Loader = ({key}) => {
  const isDark = useSelector((state) => state.theme.isDark);

  return (
      <motion.div
        key={key}
        className={isDark ? "loader loader-dark" : "loader"}
        initial={{ scale : 0 }}
        animate={{ scale: 1 }}
        exit={{scale: 1}}
      >
        <img src={loader} className="load-img" alt="loader-svg"/>
        <p className={isDark ? "p dark-p" : "p"}>Loading</p>
      </motion.div>
  );
};

export default Loader;
