
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FileText } from 'lucide-react';
import { SearchFilters } from './SearchFilters';
import { ExhibitStats } from './ExhibitStats';
import { ExhibitsTable } from './ExhibitsTable';
import { Exhibit } from '../types/exhibit';

interface ExhibitsDashboardProps {
  exhibits: Exhibit[];
  filteredExhibits: Exhibit[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filterRemarks: string;
  setFilterRemarks: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (value: 'asc' | 'desc') => void;
  onDownloadSubmissionPDF: (exhibit: Exhibit) => void;
  onDownloadCollectionPDF: (exhibit: Exhibit) => void;
  onMarkAsExploited: (exhibit: Exhibit) => void;
  onMarkAsCollected: (exhibit: Exhibit) => void;
}

export const ExhibitsDashboard: React.FC<ExhibitsDashboardProps> = ({
  exhibits,
  filteredExhibits,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterRemarks,
  setFilterRemarks,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onDownloadSubmissionPDF,
  onDownloadCollectionPDF,
  onMarkAsExploited,
  onMarkAsCollected
}) => {
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Exhibits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterRemarks={filterRemarks}
            setFilterRemarks={setFilterRemarks}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          <ExhibitStats
            exhibits={exhibits}
            filteredExhibits={filteredExhibits}
          />
        </CardContent>
      </Card>

      {/* Exhibits Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Exhibits Registry
          </CardTitle>
          <CardDescription>
            {filteredExhibits.length} exhibit{filteredExhibits.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExhibitsTable
            exhibits={filteredExhibits}
            onDownloadSubmissionPDF={onDownloadSubmissionPDF}
            onDownloadCollectionPDF={onDownloadCollectionPDF}
            onMarkAsExploited={onMarkAsExploited}
            onMarkAsCollected={onMarkAsCollected}
          />
        </CardContent>
      </Card>
    </div>
  );
};
