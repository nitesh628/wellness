'use client'

import React, { useState } from 'react'
import { FileText, Calendar, Pill, Clock, Download, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  quantity: number
}

interface Prescription {
  id: string
  doctorName: string
  doctorSpecialty: string
  date: string
  status: 'active' | 'completed' | 'expired' | 'cancelled'
  medications: Medication[]
  notes?: string
  followUpDate?: string
  totalCost: number
}

interface PrescriptionsTabProps {
  prescriptions: Prescription[]
  onPrescriptionChange: (prescriptions: Prescription[]) => void
}

const PrescriptionsTab: React.FC<PrescriptionsTabProps> = ({
  prescriptions,
}) => {
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [viewingPrescription, setViewingPrescription] = useState<Prescription | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleViewPrescription = (prescription: Prescription) => {
    setViewingPrescription(prescription)
    setShowViewDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Prescriptions</h2>
          <p className="text-muted-foreground">View and download your medical prescriptions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {prescriptions.map((prescription) => (
          <Card key={prescription.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Prescription Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{prescription.doctorName}</h3>
                      <p className="text-muted-foreground">{prescription.doctorSpecialty}</p>
                    </div>
                    <Badge className={getStatusColor(prescription.status)}>
                      {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Date:</span>
                        <span>{new Date(prescription.date).toLocaleDateString()}</span>
                      </div>
                      {prescription.followUpDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Follow-up:</span>
                          <span>{new Date(prescription.followUpDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Pill className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Medications:</span>
                        <span>{prescription.medications.length}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Total Cost:</span>
                        <span className="font-semibold text-green-600">₹{prescription.totalCost}</span>
                      </div>
                    </div>
                  </div>
                  
                  {prescription.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Notes:</span> {prescription.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewPrescription(prescription)}
                    className="gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {prescriptions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No prescriptions found</h3>
            <p className="text-muted-foreground mb-4">Your prescriptions will appear here once they are issued by your doctor</p>
          </div>
        )}
      </div>


      {/* View Prescription Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
            <DialogDescription>View complete prescription information</DialogDescription>
          </DialogHeader>
          
          {viewingPrescription && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{viewingPrescription.doctorName}</h3>
                  <p className="text-muted-foreground">{viewingPrescription.doctorSpecialty}</p>
                </div>
                <Badge className={getStatusColor(viewingPrescription.status)}>
                  {viewingPrescription.status.charAt(0).toUpperCase() + viewingPrescription.status.slice(1)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Date:</span>
                  <span className="ml-2">{new Date(viewingPrescription.date).toLocaleDateString()}</span>
                </div>
                {viewingPrescription.followUpDate && (
                  <div>
                    <span className="font-medium">Follow-up:</span>
                    <span className="ml-2">{new Date(viewingPrescription.followUpDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium">Total Cost:</span>
                  <span className="ml-2 font-semibold text-green-600">₹{viewingPrescription.totalCost}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Medications:</h4>
                <div className="space-y-2">
                  {viewingPrescription.medications.map((medication) => (
                    <div key={medication.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{medication.name}</span>
                        <span className="text-sm text-muted-foreground">{medication.dosage}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <span>{medication.frequency} for {medication.duration}</span>
                        {medication.instructions && (
                          <span className="ml-2">• {medication.instructions}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {viewingPrescription.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes:</h4>
                  <p className="text-sm text-muted-foreground">{viewingPrescription.notes}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PrescriptionsTab
