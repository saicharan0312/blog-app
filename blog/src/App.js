import React from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';
import './App.css';
import Home from "./pages/Home/Home";
import NewPost from "./pages/NewPost/NewPost";
import ViewPost from "./pages/ViewPost/ViewPost";
import Profile from "./pages/Profile/Profile";
import MainNavigation from './Navigation/MainNavigation';

const App = () => {

  return (
    <BrowserRouter>
      <div className='left' >
      <MainNavigation />
      </div>
      <div className='right'>
      <Routes>
        <Route 
          path="/" 
          exact 
          Component={ Home }
        >
        </Route>
        <Route 
          path='/blog/blogid' 
          exact 
          Component={ ViewPost }
        >
        </Route>
        <Route
          path='/userid' 
          exact 
          Component={ Profile }
        >
        </Route>
        <Route 
          path='/blog/newblog' 
          exact 
          Component={ NewPost }
        >
        </Route>
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
