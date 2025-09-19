/**
 * WebSocket Client for Real-time Updates
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

interface WebSocketEventHandlers {
  onTransactionUpdate?: (transaction: any) => void;
  onBalanceUpdate?: (balance: any) => void;
  onFraudAlert?: (alert: any) => void;
  onCardUpdate?: (card: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private token: string | null = null;
  private handlers: WebSocketEventHandlers = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(url: string = 'ws://localhost:8000/ws/') {
    this.url = url;
    this.token = localStorage.getItem('access_token');
  }

  connect(handlers: WebSocketEventHandlers = {}) {
    this.handlers = handlers;

    if (!this.token) {
      console.error('No authentication token available');
      return;
    }

    try {
      // Include token in WebSocket URL for authentication
      const wsUrl = `${this.url}?token=${this.token}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.handlers.onConnect?.();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.handlers.onDisconnect?.();
        
        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.handlers.onError?.(new Error('WebSocket connection error'));
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.handlers.onError?.(error as Error);
    }
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case 'transaction_update':
        this.handlers.onTransactionUpdate?.(message.data);
        break;
      case 'balance_update':
        this.handlers.onBalanceUpdate?.(message.data);
        break;
      case 'fraud_alert':
        this.handlers.onFraudAlert?.(message.data);
        break;
      case 'card_update':
        this.handlers.onCardUpdate?.(message.data);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect(this.handlers);
    }, delay);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
  }

  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  // Convenience methods for sending specific message types
  subscribeToAccount(accountId: string) {
    this.send({
      type: 'subscribe_account',
      account_id: accountId
    });
  }

  subscribeToTransactions() {
    this.send({
      type: 'subscribe_transactions'
    });
  }

  subscribeToFraudAlerts() {
    this.send({
      type: 'subscribe_fraud_alerts'
    });
  }
}

export const wsClient = new WebSocketClient();
export type { WebSocketEventHandlers, WebSocketMessage };