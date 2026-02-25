interface ContextHeaderProps {
  headline: string;
  subtext: string;
}

export function ContextHeader({ headline, subtext }: ContextHeaderProps) {
  return (
    <section className="kn-context-header">
      <h1>{headline}</h1>
      <p className="kn-context-header__sub">{subtext}</p>
    </section>
  );
}
