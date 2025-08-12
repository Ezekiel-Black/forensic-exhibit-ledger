import { ExhibitService } from './exhibitService';
// NOTE: Keep UI synchronous for now by defaulting to local service.
// Flip USE_API to true and refactor screens to async when backend is ready.

export const USE_API = false;

// Local (sync) service used by the app today
export const DataService = ExhibitService;

// Re-export type for convenience if needed
export type { Exhibit } from '../types/exhibit';
