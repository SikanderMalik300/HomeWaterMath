'use client';

import { useCallback, useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';

// GA4 events for a tool page (A8):
//  - tool_used: fired once, on the first user input change per page view.
//  - tool_result_shown: fired 1500 ms after the last change, once per distinct
//    result, and only after the user has interacted (so the default render does
//    not emit an event).
export function useToolEvents(slug: string) {
  const interacted = useRef(false);
  const lastResultKey = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onInteract = useCallback(() => {
    if (interacted.current) return;
    interacted.current = true;
    track('tool_used', { tool: slug });
  }, [slug]);

  const onResult = useCallback(
    (key: string) => {
      if (!interacted.current) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        if (lastResultKey.current !== key) {
          lastResultKey.current = key;
          track('tool_result_shown', { tool: slug });
        }
      }, 1500);
    },
    [slug],
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return { onInteract, onResult };
}
