import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Message from "./pages/Message";
import Forgetpassword from "./pages/Forgetpassword";

import {createBrowserRouter,RouterProvider,Route, createRoutesFromElements } from "react-router-dom";
const router= createBrowserRouter(
  createRoutesFromElements(
    <Route>
       <Route path="/" element={<Home/>} />
       <Route path="home" element={<Home/>} />
       <Route path="registration" element={<Registration />} />
       <Route path="login" element={<Login />} />
       <Route path="message" element={<Message />} />
       <Route path="forgetpassword" element={<Forgetpassword />} />

    </Route>
  )
)
function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
