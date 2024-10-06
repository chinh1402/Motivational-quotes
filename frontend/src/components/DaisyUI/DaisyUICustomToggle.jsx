import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNightMode } from '../../redux/slices/adminQuoteSlices'; 

function DaisyUIToggle() {
  const dispatch = useDispatch();
  const nightMode = useSelector((state) => state.admin.nightMode);

  const handleToggleChange = (e) => {
    dispatch(setNightMode(e.target.checked)); // Dispatch toggle state to Redux
  };

  return (
    <input
      type="checkbox"
      className="toggle toggle-lg text-primary-light"
      checked={nightMode}
      onChange={handleToggleChange}
    />
  );
}

export default DaisyUIToggle;
