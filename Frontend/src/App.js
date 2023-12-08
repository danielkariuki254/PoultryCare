import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Route,
  Routes,
  Link,
  Outlet,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Salesgraph from "./routes/Salesgraph";
import "./App.css";

import Home from "./routes/Home";
import Productions from "./routes/Productions";
import Sales from "./routes/Sales";

import Employees from "./routes/Employees";
import Purchases from "./routes/Purchases";
import Mortality from "./routes/Mortality";

import CreateSales from "./routes/CreateSales";
import CreateBirds from "./routes/CreateBirds";
import CreateProductions from "./routes/CreateProductions";
import CreateEmployees from "./routes/CreateEmployees";
import CreatePurchases from "./routes/CreatePurchases";
import CreateMortality from "./routes/CreateMortality";
import EditBirds from "./routes/EditBirds";
import Birds from "./routes/Birds";

import { useState } from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/birds" element={<Birds />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/mortality" element={<Mortality />} />
        <Route path="/productions" element={<Productions />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/createbirds" element={<CreateBirds />} />
        <Route path="/createemployees" element={<CreateEmployees />} />
        <Route path="/createmortality" element={<CreateMortality />} />
        <Route path="/createproductions" element={<CreateProductions />} />
        <Route path="/createpurchases" element={<CreatePurchases />} />
        <Route path="/createsales" element={<CreateSales />} />
        <Route path="/edit/:id" exact component={EditBirds}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;

// const AppLayout = () => {
//   return (
//     <>
//       <Navbar />
//       <Outlet />

//     </>
//   );
// };

// const router = createBrowserRouter([
//   {
//     element: <AppLayout />,

//     children: [
//       {
//         path: "/",
//         element: <Home />,
//       },
//       {
//         path: "productions",
//         element: <Productions />,
//       },
//       {
//         path: "sales",
//         element: <Sales />,
//       },
//       {
//         path: "employees",
//         element: <Employees />,
//       },
//       {
//         path: "purchases",
//         element: <Purchases />,
//       },
//       {
//         path: "mortality",
//         element: <Mortality />,
//       },

//       {
//         path: "birds",
//         element: <Birds />,
//       },
//       {
//         path: "createbirds",
//         element: <CreateBirds />,
//       },

//       {
//         path: "createsales",
//         element: <CreateSales />,
//       },

//       {
//         path: "createproductions",
//         element: <CreateProductions />,
//       },

//       {
//         path: "createemployees",
//         element: <CreateEmployees />,
//       },

//       {
//         path: "createpurchases",
//         element: <CreatePurchases />,
//       },

//       {
//         path: "createmortality",
//         element: <CreateMortality />,
//       },

//       {

//         // path: "editbirds/:id",
//         // element: <EditBirds />,
//       },

//       <Route
//           path="/login"
//           element={
//             <PublicRoutes>
//               <Login />
//             </PublicRoutes>
//           }
//         />,

//       <Route
//           path="/register"
//           element={
//             <PublicRoutes>
//               <Register />
//             </PublicRoutes>
//           }
//       ></Route>,
//       <Route
//           path="/verifyemail/:token"
//           element={
//             <PublicRoutes>
//               <VerifyEmail />
//             </PublicRoutes>
//           }
//       />,

//       <Route
//           path="/resetpassword/:token"
//           element={
//             <PublicRoutes>
//               <ResetPassword />
//             </PublicRoutes>
//           }
//         />,

//       <Route path="/edit/:id" exact routes={EditBirds}></Route>

//     ],
//   },
// ]);

// createRoot(document.getElementById("root")).render(
//   <RouterProvider router={router} />
// )
