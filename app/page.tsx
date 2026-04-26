import { Navbar } from "@/components/shared/Navbar";

import { Hero } from "@/features/home/components/Hero";
import { Features } from "@/features/home/components/Features";

export default function Home() { 
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <Hero />
        <Features />
      </main>
    </div>
  ); 
}
