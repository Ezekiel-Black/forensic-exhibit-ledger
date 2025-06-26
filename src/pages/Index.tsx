import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ExhibitService } from '../services/exhibitService';
import { PDFGenerator } from '../utils/pdfGenerator';
import { Exhibit, ExhibitFormData, CollectionData } from '../types/exhibit';
import { ExhibitForm } from '../components/ExhibitForm';
import { CollectionDialog } from '../components/CollectionDialog';
import { ExhibitsDashboard } from '../components/ExhibitsDashboard';

const Index = () => {
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [filteredExhibits, setFilteredExhibits] = useState<Exhibit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRemarks, setFilterRemarks] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dateReceived');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit | null>(null);
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);

  useEffect(() => {
    loadExhibits();
  }, []);

  useEffect(() => {
    filterAndSortExhibits();
  }, [exhibits, searchTerm, filterStatus, filterRemarks, sortBy, sortOrder]);

  const loadExhibits = () => {
    const loadedExhibits = ExhibitService.getAllExhibits();
    setExhibits(loadedExhibits);
    console.log('Loaded exhibits:', loadedExhibits);
  };

  const filterAndSortExhibits = () => {
    let filtered = exhibits.filter(exhibit => {
      const matchesSearch = 
        exhibit.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exhibit.accusedPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exhibit.investigatingOfficer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exhibit.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exhibit.receivingOfficer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exhibit.examiner.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || exhibit.collectionStatus === filterStatus;
      const matchesRemarks = filterRemarks === 'all' || exhibit.remarks === filterRemarks;

      return matchesSearch && matchesStatus && matchesRemarks;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'dateReceived':
          aValue = new Date(a.dateReceived).getTime();
          bValue = new Date(b.dateReceived).getTime();
          break;
        case 'serialNumber':
          aValue = a.serialNumber;
          bValue = b.serialNumber;
          break;
        case 'station':
          aValue = a.station;
          bValue = b.station;
          break;
        case 'collectionStatus':
          aValue = a.collectionStatus;
          bValue = b.collectionStatus;
          break;
        default:
          aValue = a.dateReceived;
          bValue = b.dateReceived;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredExhibits(filtered);
  };

  const handleSubmitExhibit = (data: ExhibitFormData) => {
    try {
      const newExhibit = ExhibitService.createExhibit(data);
      setExhibits(prev => [...prev, newExhibit]);
      toast.success('Exhibit submitted successfully!');
      console.log('New exhibit created:', newExhibit);
    } catch (error) {
      toast.error('Failed to submit exhibit. Please try again.');
      console.error('Error creating exhibit:', error);
    }
  };

  const handleMarkAsCollected = (exhibit: Exhibit, collectionData: CollectionData) => {
    try {
      const updatedExhibit = ExhibitService.markAsCollected(exhibit.id, collectionData);
      setExhibits(prev => prev.map(e => e.id === exhibit.id ? updatedExhibit : e));
      setIsCollectionDialogOpen(false);
      setSelectedExhibit(null);
      toast.success('Exhibit marked as collected!');
      console.log('Exhibit collected:', updatedExhibit);
    } catch (error) {
      toast.error('Failed to mark exhibit as collected.');
      console.error('Error marking exhibit as collected:', error);
    }
  };

  const handleMarkAsExploited = (exhibit: Exhibit) => {
    try {
      const updatedExhibit = ExhibitService.updateExhibit(exhibit.id, { remarks: 'Exploited' });
      setExhibits(prev => prev.map(e => e.id === exhibit.id ? updatedExhibit : e));
      toast.success('Exhibit marked as exploited!');
      console.log('Exhibit marked as exploited:', updatedExhibit);
    } catch (error) {
      toast.error('Failed to mark exhibit as exploited.');
      console.error('Error marking exhibit as exploited:', error);
    }
  };

  const handleDownloadSubmissionPDF = (exhibit: Exhibit) => {
    try {
      PDFGenerator.generateSubmissionReceipt(exhibit);
      toast.success('Submission receipt downloaded!');
    } catch (error) {
      toast.error('Failed to generate PDF report.');
      console.error('Error generating submission PDF:', error);
    }
  };

  const handleDownloadCollectionPDF = (exhibit: Exhibit) => {
    try {
      if (exhibit.collectionStatus === 'Not Collected') {
        toast.error('Cannot generate collection report for uncollected exhibit.');
        return;
      }
      PDFGenerator.generateCollectionReport(exhibit);
      toast.success('Collection report downloaded!');
    } catch (error) {
      toast.error('Failed to generate collection report.');
      console.error('Error generating collection PDF:', error);
    }
  };

  const handleExportData = () => {
    try {
      ExhibitService.exportData();
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data.');
      console.error('Error exporting data:', error);
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      ExhibitService.importData(file, (importedExhibits) => {
        setExhibits(importedExhibits);
        toast.success('Data imported successfully!');
        console.log('Data imported:', importedExhibits);
      });
    } catch (error) {
      toast.error('Failed to import data.');
      console.error('Error importing data:', error);
    }
  };

  const handleMarkAsCollectedClick = (exhibit: Exhibit) => {
    setSelectedExhibit(exhibit);
    setIsCollectionDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/5eed787c-47df-4e92-bce6-d9383486879f.png" 
                alt="ATPU Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">ATPU Exhibit Management</h1>
                <p className="text-sm text-gray-500">Anti-Terror Police Unit - Forensic Evidence System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleExportData} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="submit">Submit New Exhibit</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <ExhibitsDashboard
              exhibits={exhibits}
              filteredExhibits={filteredExhibits}
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
              onDownloadSubmissionPDF={handleDownloadSubmissionPDF}
              onDownloadCollectionPDF={handleDownloadCollectionPDF}
              onMarkAsExploited={handleMarkAsExploited}
              onMarkAsCollected={handleMarkAsCollectedClick}
            />
          </TabsContent>

          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Submit New Exhibit
                </CardTitle>
                <CardDescription>
                  Enter exhibit details for intake and processing by ATPU technicians
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExhibitForm onSubmit={handleSubmitExhibit} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Collection Dialog */}
      {selectedExhibit && (
        <CollectionDialog
          exhibit={selectedExhibit}
          isOpen={isCollectionDialogOpen}
          onClose={() => {
            setIsCollectionDialogOpen(false);
            setSelectedExhibit(null);
          }}
          onSubmit={handleMarkAsCollected}
        />
      )}
    </div>
  );
};

export default Index;
