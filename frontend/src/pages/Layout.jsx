import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Todo from './Todo';
import Page404 from './Page404'; 
import PrivateRoute from '../routes/PrivateRoute.js'; 
import PublicRoute from '../routes/PublicRoute.js'; 

const Layout = () => {
    const location = useLocation(); 

    // Определяем класс welcome-wrapper в зависимости от текущего пути
    const welcomeClass = location.pathname === '/home' ? 'todos-wrapper' : 'welcome-wrapper';


    return (
      <div className={welcomeClass}>
        {location.pathname !== '/home' && (
          <div className="welcome-container">
            <h1>Welcome to <br /> Task Tracker</h1>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam officiis placeat odio dolore dignissimos velit, recusandae voluptate vitae debitis nesciunt esse quo, excepturi ipsam ad, non perferendis nostrum earum alias.
            </p>
          </div>
        )}
          <Routes>
            <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/home" element={<PrivateRoute><Todo /></PrivateRoute>} />
            <Route path="*" element={<Page404 />} />
          </Routes>
      </div>
    )
}

export default Layout