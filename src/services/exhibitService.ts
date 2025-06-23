
import { Exhibit, ExhibitFormData, CollectionData } from '../types/exhibit';

const STORAGE_KEY = 'atpu_exhibits';

export class ExhibitService {
  private static generateSerialNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `ATPU-${timestamp}-${random}`.toUpperCase();
  }

  static getAllExhibits(): Exhibit[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading exhibits:', error);
      return [];
    }
  }

  static getExhibitById(id: string): Exhibit | null {
    const exhibits = this.getAllExhibits();
    return exhibits.find(exhibit => exhibit.id === id) || null;
  }

  static createExhibit(data: ExhibitFormData): Exhibit {
    const exhibits = this.getAllExhibits();
    
    // Check for duplicate serial number
    const existingExhibit = exhibits.find(e => e.serialNumber === data.serialNumber);
    if (existingExhibit) {
      throw new Error('Serial number already exists');
    }

    const now = new Date().toISOString();
    const newExhibit: Exhibit = {
      id: crypto.randomUUID(),
      ...data,
      remarks: 'Unexploited',
      collectionStatus: 'Not Collected',
      createdAt: now,
      updatedAt: now,
    };

    const updatedExhibits = [...exhibits, newExhibit];
    this.saveExhibits(updatedExhibits);
    
    return newExhibit;
  }

  static updateExhibit(id: string, updates: Partial<Exhibit>): Exhibit {
    const exhibits = this.getAllExhibits();
    const index = exhibits.findIndex(exhibit => exhibit.id === id);
    
    if (index === -1) {
      throw new Error('Exhibit not found');
    }

    const existingExhibit = exhibits[index];
    
    // Prevent reverting remarks from "Exploited" to "Unexploited"
    if (existingExhibit.remarks === 'Exploited' && updates.remarks === 'Unexploited') {
      throw new Error('Cannot revert remarks from "Exploited" to "Unexploited"');
    }

    const updatedExhibit: Exhibit = {
      ...existingExhibit,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    exhibits[index] = updatedExhibit;
    this.saveExhibits(exhibits);
    
    return updatedExhibit;
  }

  static markAsCollected(id: string, collectionData: CollectionData): Exhibit {
    const exhibits = this.getAllExhibits();
    const exhibit = exhibits.find(e => e.id === id);
    
    if (!exhibit) {
      throw new Error('Exhibit not found');
    }

    if (exhibit.collectionStatus === 'Collected') {
      throw new Error('Exhibit is already collected');
    }

    const updatedExhibit: Exhibit = {
      ...exhibit,
      collectionStatus: 'Collected',
      collectionDate: collectionData.collectionDate,
      collectedBy: collectionData.collectedBy,
      updatedAt: new Date().toISOString(),
    };

    const updatedExhibits = exhibits.map(e => e.id === id ? updatedExhibit : e);
    this.saveExhibits(updatedExhibits);
    
    return updatedExhibit;
  }

  static deleteExhibit(id: string): boolean {
    const exhibits = this.getAllExhibits();
    const filteredExhibits = exhibits.filter(exhibit => exhibit.id !== id);
    
    if (filteredExhibits.length === exhibits.length) {
      return false; // Exhibit not found
    }

    this.saveExhibits(filteredExhibits);
    return true;
  }

  private static saveExhibits(exhibits: Exhibit[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exhibits));
    } catch (error) {
      console.error('Error saving exhibits:', error);
      throw new Error('Failed to save exhibit data');
    }
  }

  static exportData(): void {
    const exhibits = this.getAllExhibits();
    const dataStr = JSON.stringify(exhibits, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `atpu_exhibits_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  static importData(file: File, callback: (exhibits: Exhibit[]) => void): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }

        // Validate each exhibit
        data.forEach((exhibit: any, index: number) => {
          if (!exhibit.id || !exhibit.serialNumber || !exhibit.dateReceived) {
            throw new Error(`Invalid exhibit at position ${index + 1}`);
          }
        });

        this.saveExhibits(data);
        callback(data);
      } catch (error) {
        console.error('Error importing data:', error);
        throw new Error('Failed to import data: Invalid file format');
      }
    };
    
    reader.readAsText(file);
  }

  static getStatistics() {
    const exhibits = this.getAllExhibits();
    
    return {
      total: exhibits.length,
      collected: exhibits.filter(e => e.collectionStatus === 'Collected').length,
      pending: exhibits.filter(e => e.collectionStatus === 'Not Collected').length,
      exploited: exhibits.filter(e => e.remarks === 'Exploited').length,
      unexploited: exhibits.filter(e => e.remarks === 'Unexploited').length,
    };
  }

  static searchExhibits(query: string): Exhibit[] {
    const exhibits = this.getAllExhibits();
    const searchTerm = query.toLowerCase();
    
    return exhibits.filter(exhibit => 
      exhibit.serialNumber.toLowerCase().includes(searchTerm) ||
      exhibit.accusedPerson.toLowerCase().includes(searchTerm) ||
      exhibit.investigatingOfficer.toLowerCase().includes(searchTerm) ||
      exhibit.station.toLowerCase().includes(searchTerm) ||
      exhibit.receivingOfficer.toLowerCase().includes(searchTerm) ||
      exhibit.examiner.toLowerCase().includes(searchTerm) ||
      exhibit.description.toLowerCase().includes(searchTerm)
    );
  }
}
