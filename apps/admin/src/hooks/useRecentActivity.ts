import { useState, useEffect } from 'react';
import { attendanceApi } from '@time-sync/api';

export const useRecentActivity = () => {
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const res = await attendanceApi.getHistory();

      const formatted = res.data.map((entry: any) => ({
        id: entry.id,
        type: entry.clockOut ? 'Clock Out' : 'Clock In',
        clockIn: new Date(entry.clockIn),
        clockOut: entry.clockOut ? new Date(entry.clockOut) : null,
        duration: entry.durationSeconds || null,
      }));

      setActivity(formatted);
    } catch (err) {
      console.error('Failed to fetch recent activity', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  return { activity, loading, refetch: fetchActivity };
};
