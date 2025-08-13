import { ExhibitService } from './exhibitService';
import { ExhibitApiService } from './exhibitApiService';
import { Exhibit, ExhibitFormData, CollectionData } from '../types/exhibit';

// Configuration - flip to true when backend is ready
export const USE_API = false;

// Async facade that works with both local and API services
export class AsyncDataService {
  static async getAllExhibits(): Promise<Exhibit[]> {
    if (USE_API) {
      return ExhibitApiService.getAllExhibits();
    }
    // Convert sync to async
    return Promise.resolve(ExhibitService.getAllExhibits());
  }

  static async getExhibitById(id: string): Promise<Exhibit> {
    if (USE_API) {
      return ExhibitApiService.getExhibitById(id);
    }
    const exhibit = ExhibitService.getExhibitById(id);
    if (!exhibit) throw new Error('Exhibit not found');
    return Promise.resolve(exhibit);
  }

  static async createExhibit(data: ExhibitFormData): Promise<Exhibit> {
    if (USE_API) {
      return ExhibitApiService.createExhibit(data);
    }
    return Promise.resolve(ExhibitService.createExhibit(data));
  }

  static async updateExhibit(id: string, updates: Partial<Exhibit>): Promise<Exhibit> {
    if (USE_API) {
      return ExhibitApiService.updateExhibit(id, updates);
    }
    return Promise.resolve(ExhibitService.updateExhibit(id, updates));
  }

  static async markAsCollected(id: string, collectionData: CollectionData): Promise<Exhibit> {
    if (USE_API) {
      return ExhibitApiService.markAsCollected(id, collectionData);
    }
    return Promise.resolve(ExhibitService.markAsCollected(id, collectionData));
  }

  static async deleteExhibit(id: string): Promise<{ success: boolean }> {
    if (USE_API) {
      return ExhibitApiService.deleteExhibit(id);
    }
    ExhibitService.deleteExhibit(id);
    return Promise.resolve({ success: true });
  }

  static async exportData(): Promise<Blob> {
    if (USE_API) {
      return ExhibitApiService.exportData();
    }
    const exhibits = ExhibitService.getAllExhibits();
    const dataStr = JSON.stringify(exhibits, null, 2);
    return Promise.resolve(new Blob([dataStr], { type: 'application/json' }));
  }

  static async importData(file: File): Promise<Exhibit[]> {
    if (USE_API) {
      return ExhibitApiService.importData(file);
    }
    return new Promise((resolve, reject) => {
      try {
        ExhibitService.importData(file, (exhibits) => {
          resolve(exhibits);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static async getStatistics(): Promise<{
    total: number;
    collected: number;
    pending: number;
    exploited: number;
    unexploited: number;
  }> {
    if (USE_API) {
      return ExhibitApiService.getStatistics();
    }
    return Promise.resolve(ExhibitService.getStatistics());
  }
}