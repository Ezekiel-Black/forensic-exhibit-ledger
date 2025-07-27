
import { Exhibit, ExhibitFormData, CollectionData } from '../types/exhibit';

const STORAGE_KEY = 'atpu_exhibits';

export class ExhibitService {
  private static generateSerialNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    // Get existing exhibits to find the next sequential number
    const exhibits = this.getAllExhibits();
    const currentYearMonth = `${year}${month}`;
    
    // Filter exhibits from current year and month
    const currentPeriodExhibits = exhibits.filter(exhibit => {
      const match = exhibit.serialNumber.match(/^(\d{3})-(\d{2})-(\d{4})$/);
      if (match) {
        const [, , serialMonth, serialYear] = match;
        return `${serialYear}${serialMonth}` === currentYearMonth;
      }
      return false;
    });
    
    // Find the highest sequence number for current month/year
    let maxSequence = 0;
    currentPeriodExhibits.forEach(exhibit => {
      const match = exhibit.serialNumber.match(/^(\d{3})-(\d{2})-(\d{4})$/);
      if (match) {
        const sequence = parseInt(match[1], 10);
        maxSequence = Math.max(maxSequence, sequence);
      }
    });
    
    // Generate next sequence number (001-999)
    const nextSequence = String(maxSequence + 1).padStart(3, '0');
    
    return `${nextSequence}-${month}-${year}`;
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
    
    // Generate automatic serial number
    const serialNumber = this.generateSerialNumber();

    const now = new Date().toISOString();
    const newExhibit: Exhibit = {
      id: crypto.randomUUID(),
      serialNumber,
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
