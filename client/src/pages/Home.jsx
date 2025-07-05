// src/pages/Home.jsx
const Home = () => {
  return (
    <div
      className="relative h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('\coverphoto.jpg')",
      }}
    >
      {/* Dark Overlay */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div> */}

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Find your solution here
        </h1>

        <p className="text-white text-lg max-w-2xl mb-6">
          Instantly match with top college resources and simplify your academic journey. <br />
          Whether you're stuck with placement prep, notes, or projects—we’ve got your back. <br />
          Dive into a curated pool of content, community, and opportunities built for you.
        </p>

        <button className="bg-primary text-white px-6 py-3 rounded hover:bg-primaryDark transition">
          Explore Here →
        </button>
      </div>
    </div>
  );
};

export default Home;
