import { BrowserRouter, Routes } from 'react-router-dom';
import './App.css'
import { userRoutes } from './user/routes';
import { adminRoutes } from './admin/routes';
import ScrollToTop from './user/compoents/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {userRoutes}
        {adminRoutes}
      </Routes>
    </BrowserRouter>
  );
}

export default App
