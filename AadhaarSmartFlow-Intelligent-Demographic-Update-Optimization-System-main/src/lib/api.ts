const API_BASE_URL = '/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface LoginRequest {
  identifier: string; // aadhaar, email, officerId, or mobile
  password: string;
  loginType: 'user' | 'officer';
  loginMethod?: 'email' | 'officerId' | 'mobile';
}

interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    name: string;
    email?: string;
    role: 'user' | 'officer';
    aadhaarNumber?: string;
    officerId?: string;
  };
}

interface UpdateRequestData {
  updateType: string;
  newAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  newName?: string;
  maritalStatus?: string;
  newDob?: string;
  reason?: string;
}

interface UpdateResponse {
  requestId: string;
  status: string;
  estimatedCompletion: string;
  isAutoApproved: boolean;
}

interface UploadResponse {
  url: string;
  fileName: string;
  fileId: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    method: string = 'GET',
    data?: any
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth token if exists
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}`);
      }

      return {
        success: true,
        data: result.data || result,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
        message: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  // Auth APIs
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', 'POST', credentials);
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', 'POST');
  }

  async validateToken(): Promise<ApiResponse> {
    return this.request('/auth/validate', 'GET');
  }

  async submitUpdateRequest(
    data: UpdateRequestData,
    documents: File[]
  ): Promise<ApiResponse<UpdateResponse>> {
    const uploadPromises = documents.map(file => this.uploadDocument(file));
    const uploadResults = await Promise.all(uploadPromises);

    const documentIds = uploadResults
      .filter(result => result.success)
      .map(result => result.data?.fileId);

    const requestData = {
      ...data,
      documentIds,
    };

    return this.request<UpdateResponse>('/updates/submit', 'POST', requestData);
  }

  async uploadDocument(file: File): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file); // Backend expects 'file'

    const url = `${API_BASE_URL}/documents/upload`;
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }

      return {
        success: true,
        data: result.data || result,
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
        message: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  async getUpdateTypes(): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    description: string;
    requiredDocuments: string[];
  }>>> {
    return this.request('/updates/types');
  }

  // Helper to store auth data
  static storeAuthData(data: LoginResponse): void {
    localStorage.setItem('token', data.token); // Store both for compatibility
    localStorage.setItem('authToken', data.token);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  static clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  static getAuthData(): {
    token: string | null;
    user: any | null;
  } {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    return {
      token,
      user: userStr ? JSON.parse(userStr) : null,
    };
  }
}

export const api = new ApiService();
export default ApiService;