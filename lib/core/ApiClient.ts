import { request, APIRequestContext } from '@playwright/test';
import { RetryManager } from './RetryManager';
import { StructuredLogger } from './StructuredLogger';

export class ApiClient {
  private context: APIRequestContext | null = null;

  private normalizeBaseUrl(url?: string): string {
    const raw = (url || process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
      .replace(/['\"`]+/g, '')
      .replace(/\/$/, '');

    const base = raw.startsWith('http://') || raw.startsWith('https://')
      ? raw
      : `http://${raw}`;

    const normalized = base.replace(/:4173/, ':8001');
    return normalized.endsWith('/api') ? normalized : `${normalized}/api`;
  }

  private async getContext(): Promise<APIRequestContext> {
    if (!this.context) {
      this.context = await request.newContext({
        baseURL: this.normalizeBaseUrl(),
        extraHTTPHeaders: {
          'Authorization': `Bearer ${process.env.BEFFA_TOKEN}`,
          'x-company': process.env.BEFFA_COMPANY || '',
          'Content-Type': 'application/json'
        }
      });
    }
    return this.context;
  }

  async safeGet(url: string, signal?: AbortSignal) {
    return RetryManager.retry(async () => {
      const ctx = await this.getContext();
      const start = Date.now();
      const response = await ctx.get(url);
      StructuredLogger.api('GET', url, response.status(), Date.now() - start);

      if (!response.ok()) {
        throw { status: response.status(), message: await response.text() };
      }
      return response.json();
    }, { signal });
  }

  async safePost(url: string, data: any, signal?: AbortSignal) {
    return RetryManager.retry(async () => {
      const ctx = await this.getContext();
      const start = Date.now();
      const response = await ctx.post(url, { data });
      StructuredLogger.api('POST', url, response.status(), Date.now() - start);

      if (!response.ok()) {
        throw { status: response.status(), message: await response.text() };
      }
      return response.json();
    }, { signal });
  }

  async safePatch(url: string, data: any, signal?: AbortSignal) {
    return RetryManager.retry(async () => {
      const ctx = await this.getContext();
      const start = Date.now();
      const response = await ctx.patch(url, { data });
      StructuredLogger.api('PATCH', url, response.status(), Date.now() - start);

      if (!response.ok()) {
        throw { status: response.status(), message: await response.text() };
      }
      return response.json();
    }, { signal });
  }

  async safePut(url: string, data: any, signal?: AbortSignal) {
    return RetryManager.retry(async () => {
      const ctx = await this.getContext();
      const start = Date.now();
      const response = await ctx.put(url, { data });
      StructuredLogger.api('PUT', url, response.status(), Date.now() - start);

      if (!response.ok()) {
        throw { status: response.status(), message: await response.text() };
      }
      return response.json();
    }, { signal });
  }

  async safeDelete(url: string, signal?: AbortSignal) {
    return RetryManager.retry(async () => {
      const ctx = await this.getContext();
      const start = Date.now();
      const response = await ctx.delete(url);
      StructuredLogger.api('DELETE', url, response.status(), Date.now() - start);

      if (!response.ok()) {
        throw { status: response.status(), message: await response.text() };
      }
      return response.status() !== 204 ? response.json() : {};
    }, { signal });
  }

  async get(url: string, signal?: AbortSignal) {
    return this.safeGet(url, signal);
  }

  async post(url: string, data: any, signal?: AbortSignal) {
    return this.safePost(url, data, signal);
  }

  async patch(url: string, data: any, signal?: AbortSignal) {
    return this.safePatch(url, data, signal);
  }

  async put(url: string, data: any, signal?: AbortSignal) {
    return this.safePut(url, data, signal);
  }

  async delete(url: string, signal?: AbortSignal) {
    return this.safeDelete(url, signal);
  }

  async dispose() {
    if (this.context) {
      await this.context.dispose();
    }
  }
}