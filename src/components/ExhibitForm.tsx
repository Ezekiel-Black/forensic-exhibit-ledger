
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Calendar, Users, FileText } from 'lucide-react';
import { ExhibitFormData } from '../types/exhibit';

interface ExhibitFormProps {
  onSubmit: (data: ExhibitFormData) => void;
  isSubmitting?: boolean;
}

export const ExhibitForm: React.FC<ExhibitFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState<ExhibitFormData>({
    dateReceived: new Date().toISOString().split('T')[0],
    receivingOfficer: '',
    examiner: '',
    investigatingOfficer: '',
    station: '',
    accusedPerson: '',
    description: '',
  });

  const [errors, setErrors] = useState<Partial<ExhibitFormData>>({});

  const handleInputChange = (field: keyof ExhibitFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ExhibitFormData> = {};

    if (!formData.dateReceived) {
      newErrors.dateReceived = 'Date received is required';
    }

    if (!formData.receivingOfficer.trim()) {
      newErrors.receivingOfficer = 'Receiving officer is required';
    }

    if (!formData.examiner.trim()) {
      newErrors.examiner = 'Examiner is required';
    }

    if (!formData.investigatingOfficer.trim()) {
      newErrors.investigatingOfficer = 'Investigating officer is required';
    }

    if (!formData.station.trim()) {
      newErrors.station = 'Station is required';
    }

    if (!formData.accusedPerson.trim()) {
      newErrors.accusedPerson = 'Accused person is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSubmit(formData);
      
      // Reset form after successful submission
      setFormData({
        dateReceived: new Date().toISOString().split('T')[0],
        receivingOfficer: '',
        examiner: '',
        investigatingOfficer: '',
        station: '',
        accusedPerson: '',
        description: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Enter the fundamental exhibit identification and receipt details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-blue-800">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">Serial Number</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Serial number will be automatically generated in format: xxx-xx-xxxx (sequence-month-year)
            </p>
          </div>
          
          <div>
            <Label htmlFor="dateReceived">Date Received *</Label>
            <Input
              id="dateReceived"
              type="date"
              value={formData.dateReceived}
              onChange={(e) => handleInputChange('dateReceived', e.target.value)}
              className={errors.dateReceived ? 'border-red-500' : ''}
            />
            {errors.dateReceived && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.dateReceived}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personnel Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Personnel Information
          </CardTitle>
          <CardDescription>
            Specify the officers involved in exhibit handling and processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="receivingOfficer">Receiving Officer *</Label>
              <Input
                id="receivingOfficer"
                value={formData.receivingOfficer}
                onChange={(e) => handleInputChange('receivingOfficer', e.target.value)}
                placeholder="Officer who accepts the exhibit"
                className={errors.receivingOfficer ? 'border-red-500' : ''}
              />
              {errors.receivingOfficer && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.receivingOfficer}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="examiner">Examiner *</Label>
              <Input
                id="examiner"
                value={formData.examiner}
                onChange={(e) => handleInputChange('examiner', e.target.value)}
                placeholder="Officer conducting analysis"
                className={errors.examiner ? 'border-red-500' : ''}
              />
              {errors.examiner && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.examiner}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="investigatingOfficer">Investigating Officer (I/O) *</Label>
              <Input
                id="investigatingOfficer"
                value={formData.investigatingOfficer}
                onChange={(e) => handleInputChange('investigatingOfficer', e.target.value)}
                placeholder="Lead investigating officer"
                className={errors.investigatingOfficer ? 'border-red-500' : ''}
              />
              {errors.investigatingOfficer && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.investigatingOfficer}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="station">Station *</Label>
              <Input
                id="station"
                value={formData.station}
                onChange={(e) => handleInputChange('station', e.target.value)}
                placeholder="Police station/unit"
                className={errors.station ? 'border-red-500' : ''}
              />
              {errors.station && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.station}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Case Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Case Information
          </CardTitle>
          <CardDescription>
            Provide details about the case and exhibits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="accusedPerson">Accused Person *</Label>
            <Input
              id="accusedPerson"
              value={formData.accusedPerson}
              onChange={(e) => handleInputChange('accusedPerson', e.target.value)}
              placeholder="Name of the accused person"
              className={errors.accusedPerson ? 'border-red-500' : ''}
            />
            {errors.accusedPerson && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.accusedPerson}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description of Exhibit(s) *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detailed description of the exhibit(s) including type, condition, and any relevant details"
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legal Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Legal Declaration</p>
              <p>
                By submitting this form, you confirm that all information provided is accurate and complete. 
                The exhibit will be automatically marked as "Unexploited" and can only be changed to "Exploited" 
                once analysis is complete. This action cannot be reversed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button 
          type="submit" 
          size="lg" 
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Exhibit'}
        </Button>
      </div>
    </form>
  );
};
