'use client';

import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect, useRef, useSyncExternalStore } from 'react';

// NEXT_PUBLIC_ because the browser connects to spark-agent-engine's /ws endpoint directly, not
// through this app's own BFF API routes (see .env.example). Unset = mock mode: every export below
// becomes a no-op and callers fall back to the existing REST poll.
const WS_URL = process.env.NEXT_PUBLIC_BACKEND_WS_URL;

type Handler = (payload: unknown) => void;

interface TopicSubscription {
  topic: string;
  handler: Handler;
  stompSub: StompSubscription | null;
}

let client: Client | null = null;
const topicSubscriptions = new Map<number, TopicSubscription>();
let nextSubId = 1;

let connected = false;
const connectionListeners = new Set<() => void>();

function setConnected(value: boolean) {
  if (connected === value) return;
  connected = value;
  connectionListeners.forEach(listener => listener());
}

function subscribeEntry(entry: TopicSubscription) {
  if (!client || !client.connected || entry.stompSub) return;
  entry.stompSub = client.subscribe(entry.topic, (message: IMessage) => {
    try {
      entry.handler(JSON.parse(message.body));
    } catch {
      // malformed payload — log-and-skip, matching the engine-side consumer convention
      console.error('[ws] failed to parse message on', entry.topic);
    }
  });
}

function ensureClient(): Client | null {
  if (!WS_URL || typeof window === 'undefined') return null;
  if (client) return client;

  client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 3000,
    onConnect: () => {
      setConnected(true);
      // STOMP subscriptions don't survive a reconnect — re-establish every desired topic.
      for (const entry of topicSubscriptions.values()) subscribeEntry(entry);
    },
    onDisconnect: () => {
      setConnected(false);
      for (const entry of topicSubscriptions.values()) entry.stompSub = null;
    },
    onWebSocketClose: () => {
      setConnected(false);
      for (const entry of topicSubscriptions.values()) entry.stompSub = null;
    },
  });
  client.activate();
  return client;
}

export function isWsConfigured(): boolean {
  return Boolean(WS_URL);
}

/** Subscribes to a STOMP destination; returns an unsubscribe function. No-ops in mock mode. */
export function subscribeTopic(topic: string, handler: Handler): () => void {
  const c = ensureClient();
  if (!c) return () => {};

  const id = nextSubId++;
  const entry: TopicSubscription = { topic, handler, stompSub: null };
  topicSubscriptions.set(id, entry);
  subscribeEntry(entry);

  return () => {
    entry.stompSub?.unsubscribe();
    topicSubscriptions.delete(id);
  };
}

function onConnectionChange(listener: () => void): () => void {
  connectionListeners.add(listener);
  return () => connectionListeners.delete(listener);
}

function getConnectionSnapshot(): boolean {
  return connected;
}

function getServerSnapshot(): boolean {
  return false;
}

/** True once the STOMP connection is up. Always false in mock mode (no WS_URL) or during SSR. */
export function useWsConnected(): boolean {
  return useSyncExternalStore(onConnectionChange, getConnectionSnapshot, getServerSnapshot);
}

/**
 * Keeps exactly one subscription per key in `keys` alive for as long as the calling component is
 * mounted, subscribing new keys and unsubscribing removed ones as `keys` changes — e.g. one
 * telemetry subscription per known device, or one diagnosis subscription per alert currently
 * "Diagnosing". `topicFn`/`onMessage` don't need to be memoized by the caller: the effect re-checks
 * membership every render regardless (cheap for the list sizes here), it just won't tear down and
 * recreate subscriptions that are already up to date.
 */
export function useTopicSet(
  keys: string[],
  topicFn: (key: string) => string,
  onMessage: (key: string, payload: unknown) => void
): void {
  const subsRef = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    const currentKeys = new Set(keys);

    for (const key of keys) {
      if (!subsRef.current.has(key)) {
        const unsubscribe = subscribeTopic(topicFn(key), payload => onMessage(key, payload));
        subsRef.current.set(key, unsubscribe);
      }
    }

    for (const [key, unsubscribe] of subsRef.current) {
      if (!currentKeys.has(key)) {
        unsubscribe();
        subsRef.current.delete(key);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys.join(',')]);

  useEffect(() => {
    const subs = subsRef.current;
    return () => {
      for (const unsubscribe of subs.values()) unsubscribe();
      subs.clear();
    };
  }, []);
}
