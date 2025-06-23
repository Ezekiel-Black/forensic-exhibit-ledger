import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Download, FileText, Calendar, Shield, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ExhibitService } from '../services/exhibitService';
import { PDFGenerator } from '../utils/pdfGenerator';
import { Exhibit, ExhibitFormData, CollectionData } from '../types/exhibit';
import { ExhibitForm } from '../components/ExhibitForm';
import { CollectionDialog } from '../components/CollectionDialog';

const Index = () => {
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [filteredExhibits, setFilteredExhibits] = useState<Exhibit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRemarks, setFilterRemarks] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dateReceived');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);
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
      setIsSubmissionFormOpen(false);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
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
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search & Filter Exhibits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Total Exhibits: {exhibits.length}</span>
                  <span>Filtered Results: {filteredExhibits.length}</span>
                  <span>Collected: {exhibits.filter(e => e.collectionStatus === 'Collected').length}</span>
                  <span>Pending: {exhibits.filter(e => e.collectionStatus === 'Not Collected').length}</span>
                </div>
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
                      {filteredExhibits.map((exhibit) => (
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
                                  onClick={() => handleMarkAsExploited(exhibit)}
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
                                onClick={() => handleDownloadSubmissionPDF(exhibit)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              {exhibit.collectionStatus === 'Not Collected' ? (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedExhibit(exhibit);
                                    setIsCollectionDialogOpen(true);
                                  }}
                                >
                                  Collect
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDownloadCollectionPDF(exhibit)}
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
              </CardContent>
            </Card>
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
