'use client';

import { Alert } from '@/lib/api';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

interface WeatherAlertsProps {
  alerts: Alert[];
}

export default function WeatherAlerts({ alerts }: WeatherAlertsProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  if (alerts.length === 0) return null;

  const visibleAlerts = alerts.filter((a) => !dismissed.has(a.headline));
  if (visibleAlerts.length === 0) return null;

  const getSeverityColor = (severity: string) => {
    const s = severity.toLowerCase();
    if (s === 'extreme') return 'bg-red-600/30 border-red-500';
    if (s === 'severe') return 'bg-orange-600/30 border-orange-500';
    if (s === 'moderate') return 'bg-yellow-600/30 border-yellow-500';
    return 'bg-blue-600/30 border-blue-500';
  };

  return (
    <div className="space-y-3">
      {visibleAlerts.map((alert, index) => (
        <div
          key={`${index}-${alert.headline}`}
          className={`rounded-2xl p-4 border ${getSeverityColor(alert.severity)} backdrop-blur-md`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-white">{alert.event}</h4>
                <button
                  onClick={() => setDismissed((prev) => new Set(prev).add(alert.headline))}
                  className="text-white/50 hover:text-white transition-colors shrink-0"
                  aria-label="Dismiss alert"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-white/80 text-sm mt-1 line-clamp-2">{alert.headline}</p>
              <div className="flex gap-4 mt-2 text-xs text-white/60">
                <span>Severity: {alert.severity}</span>
                <span>Urgency: {alert.urgency}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
