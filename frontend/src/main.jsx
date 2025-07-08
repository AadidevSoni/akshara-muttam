import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import store from '../src/pages/redux/store.js'

import App from './App';
import Login from './pages/auth/Login';
import PlayerList from './pages/players/PlayerList';
import AddPlayer from './pages/players/AddPlayer';
import EditPlayer from './pages/players/EditPlayer';
import Home from './pages/auth/Home';

import PrivateRoute from './components/PrivateRoute.jsx';
import Register from './pages/players/Register.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>

      <Route path ='' element = {<PrivateRoute />}>
        <Route path="playerList" element={<PlayerList />} />
        <Route path="addPlayer" element={<AddPlayer />} />
        <Route path=":id/edit" element={<EditPlayer />} />
      </Route>
      
      <Route index element={<Home />} />
      <Route path="auth" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
