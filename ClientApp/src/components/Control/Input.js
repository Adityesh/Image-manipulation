import React from "react";
import './Input.css'
import { useSelector } from "react-redux";

const Input = ({value, onChange}) => {
    const isDark = useSelector(state => state.theme.isDark);


    return (
        <div className="input-row">
            <input value={value} onChange={onChange} className={`input ${isDark && 'input-dark'}`} type="text" placeholder="Enter url of the image" />
        </div>
    )
};


export default Input;