import React from 'react'

function DateInput({ value, onChange, className }) {
    return (
        <input
          type="date"
          className={`input focus:outline-none ${className}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
}

export default DateInput