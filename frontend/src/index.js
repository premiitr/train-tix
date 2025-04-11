import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Header from './components/Header';
import Body from './components/Body';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Error from './components/Error';
import Login from './components/Login';
import appStore from './utils/appStore';
import { Provider } from 'react-redux';

const Applayout = ()=> {
  
  return (
    <div>
      <Provider store={appStore}>
        <div className="flex flex-col min-h-screen">
          <Header/>
          <div className="flex-grow">
            <Outlet/>
          </div>
        </div>
      </Provider>
    </div>
  );
}

const appRouter = createBrowserRouter([
  {
      path:'/',
      element: <Applayout />,
      children:[
          {
              path:"/",
              element:<Body/>
          },
          {
            path:"/login",
            element:<Login/>
          }
          
      ],
      errorElement:<Error/>
  },
  
])

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><RouterProvider router={appRouter}/></React.StrictMode>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
