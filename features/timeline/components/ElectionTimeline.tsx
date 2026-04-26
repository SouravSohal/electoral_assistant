import { ELECTION_TIMELINE_STAGES } from "@/lib/constants";
import { TimelineStep } from "./TimelineStep";

export function ElectionTimeline() {
  return (
    <div className="max-w-4xl mx-auto mt-16 pb-20">
      <div className="relative border-l-2 border-[hsla(210,20%,98%,0.08)] ml-4 md:ml-6">
        {ELECTION_TIMELINE_STAGES.map((stage) => (
          <TimelineStep key={stage.id} stage={stage} />
        ))}
      </div>
    </div>
  );
}
