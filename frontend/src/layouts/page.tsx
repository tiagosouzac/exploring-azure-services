import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb";
import { Separator } from "@/components/separator";
import { SidebarTrigger } from "@/components/sidebar";
import { Link } from "react-router";

interface Props {
  title?: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; to?: string }>;
  children?: React.ReactNode;
}

export default function Page({
  title,
  description,
  breadcrumbs,
  children,
}: Props) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs?.map((item, index) => (
                <>
                  <BreadcrumbItem key={index}>
                    {item.to ? (
                      <BreadcrumbLink asChild>
                        <Link to={item.to}>{item.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>

                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="p-4 flex flex-col flex-1">
        {title && (
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-1 flex-col gap-4">{children}</div>
      </main>
    </>
  );
}
