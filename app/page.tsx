"use client";

import dynamic from 'next/dynamic';
import { navItems } from "@/data";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { FloatingNav } from "@/components/ui/FloatingNavbar";

// Dynamically import components that might use browser APIs
const Grid = dynamic(() => import("@/components/Grid"), {
  ssr: false
});

const RecentProjects = dynamic(() => import("@/components/RecentProjects"), {
  ssr: false
});

const Approach = dynamic(() => import("@/components/Approach"), {
  ssr: false
});

const Home = () => {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <Hero />
        <Grid />
        <RecentProjects />
        <Approach />
        <Footer />
      </div>
    </main>
  );
};

export default Home;
