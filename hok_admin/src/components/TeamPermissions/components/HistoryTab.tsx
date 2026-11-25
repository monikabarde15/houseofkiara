import React, { useMemo, useState } from "react";
import { useTeamPermissions } from "../TeamPermissionsContext";
import { formatFullDateTime } from "../constants";

type HistoryFilter = "all" | "people" | "roles";

export const HistoryTab: React.FC = () => {
  const { history } = useTeamPermissions();
  const [filter, setFilter] = useState<HistoryFilter>("all");

  const peopleCount = useMemo(
    () => history.filter((h) => h.kind === "people").length,
    [history],
  );
  const rolesCount = useMemo(
    () => history.filter((h) => h.kind === "roles").length,
    [history],
  );

  const visibleEntries = useMemo(() => {
    if (filter === "people") return history.filter((h) => h.kind === "people");
    if (filter === "roles") return history.filter((h) => h.kind === "roles");
    return history;
  }, [history, filter]);

  const filters: Array<{ id: HistoryFilter; label: string; count: number }> = [
    { id: "all", label: "Everything", count: history.length },
    { id: "people", label: "People", count: peopleCount },
    { id: "roles", label: "Roles", count: rolesCount },
  ];

  return (
    <div className="pt-5">
      <p className="text-[13px] text-[#5C5248] mb-3.5">
        Every change to the team or a role, newest first. This record cannot be
        edited or deleted.
      </p>

      <div className="flex items-center gap-6 mb-4">
        {filters.map((f) => {
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`relative pb-1.5 text-[13.5px] bg-transparent border-0 cursor-pointer transition-colors ${
                isActive
                  ? "text-[#1A1612] font-semibold"
                  : "text-[#6E6358] font-medium hover:text-[#1A1612]"
              }`}
            >
              {f.label} ({f.count})
              {isActive && (
                <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#C9A96E]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="tp-card">
        {visibleEntries.length === 0 ? (
          <div className="px-5 py-4 text-[13px] text-[#6E6358]">
            Nothing recorded yet.
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="tp-table-head-cell w-[170px]">When</th>
                <th className="tp-table-head-cell w-[130px]">Who</th>
                <th className="tp-table-head-cell">What changed</th>
              </tr>
            </thead>
            <tbody>
              {visibleEntries.map((entry, idx) => (
                <tr
                  key={entry.entryId || idx}
                  className={
                    idx > 0 ? "border-t border-[#EFE7DA]" : undefined
                  }
                >
                  <td className="px-4 py-3 text-[13px] text-[#5C5248] whitespace-nowrap align-top">
                    {formatFullDateTime(entry.occurredAt)}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#1A1612] whitespace-nowrap align-top">
                    {entry.who}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#1A1612] align-top">
                    {entry.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
