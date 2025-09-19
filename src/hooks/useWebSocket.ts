/**
 * WebSocket React Hook for Real-time Updates
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */

import { useEffect, useRef, useState } from 'react';
import { wsClient, WebSocketEventHandlers } from '../lib/websocket/client';

export function useWebSocket(handlers: WebSocketEventHandlers) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const handlersRef = useRef(handlers);

  // Update handlers ref when handlers change
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const wsHandlers: WebSocketEventHandlers = {
      onConnect: () => {
        setIsConnected(true);
        setConnectionError(null);
        handlersRef.current.onConnect?.();
      },
      onDisconnect: () => {
        setIsConnected(false);
        handlersRef.current.onDisconnect?.();
      },
      onError: (error) => {
        setConnectionError(error.message);
        handlersRef.current.onError?.(error);
      },
      onTransactionUpdate: handlersRef.current.onTransactionUpdate,
      onBalanceUpdate: handlersRef.current.onBalanceUpdate,
      onFraudAlert: handlersRef.current.onFraudAlert,
      onCardUpdate: handlersRef.current.onCardUpdate,
    };

    wsClient.connect(wsHandlers);

    return () => {
      wsClient.disconnect();
    };
  }, []);

  return {
    isConnected,
    connectionError,
    subscribe: {
      toAccount: (accountId: string) => wsClient.subscribeToAccount(accountId),
      toTransactions: () => wsClient.subscribeToTransactions(),
      toFraudAlerts: () => wsClient.subscribeToFraudAlerts(),
    },
    send: (message: any) => wsClient.send(message),
  };
}

// Specific hooks for different real-time features
export function useRealTimeTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [newTransaction, setNewTransaction] = useState<any | null>(null);

  const { isConnected } = useWebSocket({
    onConnect: () => {
      wsClient.subscribeToTransactions();
    },
    onTransactionUpdate: (transaction) => {
      setTransactions(prev => [transaction, ...prev.slice(0, 49)]); // Keep last 50
      setNewTransaction(transaction);
      
      // Clear new transaction notification after 5 seconds
      setTimeout(() => setNewTransaction(null), 5000);
    },
  });

  return {
    transactions,
    newTransaction,
    isConnected,
  };
}

export function useRealTimeBalances(accountIds: string[]) {
  const [balances, setBalances] = useState<Record<string, any>>({});

  const { isConnected } = useWebSocket({
    onConnect: () => {
      accountIds.forEach(accountId => {
        wsClient.subscribeToAccount(accountId);
      });
    },
    onBalanceUpdate: (balanceUpdate) => {
      setBalances(prev => ({
        ...prev,
        [balanceUpdate.account_id]: balanceUpdate
      }));
    },
  });

  return {
    balances,
    isConnected,
  };
}

export function useRealTimeFraudAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { isConnected } = useWebSocket({
    onConnect: () => {
      wsClient.subscribeToFraudAlerts();
    },
    onFraudAlert: (alert) => {
      setAlerts(prev => [alert, ...prev]);
      setUnreadCount(prev => prev + 1);
    },
  });

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return {
    alerts,
    unreadCount,
    isConnected,
    markAsRead,
  };
}