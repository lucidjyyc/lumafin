/**
 * API Client for FinTech Banking Platform
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    has_more: boolean;
    next_cursor: string | null;
    prev_cursor: string | null;
    total_count: number;
  };
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = 'http://localhost:8000/api/v1') {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('access_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(credentials: { email: string; password: string }) {
    const response = await this.request<{
      user: any;
      token: string;
      refresh_token: string;
      expires_in: number;
    }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success) {
      this.token = response.data.token;
      localStorage.setItem('access_token', response.data.token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }

    return response;
  }

  async logout() {
    await this.request('/auth/logout/', { method: 'POST' });
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Accounts
  async getAccounts(filters?: {
    account_type?: string;
    currency?: string;
    is_active?: boolean;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    return this.request<any[]>(`/accounts/?${params}`);
  }

  async createAccount(accountData: {
    account_type: string;
    currency: string;
    initial_deposit?: string;
  }) {
    return this.request<any>('/accounts/', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }

  async getAccountDetails(accountId: string) {
    return this.request<any>(`/accounts/${accountId}/`);
  }

  // Transactions
  async getTransactions(filters?: {
    account_id?: string;
    transaction_type?: string;
    status?: string;
    limit?: number;
    cursor?: string;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    return this.request<any[]>(`/transactions/?${params}`);
  }

  async createTransaction(transactionData: {
    from_account: string;
    to_account?: string;
    transaction_type: string;
    amount: string;
    currency: string;
    description?: string;
  }) {
    return this.request<any>('/transactions/', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async getTransactionCategories() {
    return this.request<any[]>('/transactions/categories/');
  }

  async getTransactionAnalytics(days: number = 30) {
    return this.request<any>(`/transactions/analytics/?days=${days}`);
  }

  // Cards
  async getCards() {
    return this.request<any[]>('/cards/');
  }

  async createVirtualCard(cardData: {
    card_type: string;
    nickname: string;
    spending_limit?: number;
    merchant_name?: string;
    expires_at?: string;
  }) {
    return this.request<any>('/cards/create_virtual/', {
      method: 'POST',
      body: JSON.stringify(cardData),
    });
  }

  async toggleCardStatus(cardId: string, status: string) {
    return this.request<any>(`/cards/${cardId}/toggle_status/`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  async getCardTransactions(cardId: string, limit: number = 20, offset: number = 0) {
    return this.request<any[]>(`/cards/${cardId}/transactions/?limit=${limit}&offset=${offset}`);
  }

  // Web3
  async getSupportedNetworks() {
    return this.request<any[]>('/web3/networks/');
  }

  async getWalletBalances(walletAddress?: string) {
    const params = walletAddress ? `?wallet_address=${walletAddress}` : '';
    return this.request<any[]>(`/web3/balances/${params}`);
  }

  async refreshWalletBalances(walletAddress?: string) {
    return this.request<any>('/web3/refresh_balances/', {
      method: 'POST',
      body: JSON.stringify({ wallet_address: walletAddress }),
    });
  }

  async sendBlockchainTransaction(transactionData: {
    to_address: string;
    amount: string;
    network_id: number;
    gas_limit?: number;
    gas_price?: string;
  }) {
    return this.request<any>('/web3/send_transaction/', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async getGasPrices() {
    return this.request<any>('/web3/gas-prices/');
  }

  // DeFi
  async getDeFiProtocols() {
    return this.request<any[]>('/defi/protocols/');
  }

  async getDeFiPositions() {
    return this.request<any[]>('/defi/');
  }

  async stakeTokens(stakeData: {
    protocol_name: string;
    token_address: string;
    amount: string;
    apy?: string;
  }) {
    return this.request<any>('/defi/stake/', {
      method: 'POST',
      body: JSON.stringify(stakeData),
    });
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse, PaginatedResponse };