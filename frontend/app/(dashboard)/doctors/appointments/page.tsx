'use client'

import React, { useState, useEffect } from 'react'
import { 
  Calendar, Clock, MapPin, Stethoscope, Plus, Search, Eye, Edit, Trash2,
  CheckCircle, Download, Loader2, ChevronLeft, ChevronRight, Grid3X3,
  List, TrendingUp, Users, DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/lib/redux/store'
import { 
  fetchAppointments, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment, 
  selectAppointments, 
  selectApptLoading,
  Appointment
} from '@/lib/redux/features/appointmentSlice'

const AppointmentsPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const appointments = useSelector(selectAppointments)
  const isLoading = useSelector(selectApptLoading)

  const [viewMode, setViewMode] = useState<'calendar' | 'table' | 'grid'>('calendar')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    dispatch(fetchAppointments())
  }, [dispatch])

  const filteredAppointments = appointments
    .filter(appointment => {
      const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appointment.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appointment.patientPhone.includes(searchTerm) ||
                           appointment.reason.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
      const matchesType = typeFilter === 'all' || appointment.type === typeFilter
      const matchesDate = dateFilter === 'all' || appointment.date === dateFilter
      return matchesSearch && matchesStatus && matchesType && matchesDate
    })
    .sort((a, b) => {
      let aValue: string | number | Date = a[sortBy as keyof typeof a] as string | number
      let bValue: string | number | Date = b[sortBy as keyof typeof b] as string | number
      
      if (sortBy === 'date') {
        aValue = new Date(a.date + ' ' + a.time).getTime()
        bValue = new Date(b.date + ' ' + b.time).getTime()
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default'
      case 'pending': return 'secondary'
      case 'cancelled': return 'destructive'
      case 'completed': return 'outline'
      default: return 'outline'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'default'
      case 'follow-up': return 'secondary'
      case 'emergency': return 'destructive'
      case 'checkup': return 'outline'
      default: return 'outline'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default'
      case 'pending': return 'secondary'
      case 'refunded': return 'outline'
      default: return 'outline'
    }
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsEditModalOpen(true)
  }

  const handleDeleteAppointment = async (appointmentId: string) => {
    if(confirm("Are you sure you want to delete this appointment?")) {
        await dispatch(deleteAppointment(appointmentId))
    }
  }

  const getFormData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    return Object.fromEntries(formData.entries())
  }

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const data = getFormData(e)
    const payload = {
        ...data,
        patient: "65f1234567890abcdef12345",
        doctor: "65f1234567890abcdef67890",
        duration: Number(data.duration),
        fee: Number(data.fee)
    }

    const success = await dispatch(createAppointment(payload))
    if (success) setIsAddModalOpen(false)
  }

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if(!selectedAppointment) return
    const data = getFormData(e)
    const payload = {
        ...data,
        duration: Number(data.duration),
        fee: Number(data.fee)
    }
    
    const success = await dispatch(updateAppointment(selectedAppointment.id, payload))
    if (success) setIsEditModalOpen(false)
  }

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(appointment => appointment.date === date)
  }

  const todaysAppointments = getAppointmentsForDate(selectedDate)

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground">Manage your patient appointments and schedule</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Schedule Appointment
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Appointments</p>
                  <p className="text-2xl font-bold text-foreground">{appointments.length}</p>
                  <p className="text-sm text-blue-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    All time
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today&apos;s Appointments</p>
                  <p className="text-2xl font-bold text-foreground">{todaysAppointments.length}</p>
                  <p className="text-sm text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Scheduled
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground">{appointments.filter(a => a.status === 'pending').length}</p>
                  <p className="text-sm text-orange-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Action required
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold text-foreground">₹{appointments.filter(a => a.paymentStatus === 'paid').reduce((sum, a) => sum + a.fee, 0).toLocaleString()}</p>
                  <p className="text-sm text-purple-600 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Collected
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date & Time</SelectItem>
                    <SelectItem value="patientName">Patient Name</SelectItem>
                    <SelectItem value="fee">Fee</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
                
                <div className="flex border border-input rounded-lg overflow-hidden">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('calendar')}
                        className="rounded-none"
                      >
                        <Calendar className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Calendar view</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('table')}
                        className="rounded-none"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>List view</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                        className="rounded-none"
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Grid view</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
             <div className="w-full h-40 flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
        ) : (
        <>
            {viewMode === 'calendar' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Calendar</CardTitle>
                    <CardDescription>Select a date to view details</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">January 2024</h3>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm"><ChevronLeft className="w-4 h-4" /></Button>
                            <Button variant="outline" size="sm"><ChevronRight className="w-4 h-4" /></Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="p-2 text-sm font-medium text-muted-foreground">{day}</div>
                        ))}
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                        const date = `2024-01-${day.toString().padStart(2, '0')}`
                        const hasAppt = appointments.some(a => a.date === date)
                        return (
                            <button key={day} onClick={() => setSelectedDate(date)}
                            className={`p-2 text-sm rounded-lg transition-colors relative ${date === selectedDate ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                            {day}
                            {hasAppt && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>}
                            </button>
                        )
                        })}
                    </div>
                </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> {selectedDate}</CardTitle>
                        <CardDescription>{todaysAppointments.length} appointments</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {todaysAppointments.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground text-sm">No appointments scheduled.</p>
                            </div>
                        ) : ( 
                            todaysAppointments.map(app => (
                                <div key={app.id} className="p-3 border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-sm">{app.patientName}</p>
                                            <p className="text-xs text-muted-foreground">{app.time} ({app.duration}m)</p>
                                        </div>
                                        <Badge variant={getStatusColor(app.status) as any} className="text-[10px]">{app.status}</Badge>
                                    </div>
                                    <p className="text-xs mt-1 text-muted-foreground">{app.reason}</p>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
            )}

            {viewMode === 'table' && (
            <Card>
                <CardContent className="p-0">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {paginatedAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                            <Avatar><AvatarImage src={appointment.patientAvatar} /><AvatarFallback>{appointment.patientName[0]}</AvatarFallback></Avatar>
                            <div>
                                <p className="font-medium">{appointment.patientName}</p>
                                <p className="text-sm text-muted-foreground">{appointment.patientPhone}</p>
                            </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="space-y-1">
                                <p className="text-sm">{new Date(appointment.date).toLocaleDateString()}</p>
                                <p className="text-xs text-muted-foreground">{appointment.time} ({appointment.duration}m)</p>
                            </div>
                        </TableCell>
                        <TableCell><Badge variant={getTypeColor(appointment.type) as any}>{appointment.type}</Badge></TableCell>
                        <TableCell><Badge variant={getStatusColor(appointment.status) as any}>{appointment.status}</Badge></TableCell>
                        <TableCell>₹{appointment.fee}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEditAppointment(appointment)}><Edit className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteAppointment(appointment.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
            )}

            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {paginatedAppointments.map((appointment: Appointment) => (
                        <Card key={appointment.id} className="flex flex-col h-full">
                             <CardContent className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={appointment.patientAvatar} />
                                        <AvatarFallback>{appointment.patientName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-bold">{appointment.patientName}</h3>
                                        <p className="text-sm text-muted-foreground">{appointment.patientEmail}</p>
                                    </div>
                                    <div className="flex gap-1 flex-col items-end">
                                        <Badge variant={getStatusColor(appointment.status) as any}>{appointment.status}</Badge>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4 flex-1">
                                    <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-muted-foreground" /> {new Date(appointment.date).toLocaleDateString()}</div>
                                    <div className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4 text-muted-foreground" /> {appointment.time} ({appointment.duration}m)</div>
                                    <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-muted-foreground" /> {appointment.location}</div>
                                    <div className="flex items-center gap-2 text-sm"><Stethoscope className="w-4 h-4 text-muted-foreground" /> {appointment.reason}</div>
                                </div>
                                 <div className="flex gap-2 mt-auto pt-4 border-t">
                                     <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditAppointment(appointment)}><Eye className="w-4 h-4 mr-2" /> View</Button>
                                     <Button size="sm" className="flex-1" onClick={() => handleEditAppointment(appointment)}><Edit className="w-4 h-4 mr-2" /> Edit</Button>
                                 </div>
                             </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAppointments.length)} of {filteredAppointments.length} appointments
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">Page {currentPage} of {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>Create a new appointment with patient details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <div><Label>Patient Name</Label><Input name="patientName" placeholder="Enter patient name" required /></div>
                    <div><Label>Patient Email</Label><Input name="patientEmail" type="email" placeholder="Enter email" /></div>
                    <div><Label>Patient Phone</Label><Input name="patientPhone" placeholder="Enter phone" /></div>
                    <div><Label>Date</Label><Input name="date" type="date" required /></div>
                    <div><Label>Time</Label><Input name="time" type="time" required /></div>
                    <div>
                        <Label>Duration (min)</Label>
                        <Select name="duration" defaultValue="30">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 min</SelectItem>
                                <SelectItem value="30">30 min</SelectItem>
                                <SelectItem value="45">45 min</SelectItem>
                                <SelectItem value="60">60 min</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Type</Label>
                        <Select name="type" defaultValue="consultation">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="consultation">Consultation</SelectItem>
                                <SelectItem value="follow-up">Follow-up</SelectItem>
                                <SelectItem value="emergency">Emergency</SelectItem>
                                <SelectItem value="checkup">Checkup</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div><Label>Fee</Label><Input name="fee" type="number" placeholder="0.00" required /></div>
                    <div className="col-span-2"><Label>Reason</Label><Input name="reason" placeholder="Main reason for visit" required /></div>
                    <div className="col-span-2"><Label>Notes</Label><Textarea name="notes" placeholder="Additional notes" /></div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Schedule Appointment'}</Button>
                </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Appointment</DialogTitle>
            </DialogHeader>
            {selectedAppointment && (
              <form onSubmit={handleUpdateSubmit}>
                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="space-y-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label>Date</Label><Input name="date" type="date" defaultValue={selectedAppointment.date} /></div>
                            <div><Label>Time</Label><Input name="time" type="time" defaultValue={selectedAppointment.time} /></div>
                            <div><Label>Fee</Label><Input name="fee" type="number" defaultValue={selectedAppointment.fee} /></div>
                            <div>
                                <Label>Status</Label>
                                <Select name="status" defaultValue={selectedAppointment.status}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2"><Label>Reason</Label><Input name="reason" defaultValue={selectedAppointment.reason} /></div>
                        </div>
                    </TabsContent>
                    <TabsContent value="notes" className="space-y-4 py-4">
                        <div><Label>Notes</Label><Textarea name="notes" defaultValue={selectedAppointment.notes} rows={5} /></div>
                    </TabsContent>
                </Tabs>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}

export default AppointmentsPage