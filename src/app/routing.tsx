import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../features/auth/LoginPage";
import { NumbersPage } from "../features/numbers/pages/NumbersPage";

export const Routing = () => {

  const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const auth = localStorage.getItem('jwt');
    return auth ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <Routes>
        <Route index element={<div>Fakturi</div>} />
        <Route path="/numbers" element={PrivateRoute({ children: <NumbersPage /> })} />
        <Route path="/login" element={<LoginPage />} />
      </Routes >
    </>
  );
};