
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchFiltersProps {
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
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterRemarks,
  setFilterRemarks,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Serial, Accused, I/O, Station..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="status-filter">Collection Status</Label>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Collected">Collected</SelectItem>
            <SelectItem value="Not Collected">Not Collected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="remarks-filter">Remarks</Label>
        <Select value={filterRemarks} onValueChange={setFilterRemarks}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Remarks</SelectItem>
            <SelectItem value="Unexploited">Unexploited</SelectItem>
            <SelectItem value="Exploited">Exploited</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="sort">Sort By</Label>
        <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
          const [field, order] = value.split('-');
          setSortBy(field);
          setSortOrder(order as 'asc' | 'desc');
        }}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dateReceived-desc">Date Received (Newest)</SelectItem>
            <SelectItem value="dateReceived-asc">Date Received (Oldest)</SelectItem>
            <SelectItem value="serialNumber-asc">Serial Number (A-Z)</SelectItem>
            <SelectItem value="serialNumber-desc">Serial Number (Z-A)</SelectItem>
            <SelectItem value="station-asc">Station (A-Z)</SelectItem>
            <SelectItem value="collectionStatus-asc">Collection Status</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
