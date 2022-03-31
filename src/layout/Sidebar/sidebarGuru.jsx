import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { LogoDashboard, LogoJadwal } from "../../components/logo";
let date = new Date();
export default function SidebarGuru() {
 
  return (
    <nav className="flex flex-col space-y-5">
      <NavButton  to="dashboard" title={["Dashoard"]} logo={<LogoDashboard />} />
      <NavButton to="jadwal" title={"Jadwal"} logo={<LogoJadwal />} />
      <NavButton to="kunjungan" title={"Perizinan Kunjungan"} logo={<LogoJadwal />} />
      <NavButton to="pulang" title={"Perizinan Pulang"} logo={<LogoJadwal />} />
      <NavButton
        to="halaqoh"
        title={["Sholat dan Halaqoh"]}
        logo={<LogoDashboard />}
      />
    </nav>
  );
}

function NavButton({ to, title, logo }) {
  let {pathname} = useLocation();
  let url= pathname.split("/")[2];
 
  return (
    <div className="flex items-center  ">
      <div className="w-6 h-6">{logo}</div>
      <NavLink className={`ml-5 text-lg ${url === to ? 'text-green-400' : 'text-gray-600'} font-bold hover:text-green-400`} to={to}>
        {title}
      </NavLink>
    </div>
  );
}
