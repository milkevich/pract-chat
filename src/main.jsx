import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import App from './App';
import LogIn from './Pages/LogIn';
import Protected from './Protected';
import { MainLayout } from './Components/MainLayout';
import Chat from './Pages/Chat';
import SignUp from './Pages/SignUp';
import { ChatContextProvider } from './Contexts/ChatContext';
import UserContextProvider from './Contexts/UserContext';
import ErrorBoundary from './Pages/ErrorBoundary';
import NotFound from './Components/NotFound';
import Settings from './Pages/Settings';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/pract-chat/' element={<App />}>
      <Route element={<MainLayout />}>
        <Route path='/pract-chat/log-in' element={<LogIn />} />
        <Route path='/pract-chat/sign-up' element={<SignUp />} />
        <Route path="/pract-chat/*" element={<NotFound />} errorElement={<NotFound />} />
        <Route path="/pract-chat/settings" element={<Settings />} />
        <Route element={<Protected />}>
          <Route path='/pract-chat/chat' element={<Chat />} />
        </Route>
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserContextProvider>
    <ChatContextProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </ChatContextProvider>
  </UserContextProvider>
);
