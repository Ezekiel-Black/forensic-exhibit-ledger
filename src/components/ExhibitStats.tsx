
import React from 'react';
import { Exhibit } from '../types/exhibit';

interface ExhibitStatsProps {
  exhibits: Exhibit[];
  filteredExhibits: Exhibit[];
}

export const ExhibitStats: React.FC<ExhibitStatsProps> = ({
  exhibits,
  filteredExhibits
}) => {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-600">
      <span>Total Exhibits: {exhibits.length}</span>
      <span>Filtered Results: {filteredExhibits.length}</span>
      <span>Collected: {exhibits.filter(e => e.collectionStatus === 'Collected').length}</span>
      <span>Pending: {exhibits.filter(e => e.collectionStatus === 'Not Collected').length}</span>
    </div>
  );
};
