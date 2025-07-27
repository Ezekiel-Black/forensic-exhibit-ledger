
export interface Exhibit {
  id: string;
  serialNumber: string;
  dateReceived: string;
  receivingOfficer: string;
  examiner: string;
  investigatingOfficer: string;
  station: string;
  accusedPerson: string;
  description: string;
  remarks: 'Unexploited' | 'Exploited';
  collectionStatus: 'Collected' | 'Not Collected';
  collectionDate?: string;
  collectedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExhibitFormData {
  dateReceived: string;
  receivingOfficer: string;
  examiner: string;
  investigatingOfficer: string;
  station: string;
  accusedPerson: string;
  description: string;
}

export interface CollectionData {
  collectedBy: string;
  collectionDate: string;
}

export interface ExhibitSearchFilters {
  searchTerm: string;
  collectionStatus: string;
  remarks: string;
  station: string;
}

export interface ExhibitSortOptions {
  field: 'dateReceived' | 'serialNumber' | 'station' | 'collectionStatus';
  order: 'asc' | 'desc';
}
