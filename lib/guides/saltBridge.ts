// "Bridge or mush?" checker for /water-softener-salt-bridge/.

export interface BridgeInput {
  q1: boolean; // salt level unchanged for 2 weeks or more
  q2: boolean; // water hard even though the tank looks full
  q3: boolean; // broom handle hits a hard layer with empty or loose salt below
  q4: boolean; // thick sludge layer at the bottom
}

export type BridgeKey = 'mush' | 'bridge' | 'probablyBridge' | 'notSalt' | 'none';

export interface BridgeResult {
  key: BridgeKey;
  message: string; // may contain an inline markdown link
}

export function saltBridge({ q1, q2, q3, q4 }: BridgeInput): BridgeResult {
  if (q4) return { key: 'mush', message: 'Salt mush. [How to clear it](#how-to-clear-salt-mush).' };
  if (q3) return { key: 'bridge', message: 'Salt bridge. [How to break it](#how-to-break-a-salt-bridge).' };
  if (q1 && q2)
    return { key: 'probablyBridge', message: 'Probably a salt bridge. Do the [broom handle check](#the-broom-handle-check).' };
  if (q2)
    return { key: 'notSalt', message: 'Probably not a salt problem. See [why softeners stop working](/water-softener-not-working/).' };
  return { key: 'none', message: 'No sign of a bridge. Check again in a month.' };
}
