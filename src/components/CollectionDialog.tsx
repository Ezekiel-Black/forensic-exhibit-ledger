
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Calendar, User, FileText } from 'lucide-react';
import { Exhibit, CollectionData } from '../types/exhibit';

interface CollectionDialogProps {
  exhibit: Exhibit;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (exhibit: Exhibit, collectionData: CollectionData) => void;
}

export const CollectionDialog: React.FC<CollectionDialogProps> = ({
  exhibit,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [collectionData, setCollectionData] = useState<CollectionData>({
    collectedBy: '',
    collectionDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Partial<CollectionData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof CollectionData, value: string) => {
    setCollectionData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CollectionData> = {};

    if (!collectionData.collectedBy.trim()) {
      newErrors.collectedBy = 'Collected by is required';
    }

    if (!collectionData.collectionDate) {
      newErrors.collectionDate = 'Collection date is required';
    }

    if (exhibit.remarks === 'Unexploited' && !collectionData.unexploitationReason) {
      newErrors.unexploitationReason = 'Please select a reason for unexploitation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(exhibit, collectionData);
      
      // Reset form
      setCollectionData({
        collectedBy: '',
        collectionDate: new Date().toISOString().split('T')[0],
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting collection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Mark Exhibit as Collected
          </DialogTitle>
          <DialogDescription>
            Complete the collection process for this exhibit
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Exhibit Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-gray-900">Exhibit Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Serial Number:</span>
                <p className="font-mono font-medium">{exhibit.serialNumber}</p>
              </div>
              <div>
                <span className="text-gray-600">Date Received:</span>
                <p>{formatDate(exhibit.dateReceived)}</p>
              </div>
              <div>
                <span className="text-gray-600">Accused Person:</span>
                <p>{exhibit.accusedPerson}</p>
              </div>
              <div>
                <span className="text-gray-600">Investigating Officer:</span>
                <p>{exhibit.investigatingOfficer}</p>
              </div>
              <div>
                <span className="text-gray-600">Examiner:</span>
                <p>{exhibit.examiner}</p>
              </div>
              <div>
                <span className="text-gray-600">Station:</span>
                <p>{exhibit.station}</p>
              </div>
            </div>
            <div>
              <span className="text-gray-600">Current Status:</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-yellow-100 text-yellow-800">Not Collected</Badge>
                <Badge className={exhibit.remarks === 'Exploited' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                  {exhibit.remarks}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Collection Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="collectedBy">Collected By *</Label>
                <Input
                  id="collectedBy"
                  value={collectionData.collectedBy}
                  onChange={(e) => handleInputChange('collectedBy', e.target.value)}
                  placeholder="Name of collecting officer"
                  className={errors.collectedBy ? 'border-red-500' : ''}
                />
                {errors.collectedBy && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.collectedBy}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="collectionDate">Collection Date *</Label>
                <Input
                  id="collectionDate"
                  type="date"
                  value={collectionData.collectionDate}
                  onChange={(e) => handleInputChange('collectionDate', e.target.value)}
                  className={errors.collectionDate ? 'border-red-500' : ''}
                />
                {errors.collectionDate && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.collectionDate}
                  </p>
                )}
              </div>
            </div>

            {/* Legal Notice */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Collection Confirmation</p>
                  <p>
                    By marking this exhibit as collected, you confirm that the exhibit has been 
                    properly handed over to the specified officer. This action will generate a 
                    collection report and cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Processing...' : 'Mark as Collected'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
