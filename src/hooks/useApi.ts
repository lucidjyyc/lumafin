/**
 * React Hooks for API Integration
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient, ApiResponse } from '../lib/api/client';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Specific hooks for common API calls
export function useAccounts() {
  return useApi(() => apiClient.getAccounts());
}

export function useTransactions(filters?: any) {
  return useApi(() => apiClient.getTransactions(filters), [filters]);
}

export function useCards() {
  return useApi(() => apiClient.getCards());
}

export function useWalletBalances(walletAddress?: string) {
  return useApi(() => apiClient.getWalletBalances(walletAddress), [walletAddress]);
}

export function useTransactionAnalytics(days: number = 30) {
  return useApi(() => apiClient.getTransactionAnalytics(days), [days]);
}

// Mutation hooks
export function useCreateVirtualCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCard = async (cardData: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.createVirtualCard(cardData);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create card';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createCard, loading, error };
}

export function useCreateTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = async (transactionData: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.createTransaction(transactionData);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create transaction';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createTransaction, loading, error };
}

export function useCreateAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAccount = async (accountData: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.createAccount(accountData);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createAccount, loading, error };
}