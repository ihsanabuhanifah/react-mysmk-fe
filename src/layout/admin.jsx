import { Link, Outlet } from "react-router-dom";


export default function Admin() {
  return (
    <div>
      <h1>Welcome to the app!</h1>
      <nav>
        <Link to="dashboard">Invoices</Link> |{" "}
        <Link to="absensi">Dashboard</Link>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
