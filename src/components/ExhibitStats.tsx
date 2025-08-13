
import React from 'react';
import { Exhibit } from '../types/exhibit';

interface ExhibitStatsProps {
  exhibits: Exhibit[] | null;
  filteredExhibits: Exhibit[];
}

export const ExhibitStats: React.FC<ExhibitStatsProps> = ({
  exhibits,
  filteredExhibits
}) => {
  // Handle loading state when exhibits is null
  const exhibitsArray = exhibits || [];
  
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span>Total Exhibits: {exhibitsArray.length}</span>
      <span>Filtered Results: {filteredExhibits.length}</span>
      <span>Collected: {exhibitsArray.filter(e => e.collectionStatus === 'Collected').length}</span>
      <span>Pending: {exhibitsArray.filter(e => e.collectionStatus === 'Not Collected').length}</span>
    </div>
  );
};
