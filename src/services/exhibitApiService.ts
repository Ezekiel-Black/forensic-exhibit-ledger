import { Exhibit, ExhibitFormData, CollectionData } from '../types/exhibit';
import { API_CONFIG } from '../config/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed with ${res.status}`);
  }
  return res.json();
}

export class ExhibitApiService {
  static async getAllExhibits(): Promise<Exhibit[]> {
    const res = await fetch(`${API_CONFIG.BASE_URL}/exhibits`);
    return handleResponse<Exhibit[]>(res);
  }

  static async getExhibitById(id: string): Promise<Exhibit> {
    const res = await fetch(`${API_CONFIG.BASE_URL}/exhibits/${id}`);
    return handleResponse<Exhibit>(res);
  }

  static async createExhibit(data: ExhibitFormData): Promise<Exhibit> {
    const res = await fetch(`${API_CONFIG.BASE_URL}/exhibits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Exhibit>(res);
  }

  static async updateExhibit(id: string, updates: Partial<Exhibit>): Promise<Exhibit> {
    const res = await fetch(`${API_CONFIG.BASE_URL}/exhibits/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<Exhibit>(res);
  }

  static async markAsCollected(id: string, collectionData: CollectionData): Promise<Exhibit> {
    const res = await fetch(`${API_CONFIG.BASE_URL}/exhibits/${id}/collect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collectionData),
    });
    return handleResponse<Exhibit>(res);
  }

  static async deleteExhibit(id: string): Promise<{ success: boolean }>{
    const res = await fetch(`${API_CONFIG.BASE_URL}/exhibits/${id}`, { method: 'DELETE' });
    return handleResponse<{ success: boolean }>(res);
  }

  static async exportData(): Promise<Blob> {
    const res = await fetch(`${API_CONFIG.BASE_URL}/export`);
    if (!res.ok) throw new Error('Failed to export data');
    return res.blob();
  }

  static async importData(file: File): Promise<Exhibit[]> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_CONFIG.BASE_URL}/import`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<Exhibit[]>(res);
  }

  static async getStatistics(): Promise<{
    total: number;
    collected: number;
    pending: number;
    exploited: number;
    unexploited: number;
  }>{
    const res = await fetch(`${API_CONFIG.BASE_URL}/stats`);
    return handleResponse(res);
  }
}
