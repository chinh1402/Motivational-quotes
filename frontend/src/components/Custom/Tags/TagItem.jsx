import React from "react";

function TagItem({ tag, onRemove, className }) {
  return (
    <div className={`inline-flex items-center bg-green-500 text-white rounded-full px-[8px] h-[22px] text-[12px] z-20 dark:bg-primary-dark whitespace-nowrap ${className}`}>
      <span className="mr-[8px]">{tag}</span>
      <button
        type="button"
        className="text-white font-bold rounded-full w-4 h-4 flex justify-center items-center"
        onClick={() => onRemove(tag)}
      >
        &times;
      </button>
    </div>
  );
}

export default TagItem;
