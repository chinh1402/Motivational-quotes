import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';

function App() {
  const dispatch = useDispatch();
  const nightMode = useSelector((state) => state.admin.nightMode);

  useEffect(() => {
    if (nightMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [nightMode]);

  return (
    <div className="bg-pageBg-light dark:bg-pageBg-dark h-screen relative overflow-scroll">
      {/* Global components like Navbar */}
      <AppRoutes />
      {/* Footer */}
    </div>
  );
}

export default App;
