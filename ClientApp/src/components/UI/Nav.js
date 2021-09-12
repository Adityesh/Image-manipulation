import React from "react";
import Toggle from "../Control/Toggle";
import { useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/reducers/ThemeReducer';
import './Nav.css';

const Nav = () => {
    const isDark = useSelector(state => state.theme.isDark);

    return (
        <div id="Nav" className={`${isDark ? 'nav-dark' : ''}`}>
            <div className="options">options drop down</div>
            <div className={`title ${isDark && 'title-dark'}`}>Image Manipulation</div>
            <div className="toggle"><Toggle checked={isDark} toggleChecked={toggleTheme}/></div>
        </div>
    )
}

export default Nav;