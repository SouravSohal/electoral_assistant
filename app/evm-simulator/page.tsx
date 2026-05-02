import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { EVMMachine } from "@/components/evm/EVMMachine";
import { DynamicIcon } from "@/components/shared/DynamicIcon";

export const metadata = {
  title: "Interactive EVM Simulator | CivicGuide India",
  description: "Practice your vote on a realistic mockup of the Electronic Voting Machine (EVM) and VVPAT system.",
};

export default function EVMSimulatorPage() {
  return (
    <main className="min-h-screen bg-civic-navy text-civic-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6">
        <div className="container-max">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-blue/10 border border-civic-blue/20 mb-4">
              <DynamicIcon name="Tablet" className="w-4 h-4 text-civic-blue-light" />
              <span className="text-xs font-bold text-civic-blue-light uppercase tracking-widest">Educational Tool</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Interactive <span className="gradient-text">EVM & VVPAT</span> Simulator
            </h1>
            
            <p className="text-lg text-civic-gray-300 leading-relaxed">
              Don't let election day be your first time. Practice casting your vote in our safe, educational simulator. 
              Understand how the machine works, verify the VVPAT slip, and listen for the confirmation beep.
            </p>
          </div>

          {/* Simulator Component */}
          <EVMMachine />

          {/* Education Content */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 border-t-4 border-civic-saffron">
              <div className="w-10 h-10 rounded-full bg-civic-saffron/20 flex items-center justify-center mb-4">
                <DynamicIcon name="HandPointer" className="text-civic-saffron" />
              </div>
              <h3 className="text-lg font-bold mb-2">1. Press the Blue Button</h3>
              <p className="text-sm text-civic-gray-300 leading-relaxed">
                On the Balloting Unit (BU), press the blue button next to the candidate of your choice. A small red light will glow next to it.
              </p>
            </div>

            <div className="glass-card p-6 border-t-4 border-civic-blue">
              <div className="w-10 h-10 rounded-full bg-civic-blue/20 flex items-center justify-center mb-4">
                <DynamicIcon name="Eye" className="text-civic-blue" />
              </div>
              <h3 className="text-lg font-bold mb-2">2. Verify the VVPAT</h3>
              <p className="text-sm text-civic-gray-300 leading-relaxed">
                Look at the glass window of the VVPAT machine. A slip will print showing your choice. It stays visible for 7 seconds.
              </p>
            </div>

            <div className="glass-card p-6 border-t-4 border-green-500">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <DynamicIcon name="Volume2" className="text-green-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">3. Listen for the Beep</h3>
              <p className="text-sm text-civic-gray-300 leading-relaxed">
                After the slip falls, a long beep will sound from the Control Unit. This confirms your vote has been officially registered.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-sm text-civic-gray-500">
              Disclaimer: This is a purely educational simulation. It is NOT a real voting system and is not affiliated with the Election Commission of India.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
