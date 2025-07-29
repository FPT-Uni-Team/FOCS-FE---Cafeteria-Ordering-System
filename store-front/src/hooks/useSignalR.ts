import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

interface SignalRConfig {
  hubUrl: string;
  onConnected?: (connection: signalR.HubConnection) => void;
  onDisconnected?: () => void;
  onReceiveUpdate?: (update: unknown) => void;
}

export const useSignalR = ({
  hubUrl,
  onConnected,
  onDisconnected,
  onReceiveUpdate,
}: SignalRConfig) => {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    const startConnection = async () => {
      if (connection.state === signalR.HubConnectionState.Disconnected) {
        try {
          await connection.start();
          setIsConnected(true);
          setError(null);
          onConnected?.(connection);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          setError(err.message);
          setIsConnected(false);
        }
      }
    };

    connection.on("ReceiveCartUpdate", (update: unknown) => {
      onReceiveUpdate?.(update);
    });

    connection.onclose(() => {
      setIsConnected(false);
      onDisconnected?.();
    });

    connection.onreconnecting(() => {});
    connection.onreconnected(() => {});

    startConnection();

    return () => {
      if (connection.state !== signalR.HubConnectionState.Disconnected) {
        connection.stop().catch(() => {});
      }
    };
  }, [hubUrl]);

  return {
    connection: connectionRef.current,
    isConnected,
    error,
  };
};
