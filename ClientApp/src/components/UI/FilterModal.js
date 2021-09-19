import React, { useState } from "react";
import "./FilterModal.css";
import Button from "../Control/Button";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Slider, { Handle, SliderTooltip } from "rc-slider";
import "rc-slider/assets/index.css";
import { useDispatch } from "react-redux";
import {
  setFilters,
  setImage,
  setImageUrl,
} from "../../redux/reducers/ImageReducer";
import saveWhite from "../../assets/save-white.svg";
import saveGreen from "../../assets/save-green.svg";
import closeWhite from "../../assets/close-white.svg";
import close from "../../assets/close.svg";

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

const imageTypes = ["gif", "png", "jpg", "webp", "bmp", "jpeg"];

const FilterModal = ({
  filterModal,
  handleClose,
  handleOpen,
  keyValue,
  file,
  fileContent,
  imageUrl,
}) => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);
  const imageFilters = useSelector(state => state.image.filters);
  const [filters, setFilter] = useState(imageFilters ? imageFilters : {
    brightness: 1,
    opacity: 1,
    grayscale: 0,
    contrast: 1,
    sepia: 0,
    pixelate: 0,
    resolution: 1,
  });

  const handleSliderChange = (value, type) => {
    switch (type) {
      case "brightness":
        setFilter((filter) => {
          return {
            ...filter,
            brightness: value / 100,
          };
        });
        break;
      case "opacity":
        setFilter((filter) => {
          return {
            ...filter,
            opacity: value / 100,
          };
        });
        break;

      case "grayscale":
        setFilter((filter) => {
          return {
            ...filter,
            grayscale: value / 100,
          };
        });
        break;

      case "contrast":
        setFilter((filter) => {
          return {
            ...filter,
            contrast: value / 100,
          };
        });
        break;

      case "pixelate":
        setFilter((filter) => {
          return {
            ...filter,
            pixelate: value,
          };
        });
        break;

      case "sepia":
        setFilter((filter) => {
          return {
            ...filter,
            sepia: value / 100,
          };
        });
        break;
      case "resolution":
        setFilter((filter) => {
          return {
            ...filter,
            resolution: value / 100,
          };
        });
        break;
      default:
        return;
    }
  };

  const handleSaveFilters = () => {

    dispatch(setFilters(filters));
    if (file !== null && imageUrl === "") {
      let imageExtension = imageTypes.indexOf(file.name.split(".")[1]);
      if (imageExtension === -1) {
        alert("Invalid file type");
        return;
      }
      const payload = {
        extension: file.name.split(".")[1],
      };
      dispatch(setImage(payload));
    }

    if (file === null && imageUrl !== "") {
      const extension = imageUrl.split(/[#?]/)[0].split(".").pop().trim();
      if (imageTypes.indexOf(extension) === -1) {
        // Image extension could not be retreived
        return;
      }
      dispatch(setImageUrl({ imageUrl, extension }));
    }
    handleClose();
  };

  return (
    <React.Fragment key={keyValue}>
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
                alt="preview-pic"
                style={{
                  filter: `brightness(${filters.brightness}) opacity(${filters.opacity}) grayscale(${filters.grayscale}) contrast(${filters.contrast}) sepia(${filters.sepia})`,
                  transform: `scale(${filters.resolution})`,
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
                defaultValue={imageFilters ? imageFilters.brightness :filters.brightness}
                handle={handle}
                onChange={(value) => handleSliderChange(value, "brightness")}
              />
            </div>

            <div className="control-row">
              <p>Opacity: {Math.trunc(filters.opacity * 100)}%</p>
              <Slider
                min={0}
                max={100}
                defaultValue={imageFilters ? imageFilters.opacity :filters.opacity}
                handle={handle}
                onChange={(value) => handleSliderChange(value, "opacity")}
              />
            </div>

            <div className="control-row">
              <p>Grayscale: {Math.trunc(filters.grayscale * 100)}%</p>
              <Slider
                min={0}
                max={100}
                defaultValue={imageFilters ? imageFilters.grayscale :filters.grayscale}
                handle={handle}
                onChange={(value) => handleSliderChange(value, "grayscale")}
              />
            </div>

            <div className="control-row">
              <p>Sepia: {Math.trunc(filters.sepia * 100)}%</p>
              <Slider
                min={0}
                max={100}
                defaultValue={imageFilters ? imageFilters.sepia :filters.sepia}
                handle={handle}
                onChange={(value) => handleSliderChange(value, "sepia")}
              />
            </div>

            <div className="control-row">
              <p>Contrast: {Math.trunc(filters.contrast * 100)}%</p>
              <Slider
                min={0}
                max={100}
                defaultValue={imageFilters ? imageFilters.contrast :filters.contrast}
                handle={handle}
                onChange={(value) => handleSliderChange(value, "contrast")}
              />
            </div>

            <div className="control-row">
              <p>Pixelate: {filters.pixelate} pixels</p>
              <Slider
                min={0}
                max={10}
                defaultValue={imageFilters ? imageFilters.pixelate :filters.pixelate}
                handle={handle}
                onChange={(value) => handleSliderChange(value, "pixelate")}
              />
            </div>

            <div className="control-row">
              <p>Resolution: {Math.trunc(filters.resolution * 100)}%</p>
              <Slider
                min={10}
                max={100}
                defaultValue={imageFilters ? imageFilters.resolution :filters.resolution}
                handle={handle}
                onChange={(value) => handleSliderChange(value, "resolution")}
              />
            </div>

            <div className={"filter-modal-footer"}>
              <Button
                className={`close-button ${isDark && "close-button-dark"}`}
                animate={true}
                text="Close"
                iconSrc={isDark ? closeWhite : close}
                onClick={handleClose}
              />
              <Button
                className={`save-button ${isDark && "save-button-dark"}`}
                animate={true}
                text="Save"
                iconSrc={isDark ? saveWhite : saveGreen}
                onClick={handleSaveFilters}
              />
            </div>
          </motion.div>
        )}
    </React.Fragment>
  );
};

export default FilterModal;
