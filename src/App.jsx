import { BrowserRouter } from "react-router-dom";
import React, { useEffect, useContext } from 'react';
import AppContext from './context/AppContext';
import SwitchLayout from './SwitchLayout';

function App() {
  const { setActiveUser } = useContext(AppContext);

  useEffect(() => {
    const storedUser = localStorage.getItem('activeUser');
    if (storedUser) {
      setActiveUser(JSON.parse(storedUser));
    }
  }, [setActiveUser]);
  return (
    <BrowserRouter>
      <SwitchLayout/>
    </BrowserRouter>
  );
}

export default App;
