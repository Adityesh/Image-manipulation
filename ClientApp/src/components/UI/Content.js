import React, { useRef, useState } from "react";
import Input from "../Control/Input";
import Button from "../Control/Button";
import upload from "../../assets/upload.svg";
import uploadWhite from "../../assets/upload-white.svg";
import searchWhite from "../../assets/search.svg";
import search from "../../assets/search-white.svg";
import filterWhite from "../../assets/filter-white.svg";
import filter from "../../assets/filter.svg";
import filterColor from "../../assets/filter-color.svg";
import { useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import "./Content.css";
import FilterModal from "./FilterModal";

const imageTypes = ["gif", "png", "jpg", "webp", "bmp", "jpeg"];

const Content = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const [filterModal, setFilterModal] = useState(false);
  const inputFile = useRef(null);
  const [value, setValue] = useState("");
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (imageTypes.indexOf(file.name.split(".")[1]) === -1) {
      alert("Invalid file type");
      return;
    }

    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.onload = function(e) {
      setFileContent(e.target.result);
    }

    fileReader.onerror = function() {
      setFileContent(fileReader.error);
    }


    setFile(file);
  };
  const handleSearch = () => {
    if (value === "" || file === null) {
      alert("No file selected");
    }
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
    setFile(null);
    setFilterModal(false)
  };
  const handleFilterModalOpen = () => setFilterModal(true);
  const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;

  const filterBtnValidity = urlRegex.test(value) || file !== null;
  return (
    <AnimatePresence>
      <div className={`content ${isDark && "content-dark"}`}>
        <Input value={value} onChange={handleInputChange} />
        <div className="buttons">
          {value === "" && <Button
            text="Upload"
            iconSrc={isDark ? uploadWhite : upload}
            onClick={handleUpload}
            className={`upload-button ${isDark && "upload-button-dark"}`}
          />}
          {(file !== null || value !== "") && <Button
            text="Search"
            iconSrc={isDark ? searchWhite : search}
            onClick={handleSearch}
            className={`search-button ${isDark && "search-button-dark"}`}
          />}

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
            ref={inputFile}
            style={{ display: "none" }}
          />
        </div>
        <FilterModal
          filterModal={filterModal}
          fileContent={fileContent}
          imageUrl={value}
          handleClose={handleFilterModalClose}
          handleOpen={handleFilterModalOpen}
        />
      </div>
    </AnimatePresence>
  );
};

export default Content;
