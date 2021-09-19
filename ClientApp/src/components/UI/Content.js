import React, { useRef, useState } from "react";
import Input from "../Control/Input";
import Button from "../Control/Button";
import upload from "../../assets/upload.svg";
import uploadWhite from "../../assets/upload-white.svg";
import searchWhite from "../../assets/search.svg";
import search from "../../assets/search-white.svg";
import filterWhite from "../../assets/filter-white.svg";
import filter from "../../assets/filter.svg";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import "./Content.css";
import FilterModal from "./FilterModal";
import {
  GetResizedImage,
  GetResizedImageByUrl,
} from "../../redux/thunks/Imagethunk";
import Loader from "./Loader";
import { setFilters } from "../../redux/reducers/ImageReducer";

const imageTypes = ["gif", "png", "jpg", "webp", "bmp", "jpeg"];

const Content = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const [filterModal, setFilterModal] = useState(false);
  const dispatch = useDispatch();
  const inputFile = useRef(null);
  const [value, setValue] = useState("");
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const { imageUrl, imageExtension, filters, isLoading } = useSelector(
    (state) => state.image
  );

  const handleFileChange = (e) => {
    setFile(null);
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    let imageExtension = imageTypes.indexOf(file.name.split(".")[1]);
    if (imageExtension === -1) {
      alert("Invalid file type");
      return;
    }

    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.onload = function (e) {
      setFileContent(e.target.result);
    };

    fileReader.onerror = function () {
      setFileContent(fileReader.error);
    };

    setFile(file);
  };
  const handleSearch = () => {
    if (value === "" && file === null) {
      alert("No file selected");
      return;
    }

    if (value !== "") {
      // Image url is supplied
      const payload = {
        payload : {
          Extension: imageExtension,
          ImageUrl: imageUrl,
          Filters: filters,
        },

        reset
      };

      dispatch(GetResizedImageByUrl(payload));

      return;
    }

    // Image file is supplied
    const form = new FormData();
    form.append("Extension", imageExtension);
    form.append("Image", file);
    form.append("FilterString", JSON.stringify(filters));

    dispatch(GetResizedImage({form, reset}));
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  const handleUpload = () => {
    inputFile.current.click();
  };

  const handleFilterModalClose = () => {
    setFileContent(null);
    //setFile(null);
    setFilterModal(false);
  };

  const reset = () => {
    setValue("");
    setFile(null);
    setFileContent(null);
    setFilterModal(false);
    dispatch(setFilters(null));
  };
  const handleFilterModalOpen = () => setFilterModal(true);
  const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/;

  const filterBtnValidity = urlRegex.test(value) || file !== null;

  return (
    <AnimatePresence exitBeforeEnter>
      {!isLoading && (
        <motion.div
          key="content"
          className={`content ${isDark && "content-dark"}`}
        >
          <Input value={value} onChange={handleInputChange} />
          <div className="buttons">
            {value === "" && file === null && (
              <Button
                text="Upload"
                iconSrc={isDark ? uploadWhite : upload}
                onClick={handleUpload}
                className={`upload-button ${isDark && "upload-button-dark"}`}
              />
            )}
            {(file !== null || value !== "") && filters !== null && (
              <Button
                text="Search"
                iconSrc={isDark ? searchWhite : search}
                onClick={handleSearch}
                className={`search-button ${isDark && "search-button-dark"}`}
              />
            )}

            {filterBtnValidity && (
              <Button
                className={`upload-button ${isDark && "upload-button-dark"}`}
                animate={true}
                text="Filters"
                iconSrc={isDark ? filterWhite : filter}
                onClick={handleFilterModalOpen}
              />
            )}
            <input
              onChange={handleFileChange}
              type="file"
              id="image"
              key={file}
              ref={inputFile}
              style={{ display: "none" }}
            />
          </div>
          <FilterModal
            keyValue="modal"
            filterModal={filterModal}
            fileContent={fileContent}
            imageUrl={value}
            file={file}
            handleClose={handleFilterModalClose}
            handleOpen={handleFilterModalOpen}
          />
        </motion.div>
      )}

      {isLoading && <Loader />}
    </AnimatePresence>
  );
};

export default Content;
