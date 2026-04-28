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
    <div className="fixed inset-0 flex flex-col overflow-hidden selection:bg-[var(--color-brand-saffron)] selection:text-[var(--color-brand-navy)] bg-[var(--color-brand-navy)]">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-[var(--color-brand-blue)] opacity-[0.03] blur-[120px] pointer-events-none" />
      
      {/* Navbar - keep it fixed at top but ensure it doesn't overlap */}
      <div className="shrink-0 z-50">
        <Navbar />
      </div>
      
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-6 pt-[120px] pb-6 md:pt-[130px] md:pb-8 z-10 overflow-hidden min-h-0">
        <div className="w-full h-full max-w-5xl mx-auto flex flex-col min-h-0 overflow-hidden">
          <ChatWindow initialQuestion={initialQuestion} />
        </div>
      </main>
    </div>
  );
}
