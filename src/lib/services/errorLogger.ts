import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';

interface ErrorContext {
  userId?: string;
  userAgent?: string;
  url?: string;
  timestamp?: string;
  additionalData?: Record<string, any>;
}

class ErrorLogger {
  private isInitialized = false;

  init(dsn?: string) {
    if (this.isInitialized) return;

    // Initialize Sentry for production error logging
    if (dsn && import.meta.env.PROD) {
      Sentry.init({
        dsn,
        integrations: [
          new BrowserTracing(),
        ],
        tracesSampleRate: 0.1,
        environment: import.meta.env.MODE,
        beforeSend(event) {
          // Filter out sensitive information
          if (event.request?.headers) {
            delete event.request.headers['Authorization'];
            delete event.request.headers['Cookie'];
          }
          return event;
        }
      });
    }

    // Set up global error handlers
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));

    this.isInitialized = true;
  }

  private handleGlobalError(event: ErrorEvent) {
    const context: ErrorContext = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      additionalData: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    };

    this.logError(event.error || new Error(event.message), context);
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    const context: ErrorContext = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      additionalData: {
        type: 'unhandledRejection',
        reason: event.reason
      }
    };

    this.logError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)), 
      context
    );
  }

  logError(error: Error, context?: ErrorContext) {
    // Console logging for development
    console.error('Error logged:', error, context);

    // Send to Sentry in production
    if (import.meta.env.PROD) {
      Sentry.withScope((scope) => {
        if (context?.userId) {
          scope.setUser({ id: context.userId });
        }
        if (context?.additionalData) {
          scope.setContext('additional', context.additionalData);
        }
        scope.setTag('component', 'frontend');
        Sentry.captureException(error);
      });
    }

    // Send to custom logging endpoint
    this.sendToCustomLogger(error, context);
  }

  private async sendToCustomLogger(error: Error, context?: ErrorContext) {
    try {
      await fetch('/api/logs/error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          name: error.name,
          context,
          timestamp: new Date().toISOString()
        })
      });
    } catch (logError) {
      console.error('Failed to send error to custom logger:', logError);
    }
  }

  logApiError(response: Response, requestData?: any) {
    const context: ErrorContext = {
      url: response.url,
      timestamp: new Date().toISOString(),
      additionalData: {
        status: response.status,
        statusText: response.statusText,
        requestData
      }
    };

    const error = new Error(`API Error: ${response.status} ${response.statusText}`);
    this.logError(error, context);
  }

  logNetworkError(error: Error, url?: string) {
    const context: ErrorContext = {
      url: url || window.location.href,
      timestamp: new Date().toISOString(),
      additionalData: {
        type: 'network',
        online: navigator.onLine
      }
    };

    this.logError(error, context);
  }
}

export const errorLogger = new ErrorLogger();