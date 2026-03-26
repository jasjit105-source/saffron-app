import { db } from "@/lib/db";
import { ListTodo, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { PageHeader, ActionButton, StatusBadge, PriorityDot, CardSection } from "@/components/shared";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const tasks = await db.task.findMany({
    include: {
      wedding: { select: { id: true, title: true } },
      assignedTo: { select: { id: true, name: true } },
    },
    orderBy: [{ dueDate: "asc" }],
  });

  const open = tasks.filter((t: any) => ["TODO", "IN_PROGRESS", "BLOCKED"].includes(t.status));
  const done = tasks.filter((t: any) => t.status === "DONE");

  return (
    <div className="space-y-5">
      <PageHeader title="Tasks & Approvals" subtitle={`${open.length} open tasks • ${done.length} completed`} actions={<ActionButton icon={Plus}>Add Task</ActionButton>} />
      <CardSection title="Open Tasks" subtitle={`${open.length} tasks`}>
        <div className="divide-y divide-gray-50">
          {open.map((t: any) => (
            <div key={t.id} className="px-5 py-3.5 hover:bg-gray-50/50 transition cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <PriorityDot priority={t.priority} />
                <span className="text-xs font-semibold text-gray-800 truncate flex-1">{t.title}</span>
                <StatusBadge status={t.priority} />
                <StatusBadge status={t.status} />
              </div>
              <div className="flex items-center gap-2 pl-3.5 flex-wrap">
                <span className="text-[10px] text-gray-400">{t.wedding?.title || "—"}</span>
                <span className="text-gray-200">•</span>
                <span className="text-[10px] text-gray-400">{t.assignedTo?.name || "Unassigned"}</span>
                <span className="text-gray-200">•</span>
                <span className="text-[10px] text-gray-400">{t.category}</span>
                {t.dueDate && <><span className="text-gray-200">•</span><span className="text-[10px] text-gray-500 font-medium">{formatDate(t.dueDate)}</span></>}
              </div>
            </div>
          ))}
          {open.length === 0 && <div className="px-5 py-8 text-center text-sm text-gray-300">No open tasks</div>}
        </div>
      </CardSection>
      {done.length > 0 && (
        <CardSection title="Completed" subtitle={`${done.length} tasks`}>
          <div className="divide-y divide-gray-50">
            {done.map((t: any) => (
              <div key={t.id} className="px-5 py-3 flex items-center justify-between opacity-60">
                <span className="text-xs text-gray-500 line-through">{t.title}</span>
                <StatusBadge status="DONE" />
              </div>
            ))}
          </div>
        </CardSection>
      )}
    </div>
  );
}
