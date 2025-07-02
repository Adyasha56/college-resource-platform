import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-primaryDark text-background py-4 px-6 mt-10">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto gap-4">
        
        {/* Left: Brand */}
        <h1 className="text-2xl font-bold tracking-wide text-primary">
          College<span className="text-secondary">Hub</span>
        </h1>

        {/* Center: Copyright */}
        <p className="text-sm text-primary">
          &copy; {new Date().getFullYear()} CollegeHub. All rights reserved.
        </p>

        {/* Right: Social Icons */}
        <div className="flex gap-4 text-secondary text-xl">
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <FaGithub />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <FaXTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
