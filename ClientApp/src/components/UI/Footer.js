import React from "react";
import './Footer.css';
import { useSelector } from "react-redux";
const Footer = () => {
    const isDark = useSelector(state => state.theme.isDark);
    return (
        <div className={`footer ${isDark && 'footer-dark'}`}>
            Footer Component
        </div>
    )
};

export default Footer;