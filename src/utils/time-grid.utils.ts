/** Minimal interval description used to lay out overlapping blocks. */
export interface GridInterval {
  id: string;
  startMin: number;
  durationMin: number;
}

/** Horizontal slot of an interval: `lane` of `lanes` columns shared with overlapping neighbours. */
export interface GridLane {
  lane: number;
  lanes: number;
}

/**
 * Assigns overlapping intervals to side-by-side lanes so concurrent blocks never cover each other.
 * Returns a lookup by interval id.
 */
export function assignLanes(intervals: readonly GridInterval[]): Map<string, GridLane> {
  const sorted = [...intervals].sort(
    (a, b) => a.startMin - b.startMin || b.durationMin - a.durationMin,
  );
  const result = new Map<string, GridLane>();
  let cluster: { id: string; lane: number }[] = [];
  let laneEnds: number[] = [];

  const flush = () => {
    for (const entry of cluster) result.set(entry.id, { lane: entry.lane, lanes: laneEnds.length });
    cluster = [];
    laneEnds = [];
  };

  for (const interval of sorted) {
    const end = interval.startMin + interval.durationMin;
    if (laneEnds.length > 0 && interval.startMin >= Math.max(...laneEnds)) flush();
    let lane = laneEnds.findIndex((laneEnd) => laneEnd <= interval.startMin);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(end);
    } else {
      laneEnds[lane] = end;
    }
    cluster.push({ id: interval.id, lane });
  }
  flush();
  return result;
}
