import React from "react";
import './Footer.css';
import { useSelector } from "react-redux";
const Footer = () => {
    const isDark = useSelector(state => state.theme.isDark);
    return (
        <div className={`footer ${isDark && 'footer-dark'}`}>
            Made by <a rel="noopener noreferrer" target="_blank" style={{ textDecoration : 'none', color : "#FF4C29"}} href="https://github.com/Adityesh">Adityesh</a>
        </div>
    )
};

export default Footer;