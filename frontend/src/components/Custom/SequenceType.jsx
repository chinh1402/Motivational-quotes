import React from 'react'

function SequenceType({ value, onChange, className }) {
    return (
        <select
        className={`input focus:outline-none ${className}`}
        value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="1">Type 1</option>
          <option value="2">Type 2</option>
        </select>
      );
}

export default SequenceType