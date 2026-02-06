import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-[#213448] text-[#ECEFCA] py-4 px-6 mt-10">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto gap-4">
        
        {/* Left: Brand */}
        <h1 className="text-2xl font-bold tracking-wide text-[#547792]">
          Edu<span className="text-[#94B4C1]">Hub</span>
        </h1>

        {/* Center: Copyright */}
        <p className="text-sm text-[#547792]">
          &copy; {new Date().getFullYear()} EduHub. All rights reserved.
        </p>

        {/* Right: Social Icons */}
        <div className="flex gap-4 text-[#94B4C1] text-xl">
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
