import type { ReactNode } from "react";

type PageContainerProps = Readonly<{
  children: ReactNode;
}>;

export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="mx-auto min-h-[calc(100dvh-136px)] w-full max-w-7xl px-3 pb-24 pt-4 sm:px-4 md:px-6 lg:px-8 lg:pb-8">
      {children}
    </main>
  );
}
