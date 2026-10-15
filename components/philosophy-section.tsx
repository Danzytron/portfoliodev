import { philosophy } from "@/data/profile";

export function PhilosophySection() {
  const words = philosophy.heading.split(" ");
  const last = words.length - 1;
  return (
    <section
      aria-labelledby="philosophy-title"
      className="section-pad border-t border-line"
    >
      <div className="container-x">
        <h2
          id="philosophy-title"
          className="mx-auto max-w-5xl text-center text-[clamp(1.75rem,6vw,4.5rem)] leading-[1.08] font-semibold tracking-[-0.04em] text-balance"
        >
          {words.map((word, i) => (
            <span
              key={i}
              data-reveal
              style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
              className={`inline-block ${i === last ? "text-accent" : ""} ${i < last ? "mr-[0.25em]" : ""}`}
            >
              {word}
            </span>
          ))}
        </h2>
        <p
          data-reveal
          style={{ "--d": `${words.length * 70 + 100}ms` } as React.CSSProperties}
          className="mx-auto mt-8 max-w-2xl text-center text-lg leading-relaxed text-muted text-pretty md:text-xl"
        >
          {philosophy.text}
        </p>
      </div>
    </section>
  );
}
