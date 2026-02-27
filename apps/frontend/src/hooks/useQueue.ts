import { useState, useEffect } from 'react';

const rand = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;

const INITIAL_JOBS = [
  { id: 'j1', type: 'metrics.ingest', status: 'processing', progress: 45, platform: 'Meta' },
  { id: 'j2', type: 'ai.optimize', status: 'waiting', progress: 0, platform: 'All' },
  { id: 'j3', type: 'campaign.sync', status: 'completed', progress: 100, platform: 'Google' },
  { id: 'j4', type: 'creative.generate', status: 'processing', progress: 22, platform: 'TikTok' },
  { id: 'j5', type: 'metrics.normalize', status: 'completed', progress: 100, platform: 'Meta' },
];

export function useQueue() {
  const [jobs, setJobs] = useState(INITIAL_JOBS);

  useEffect(() => {
    const interval = setInterval(() => {
      setJobs(prev => prev.map(j => {
        if (j.status === 'processing' && j.progress < 100) {
          const np = Math.min(100, j.progress + rand(2, 8));
          return { ...j, progress: np, status: np === 100 ? 'completed' : 'processing' };
        }
        return j;
      }));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    active: jobs.filter(j => j.status === 'processing').length,
    waiting: jobs.filter(j => j.status === 'waiting').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: 0,
  };

  return { jobs, stats };
}
