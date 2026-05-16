import { useKanban } from '@hooks/useTasks';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Card } from '@components/ui';
import type { Task } from '@app-types/index';

export const CalendarPage = () => {
  const { data: board } = useKanban();
  const now = new Date();
  const days = eachDayOfInterval({ start: startOfMonth(now), end: endOfMonth(now) });
  const allTasks: Task[] = board ? Object.values(board).flat() : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-content">Calendar</h1>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-content-muted">{d}</div>
        ))}
        {days.map((day) => {
          const dayTasks = allTasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), day));
          return (
            <Card key={day.toISOString()} className="min-h-[80px] p-2">
              <p className="text-xs font-medium text-content-muted">{format(day, 'd')}</p>
              {dayTasks.map((t) => (
                <p key={t.id} className="mt-1 truncate rounded bg-brand-100 px-1 text-xs text-brand-800 dark:bg-brand-900/40 dark:text-brand-200">{t.title}</p>
              ))}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
