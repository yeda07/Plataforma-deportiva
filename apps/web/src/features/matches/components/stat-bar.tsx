export type StatBarProps = Readonly<{
  awayLabel: string;
  awayValue: number;
  homeLabel: string;
  homeValue: number;
  label: string;
  suffix?: string;
}>;

export function StatBar({
  awayLabel,
  awayValue,
  homeLabel,
  homeValue,
  label,
  suffix = ""
}: StatBarProps) {
  const total = homeValue + awayValue;
  const homePercent = total > 0 ? Math.round((homeValue / total) * 100) : 50;
  const awayPercent = 100 - homePercent;

  return (
    <div className="grid gap-2" aria-label={label}>
      <div className="grid grid-cols-[4rem_1fr_4rem] items-center gap-3 text-caption">
        <span className="truncate font-semibold text-foreground">
          {homeValue.toString()}
          {suffix}
        </span>
        <span className="text-center font-semibold text-muted-foreground">{label}</span>
        <span className="truncate text-right font-semibold text-foreground">
          {awayValue.toString()}
          {suffix}
        </span>
      </div>
      <div
        className="grid h-2 overflow-hidden rounded-full bg-muted"
        style={{ gridTemplateColumns: `${homePercent.toString()}fr ${awayPercent.toString()}fr` }}
      >
        <span
          aria-label={`${homeLabel}: ${homeValue.toString()}${suffix}`}
          className={homePercent === 0 ? "bg-primary opacity-0" : "bg-primary"}
        />
        <span
          aria-label={`${awayLabel}: ${awayValue.toString()}${suffix}`}
          className={awayPercent === 0 ? "bg-live opacity-0" : "bg-live"}
        />
      </div>
    </div>
  );
}
