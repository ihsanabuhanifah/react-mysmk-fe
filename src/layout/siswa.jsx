import { Link, Outlet } from "react-router-dom";

export default function Siswa() {
  return (
    <div>
      <h1>Ini Halaman Siswa</h1>
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
