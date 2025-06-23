
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText } from 'lucide-react';
import { Exhibit } from '../types/exhibit';

interface ExhibitsTableProps {
  exhibits: Exhibit[];
  onDownloadSubmissionPDF: (exhibit: Exhibit) => void;
  onDownloadCollectionPDF: (exhibit: Exhibit) => void;
  onMarkAsExploited: (exhibit: Exhibit) => void;
  onMarkAsCollected: (exhibit: Exhibit) => void;
}

export const ExhibitsTable: React.FC<ExhibitsTableProps> = ({
  exhibits,
  onDownloadSubmissionPDF,
  onDownloadCollectionPDF,
  onMarkAsExploited,
  onMarkAsCollected
}) => {
  const getStatusBadge = (status: string) => {
    return status === 'Collected' 
      ? <Badge className="bg-green-100 text-green-800">Collected</Badge>
      : <Badge className="bg-yellow-100 text-yellow-800">Not Collected</Badge>;
  };

  const getRemarksBadge = (remarks: string) => {
    return remarks === 'Exploited' 
      ? <Badge className="bg-blue-100 text-blue-800">Exploited</Badge>
      : <Badge className="bg-gray-100 text-gray-800">Unexploited</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Serial Number</TableHead>
            <TableHead>Date Received</TableHead>
            <TableHead>Accused Person</TableHead>
            <TableHead>I/O</TableHead>
            <TableHead>Station</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exhibits.map((exhibit) => (
            <TableRow key={exhibit.id}>
              <TableCell className="font-mono font-medium">{exhibit.serialNumber}</TableCell>
              <TableCell>{formatDate(exhibit.dateReceived)}</TableCell>
              <TableCell>{exhibit.accusedPerson}</TableCell>
              <TableCell>{exhibit.investigatingOfficer}</TableCell>
              <TableCell>{exhibit.station}</TableCell>
              <TableCell>{getStatusBadge(exhibit.collectionStatus)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getRemarksBadge(exhibit.remarks)}
                  {exhibit.remarks === 'Unexploited' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarkAsExploited(exhibit)}
                      className="text-xs"
                    >
                      Mark Exploited
                    </Button>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDownloadSubmissionPDF(exhibit)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {exhibit.collectionStatus === 'Not Collected' ? (
                    <Button
                      size="sm"
                      onClick={() => onMarkAsCollected(exhibit)}
                    >
                      Collect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDownloadCollectionPDF(exhibit)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
