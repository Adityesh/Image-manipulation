import React, { useState } from "react";
import "./FilterModal.css";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Slider, { Handle, SliderTooltip } from "rc-slider";
import "rc-slider/assets/index.css";

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;

  return (
    <SliderTooltip
      prefixCls="rc-slider-tooltip"
      overlay={`${value} %`}
      visible={dragging}
      placement="bottom"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </SliderTooltip>
  );
};

const FilterModal = ({ filterModal, handleClose, handleOpen, fileContent, imageUrl }) => {
  const isDark = useSelector((state) => state.theme.isDark);
  const [filters, setFilters] = useState({
    brightness: 1,
    opacity: 1,
    grayscale: 0,
    contrast: '',
    sepia: 0,
    pixelate: '',
  });

  const handleSliderChange = (value, type) => {
    switch (type) {
      case "brightness":
        setFilters((filter) => {
          return {
            ...filter,
            brightness: value / 100,
          };
        });
        break;
      case "opacity":
        setFilters((filter) => {
          return {
            ...filter,
            opacity: value / 100,
          };
        });
        break;

      case "grayscale":
        setFilters((filter) => {
          return {
            ...filter,
            grayscale: value / 100,
          };
        });
        break;

      case "contrast":
        setFilters((filter) => {
          return {
            ...filter,
            contrast: value / 100,
          };
        });
        break;

      case "pixelate":
        setFilters((filter) => {
          return {
            ...filter,
            pixelate: value,
          };
        });
        break;

      case "sepia":
        setFilters((filter) => {
          return {
            ...filter,
            sepia: value / 100,
          };
        });
        break;
      default:
        return;
    }
  };

  return (
    <AnimatePresence exitBeforeEnter>
      {filterModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.2 }}
          className={`filter-modal ${isDark && "filter-modal-dark"}`}
        >
          <div className="image-container">
            <img
              style={{
                filter: `brightness(${filters.brightness}) opacity(${filters.opacity}) grayscale(${filters.grayscale}) contrast(${filters.contrast}) sepia(${filters.sepia})`,
              }}
              src={fileContent === null ? imageUrl : fileContent}
              className="preview-image"
            />
          </div>
          <div className="control-row">
            <p>Brightness: {Math.trunc(filters.brightness * 100)}%</p>
            <Slider
              min={0}
              max={100}
              defaultValue={100}
              handle={handle}
              onChange={(value) => handleSliderChange(value, "brightness")}
            />
          </div>

          <div className="control-row">
            <p>Opacity: {Math.trunc(filters.opacity * 100)}%</p>
            <Slider
              min={0}
              max={100}
              defaultValue={100}
              handle={handle}
              onChange={(value) => handleSliderChange(value, "opacity")}
            />
          </div>

          <div className="control-row">
            <p>Grayscale: {Math.trunc(filters.grayscale * 100)}%</p>
            <Slider
              min={0}
              max={100}
              defaultValue={0}
              handle={handle}
              onChange={(value) => handleSliderChange(value, "grayscale")}
            />
          </div>

          <div className="control-row">
            <p>Sepia: {Math.trunc(filters.sepia * 100)}%</p>
            <Slider
              min={0}
              max={100}
              defaultValue={0}
              handle={handle}
              onChange={(value) => handleSliderChange(value, "sepia")}
            />
          </div>

          <div className="control-row">
            <p>Contrast: {Math.trunc(filters.contrast * 100)}%</p>
            <Slider
              min={0}
              max={100}
              defaultValue={100}
              handle={handle}
              onChange={(value) => handleSliderChange(value, "contrast")}
            />
          </div>

          <div className="control-row">
            <p>Pixelate: {filters.pixelate}%</p>
            <Slider
              min={0}
              max={100}
              defaultValue={0}
              handle={handle}
              onChange={(value) => handleSliderChange(value, "pixelate")}
            />
          </div>

          <button onClick={handleClose}>Close</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterModal;
