import "./Navbar.css";
import { SimpleChronosLogo } from "./Logo";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <a href="/" className="navbar-logo">
             <SimpleChronosLogo/>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
