import { formatMoney } from "@/shared/lib/format";
import { useEmployeeActions } from "../store";
import { Stats } from "../types";

interface Props {
  stats: Stats;
}

export const StatsPanel = ({ stats }: Props) => {
  const { setDepartment } = useEmployeeActions();

  return (
    <>
      <div className="stats">
        <div className="stat">
          <div className="stat-label">Фонд зарплат</div>
          <div className="stat-value">{formatMoney(stats.total)}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Середня зарплата</div>
          <div className="stat-value">{formatMoney(stats.avg)}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Працюють зараз</div>
          <div className="stat-value">{stats.active}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Найкращий рейтинг</div>
          <div className="stat-value">
            {stats.best
              ? stats.best.name + " (" + stats.best.rating + ")"
              : "—"}
          </div>
        </div>
      </div>

      <div className="departments">
        {Object.entries(stats.byDepartment).map(([dep, s]) => (
          <div
            key={dep}
            className="dep-chip"
            onClick={() => setDepartment(dep)}
          >
            <b>{dep}</b> {s.count} осіб, сер. {formatMoney(s.avgSalary)},
            рейтинг {s.avgRating.toFixed(2)}
          </div>
        ))}
      </div>
    </>
  );
};
