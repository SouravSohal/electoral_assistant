import { Navbar } from "@/components/shared/Navbar";
import { ChatWindow } from "@/features/assistant/components/ChatWindow";
import { Footer } from "@/components/shared/Footer";

export const metadata = {
  title: "AI Assistant | CivicGuide India",
  description: "Ask questions about the Indian election process and get verified answers powered by AI.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AssistantPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q;
  const initialQuestion = typeof q === 'string' ? q : undefined;

  return (
    <div className="h-screen flex flex-col overflow-hidden selection:bg-[var(--color-brand-saffron)] selection:text-[var(--color-brand-navy)] bg-[var(--color-brand-navy)]">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-[var(--color-brand-blue)] opacity-[0.03] blur-[120px] pointer-events-none" />
      
      {/* Navbar - keep it fixed at top but ensure it doesn't overlap */}
      <div className="shrink-0 z-50">
        <Navbar />
      </div>
      
      {/* Main Chat Area - takes exactly remaining height */}
      <main className="flex-1 relative flex flex-col items-center justify-end w-full overflow-hidden">
        <div className="w-full h-full max-w-4xl mx-auto flex flex-col px-4 sm:px-6 md:px-8 pb-4 pt-6">
          
          {/* Header area (only visible if chat is empty, otherwise handled by ChatWindow) */}
          <div className="text-center mb-6 shrink-0 z-10 hidden">
             {/* Hidden at top level, we will move the greeting inside the ChatWindow for better scroll behavior */}
          </div>
          
          <div className="flex-1 w-full relative z-20 flex flex-col min-h-0">
            <ChatWindow initialQuestion={initialQuestion} />
          </div>
        </div>
      </main>
    </div>
  );
}
