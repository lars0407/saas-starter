import { CoverLetterGenerator } from '@/components/coverletter-generator';

export default function CoverLetterGeneratePage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <h1 className="text-lg font-semibold">KI-Anschreiben Generator</h1>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <CoverLetterGenerator />
      </div>
    </>
  );
} 