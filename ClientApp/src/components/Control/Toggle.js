import React from "react";
import './Toggle.css';
import sun from '../../assets/sun.svg';
import moon from '../../assets/moon.svg';
import { useDispatch } from "react-redux";

const Toggle = ({checked, toggleChecked}) => {
    const dispatch = useDispatch();
    const handleChange = () => {
        dispatch(toggleChecked());
    }
    return (
            <label className="switch">
                <input type="checkbox" checked={checked} onChange={handleChange}/>
                <span className="slider round"></span>
                <img className="moon" src={moon} />
                <img src={sun} className="sun" />

            </label>
    )
};

export default Toggle;