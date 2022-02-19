import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div>
      <p>404 Not Found</p>
      <Link to="/guru">Home</Link>
    </div>
  );
}
