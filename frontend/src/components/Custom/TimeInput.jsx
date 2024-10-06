import React from "react";

function TimeInput({ value, onChange, className }) {
  return (
    <input
      type="time"
      className={`input focus:outline-none ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default TimeInput;
