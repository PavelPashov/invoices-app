import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../features/auth/LoginPage";
import { InvoicesPage } from "../features/numbers/pages/InvoicesPage";
import { NumbersPage } from "../features/numbers/pages/NumbersPage";
import { TagsPage } from "../features/tags/pages/TagsPage";

export const Routing = () => {

  const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const auth = localStorage.getItem('jwt');
    return auth ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <Routes>
        <Route index element={PrivateRoute({ children: <InvoicesPage /> })} />
        <Route path="/numbers" element={PrivateRoute({ children: <NumbersPage /> })} />
        <Route path="/tags" element={PrivateRoute({ children: <TagsPage /> })} />
        <Route path="/login" element={<LoginPage />} />
      </Routes >
    </>
  );
};