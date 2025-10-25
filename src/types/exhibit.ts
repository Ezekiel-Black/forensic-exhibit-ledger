
export type UnexploitationReason =
  | 'Pending Legal Authorization'
  | 'Owner Cooperation Required'
  | 'Device Locked / Encrypted'
  | 'Unsupported Device Model'
  | 'Unsupported OS / Firmware Version'
  | 'Severe Physical Damage'
  | 'Battery / Power Issues'
  | 'Hardware Failure'
  | 'Evidence Contamination Risk'
  | 'Pending Specialist Review'
  | 'Duplicate Exhibit'
  | 'Investigation Halted';

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
  unexploitationReason?: UnexploitationReason;
  collectionStatus: 'Collected' | 'Not Collected';
  collectionDate?: string;
  collectedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExhibitFormData {
  serialNumber?: string;
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
  unexploitationReason?: UnexploitationReason;
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
