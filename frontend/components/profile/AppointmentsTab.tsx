'use client'

import React, { useState } from 'react'
import { Calendar, Clock, MapPin, Phone, Video, MessageSquare, Plus, XCircle, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Appointment {
  id: string
  doctorName: string
  doctorSpecialty: string
  doctorImage: string
  date: string
  time: string
  type: 'in-person' | 'video' | 'phone'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled'
  location?: string
  notes?: string
  duration: number
  price: number
}

interface AppointmentsTabProps {
  appointments: Appointment[]
  onAppointmentChange: (appointments: Appointment[]) => void
}

const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
  appointments,
  onAppointmentChange
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null)
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    doctorName: '',
    doctorSpecialty: '',
    doctorImage: '',
    date: '',
    time: '',
    type: 'in-person',
    status: 'scheduled',
    location: '',
    notes: '',
    duration: 30,
    price: 0
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'in-person': return <MapPin className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'phone': return <Phone className="w-4 h-4" />
      default: return <MapPin className="w-4 h-4" />
    }
  }

  const handleAddAppointment = () => {
    // Add new appointment
    const appointment: Appointment = {
      ...newAppointment,
      id: Date.now().toString()
    } as Appointment
    onAppointmentChange([...appointments, appointment])
    
    setNewAppointment({
      doctorName: '',
      doctorSpecialty: '',
      doctorImage: '',
      date: '',
      time: '',
      type: 'in-person',
      status: 'scheduled',
      location: '',
      notes: '',
      duration: 30,
      price: 0
    })
    setShowAddDialog(false)
  }

  const handleViewAppointment = (appointment: Appointment) => {
    setViewingAppointment(appointment)
    setShowViewDialog(true)
  }

  const handleCancelAppointment = (appointmentId: string) => {
    const updatedAppointments = appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'cancelled' as Appointment['status'] } : apt
    )
    onAppointmentChange(updatedAppointments)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Appointments</h2>
          <p className="text-muted-foreground">Manage your medical appointments</p>
        </div>
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Book Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Doctor Info */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {appointment.doctorName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground">{appointment.doctorName}</h3>
                    <p className="text-muted-foreground">{appointment.doctorSpecialty}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        {getTypeIcon(appointment.type)}
                        <span className="text-sm capitalize">{appointment.type.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Date:</span>
                      <span>{new Date(appointment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Time:</span>
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Duration:</span>
                      <span>{appointment.duration} minutes</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {appointment.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Location:</span>
                        <span className="truncate">{appointment.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Price:</span>
                      <span className="font-semibold text-green-600">₹{appointment.price}</span>
                    </div>
                    {appointment.notes && (
                      <div className="flex items-start gap-2 text-sm">
                        <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="font-medium">Notes:</span>
                        <span className="text-muted-foreground">{appointment.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewAppointment(appointment)}
                    className="gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                  
                  {appointment.status === 'scheduled' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {appointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No appointments scheduled</h3>
            <p className="text-muted-foreground mb-4">Book your first appointment to get started</p>
            <Button onClick={() => setShowAddDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Book Appointment
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Appointment Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Book New Appointment</DialogTitle>
            <DialogDescription>Schedule a new medical appointment</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="doctor-name">Doctor Name</Label>
                <Input
                  id="doctor-name"
                  value={newAppointment.doctorName || ''}
                  onChange={(e) => setNewAppointment({...newAppointment, doctorName: e.target.value})}
                  placeholder="Enter doctor name"
                />
              </div>
              <div>
                <Label htmlFor="specialty">Specialty</Label>
                <Input
                  id="specialty"
                  value={newAppointment.doctorSpecialty || ''}
                  onChange={(e) => setNewAppointment({...newAppointment, doctorSpecialty: e.target.value})}
                  placeholder="e.g., Cardiologist"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appointment-date">Date</Label>
                <Input
                  id="appointment-date"
                  type="date"
                  value={newAppointment.date || ''}
                  onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="appointment-time">Time</Label>
                <Input
                  id="appointment-time"
                  type="time"
                  value={newAppointment.time || ''}
                  onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appointment-type">Type</Label>
                <Select value={newAppointment.type} onValueChange={(value: 'in-person' | 'video' | 'phone') => setNewAppointment({...newAppointment, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newAppointment.duration || ''}
                  onChange={(e) => setNewAppointment({...newAppointment, duration: parseInt(e.target.value)})}
                  placeholder="30"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newAppointment.location || ''}
                onChange={(e) => setNewAppointment({...newAppointment, location: e.target.value})}
                placeholder="Enter location (for in-person appointments)"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newAppointment.price || ''}
                  onChange={(e) => setNewAppointment({...newAppointment, price: parseInt(e.target.value)})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newAppointment.status} onValueChange={(value: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled') => setNewAppointment({...newAppointment, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={newAppointment.notes || ''}
                onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                placeholder="Additional notes or requirements"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAppointment}>
              Book Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Appointment Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>View complete appointment information</DialogDescription>
          </DialogHeader>
          
          {viewingAppointment && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{viewingAppointment.doctorName}</h3>
                  <p className="text-muted-foreground">{viewingAppointment.doctorSpecialty}</p>
                </div>
                <Badge className={getStatusColor(viewingAppointment.status)}>
                  {viewingAppointment.status.charAt(0).toUpperCase() + viewingAppointment.status.slice(1)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Date:</span>
                  <span className="ml-2">{new Date(viewingAppointment.date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium">Time:</span>
                  <span className="ml-2">{viewingAppointment.time}</span>
                </div>
                <div>
                  <span className="font-medium">Duration:</span>
                  <span className="ml-2">{viewingAppointment.duration} minutes</span>
                </div>
                <div>
                  <span className="font-medium">Type:</span>
                  <span className="ml-2 capitalize">{viewingAppointment.type.replace('-', ' ')}</span>
                </div>
                {viewingAppointment.location && (
                  <div className="col-span-2">
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">{viewingAppointment.location}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium">Price:</span>
                  <span className="ml-2 font-semibold text-green-600">₹{viewingAppointment.price}</span>
                </div>
              </div>
              
              {viewingAppointment.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes:</h4>
                  <p className="text-sm text-muted-foreground">{viewingAppointment.notes}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AppointmentsTab
