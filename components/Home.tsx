import React from "react";
import Navbar from "./ui/navbar";

const Home = () => {
  return (
    <div>
      <Navbar
        links={[
          { href: "/notes", label: "Notes" },
          { href: "/blog", label: "Blog" },
        ]}
      />
    </div>
  );
};

export default Home;
