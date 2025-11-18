import { CoverLetterGenerator } from '@/components/coverletter-generator';
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface CoverLetterGeneratePageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function CoverLetterGeneratePage({ searchParams }: CoverLetterGeneratePageProps) {
  const params = await searchParams;
  const documentId = params.id ? parseInt(params.id) : undefined;

  return (
    <div className="h-screen flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {documentId ? 'Anschreiben bearbeiten' : 'Anschreiben Generator'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4 pt-0 min-h-0">
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                <span>{documentId ? 'Anschreiben bearbeiten' : 'Anschreiben Generator'}</span>
                <span>✨</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                {documentId 
                  ? 'Bearbeite dein bestehendes Anschreiben' 
                  : 'Erstelle dein perfektes Anschreiben mit KI'
                }
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <CoverLetterGenerator documentId={documentId} />
        </div>
      </div>
    </div>
  );
} 