type PagePlaceholderProps = Readonly<{
  title: string;
  description: string;
}>;

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <section aria-labelledby="page-title" className="py-8">
      <p className="text-caption font-semibold text-primary">Preparado</p>
      <h1 id="page-title" className="mt-2 text-h1 text-foreground">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-body text-muted-foreground">{description}</p>
    </section>
  );
}
