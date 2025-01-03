import { Link, Outlet } from "react-router";

const links = [
  { path: "/", label: "Home" },
  { path: "/chat", label: "Chat" },
];

export default function RootLayout() {
  return (
    <>
      <header className="sticky top-0">
        <div className="container">
          <nav className="py-4">
            <ul className="flex gap-6">
              {links.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div className="container py-10">
        <Outlet />
      </div>
    </>
  );
}
