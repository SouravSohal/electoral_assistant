"use client";

import { useState, useEffect } from "react";
import { ELECTION_TIMELINE_STAGES } from "@/lib/constants";
import { TimelineStep } from "./TimelineStep";
import { useAuth } from "@/features/profile/hooks/useAuth";
import { getElectionReminders } from "@/lib/firebase";

export function ElectionTimeline() {
  const { user } = useAuth();
  const [reminderIds, setReminderIds] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      getElectionReminders(user.uid).then(setReminderIds);
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto mt-16 pb-20">
      <div className="relative border-l-2 border-[hsla(210,20%,98%,0.08)] ml-4 md:ml-6">
        {ELECTION_TIMELINE_STAGES.map((stage) => (
          <TimelineStep 
            key={stage.id} 
            stage={stage} 
            isReminderSet={reminderIds.includes(stage.id)}
          />
        ))}
      </div>
    </div>
  );
}
