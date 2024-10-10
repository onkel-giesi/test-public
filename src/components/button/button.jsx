import React, { useState } from "react";
import "./button.css";

const Button = ({ label, onClick }) => {
  const [isClicked, setIsClicked] = useState(false);
  const onButtonClick = () => {
    onClick();
    setIsClicked(!isClicked);
  }
  return (
    <input type="button" value={label} className={"button" + isClicked ? " clicked" : ""} onClick={() => onButtonClick()} />
  )
}

export default Button;