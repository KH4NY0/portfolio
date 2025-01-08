"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { navItems } from "@/data";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ProjectSkeleton, ApproachSkeleton } from "@/components/ui/Skeletons";

// Priority loading for above-the-fold content
const Grid = dynamic(() => import("@/components/Grid"), {
  ssr: false,
  loading: () => <LoadingSpinner />
});

// Defer loading of below-the-fold content
const RecentProjects = dynamic(() => import("@/components/RecentProjects"), {
  ssr: false,
  loading: () => <ProjectSkeleton />
});

const Approach = dynamic(() => import("@/components/Approach"), {
  ssr: false,
  loading: () => <ApproachSkeleton />
});

const Home = () => {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        
        {/* Priority content loads immediately */}
        <Hero />
        
        {/* Load grid with minimal delay */}
        <Suspense fallback={<LoadingSpinner />}>
          <Grid />
        </Suspense>
        
        {/* Defer loading of below-the-fold content */}
        <Suspense fallback={<ProjectSkeleton />}>
          <RecentProjects />
        </Suspense>
        
        <Suspense fallback={<ApproachSkeleton />}>
          <Approach />
        </Suspense>
        
        <Footer />
      </div>
    </main>
  );
};

export default Home;
