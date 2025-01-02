import { Link } from "react-router";

export default function Home() {
  return (
    <div>
      <nav>
        <Link to="/chat">chat</Link>
      </nav>
    </div>
  );
}
