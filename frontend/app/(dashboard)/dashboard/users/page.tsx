'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  Search, 
  Grid3X3, 
  List, 
  Edit, 
  Trash2, 
  UserPlus,
  User,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Crown,
  Stethoscope,
  Megaphone,
  ShoppingBag,
  Upload,
  Camera,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import Loader from '@/components/common/dashboard/Loader'
import Error from '@/components/common/dashboard/Error'
import NoData from '@/components/common/dashboard/NoData'
import {
  fetchUsersData,
  setFilters,
  setPagination,
  selectUsersData,
  selectUsersLoading,
  selectUsersError,
  selectUsersFilters,
  selectUsersPagination,
  updateUser,
  deleteUser,
  User as UserType
} from '@/lib/redux/features/userSlice'


const userRoles = ["All", "Admin", "Doctor", "Influencer", "Customer"]
const userStatuses = ["All", "Active", "Inactive"]

const UsersPage = () => {
  const dispatch = useAppDispatch()
  const users = useAppSelector(selectUsersData)
  const isLoading = useAppSelector(selectUsersLoading)
  const error = useAppSelector(selectUsersError)
  const filters = useAppSelector(selectUsersFilters)
  const pagination = useAppSelector(selectUsersPagination)

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [modalLoading, setModalLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const newUserFileInputRef = useRef<HTMLInputElement>(null)
  
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    imageUrl: '',
    role: 'Customer' as 'Admin' | 'Doctor' | 'Influencer' | 'Customer',
    status: 'Active' as 'Active' | 'Inactive'
  })


  const getUserImage = (user: UserType) => {
    return user.imageUrl || '/placeholder-user.svg'
  }

  // Avatar upload functions
  const handleAvatarUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && selectedUser) {
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedUser({
          ...selectedUser,
          imageUrl: reader.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  }


  const removeAvatar = () => {
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        imageUrl: undefined
      })
    }
  }

  // New User avatar functions
  const handleNewUserAvatarUpload = () => {
    newUserFileInputRef.current?.click()
  }

  const handleNewUserFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setNewUser({
          ...newUser,
          imageUrl: reader.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeNewUserAvatar = () => {
    setNewUser({
      ...newUser,
      imageUrl: ''
    })
  }

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchUsersData())
  }, [dispatch])

  // Pagination logic using Redux pagination
  const totalPages = Math.ceil(pagination.total / pagination.limit)
  const startIndex = (pagination.page - 1) * pagination.limit
  const endIndex = startIndex + pagination.limit

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin': return <Crown className="w-4 h-4" />
      case 'Doctor': return <Stethoscope className="w-4 h-4" />
      case 'Influencer': return <Megaphone className="w-4 h-4" />
      case 'Customer': return <ShoppingBag className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'outline'
      case 'Doctor': return 'default'
      case 'Influencer': return 'secondary'
      case 'Customer': return 'outline'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-4 h-4" />
      case 'Inactive': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default'
      case 'Inactive': return 'secondary'
      default: return 'secondary'
    }
  }

  // Handle filter changes
  const handleSearchChange = (value: string) => {
    dispatch(setFilters({ search: value }))
    dispatch(setPagination({ page: 1 }))
  }

  const handleRoleChange = (value: string) => {
    dispatch(setFilters({ role: value === 'All' ? '' : value }))
    dispatch(setPagination({ page: 1 }))
  }

  const handleStatusChange = (value: string) => {
    dispatch(setFilters({ status: value === 'All' ? '' : value }))
    dispatch(setPagination({ page: 1 }))
  }

  const handlePageChange = (page: number) => {
    dispatch(setPagination({ page }))
  }

  const handleDeleteUser = async () => {
    if (!selectedUser || selectedUser.role === 'Admin') return
    
    setModalLoading(true)
    try {
      const success = await dispatch(deleteUser(selectedUser._id)) as unknown as boolean
      if (success) {
        setShowDeleteModal(false)
        setSelectedUser(null)
        dispatch(fetchUsersData())
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    } finally {
      setModalLoading(false)
    }
  }

  const openViewModal = (user: UserType) => {
    setSelectedUser(user)
    setShowViewModal(true)
  }

  const openEditModal = (user: UserType) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const openDeleteModal = (user: UserType) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {error ? (
          <Error title="Error loading users" message={error} />
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Users</h1>
                <p className="text-muted-foreground">Manage user accounts and permissions</p>
              </div>
              <Button onClick={() => setShowAddModal(true)} className="gap-2">
                <UserPlus className="w-4 h-4" />
                Add User
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold text-foreground">{pagination.total}</p>
                    </div>
                    <User className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold text-foreground">{(users || []).filter(u => u.status === 'Active').length}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Doctors</p>
                      <p className="text-2xl font-bold text-foreground">{(users || []).filter(u => u.role === 'Doctor').length}</p>
                    </div>
                    <Stethoscope className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Influencers</p>
                      <p className="text-2xl font-bold text-foreground">{(users || []).filter(u => u.role === 'Influencer').length}</p>
                    </div>
                    <Megaphone className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search users..."
                      value={filters.search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Role Filter */}
                  <Select value={filters.role || 'All'} onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoles.map(role => (
                        <SelectItem key={role} value={role}>
                          {role === 'All' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Status Filter */}
                  <Select value={filters.status || 'All'} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {userStatuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {status === 'All' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* View Toggle */}
                  <div className="flex border border-input rounded-lg overflow-hidden">
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          size="icon"
                          onClick={() => setViewMode('list')}
                          className="rounded-none"
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>List view</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            {isLoading ? (
              <Loader variant="skeleton" message="Loading users..." />
            ) : users.length === 0 ? (
              <NoData 
                message="No users found"
                description="Get started by adding your first user"
                icon={<User className="w-full h-full text-muted-foreground/60" />}
                action={{
                  label: "Add User",
                  onClick: () => setShowAddModal(true)
                }}
                size="lg"
              />
            ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {users.map(user => (
              <Card key={user._id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage 
                          src={getUserImage(user)} 
                          alt={`${user.firstName} ${user.lastName}`}
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-user.svg'
                          }}
                        />
                        <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{user.firstName} {user.lastName}</CardTitle>
                        <CardDescription className="text-sm">{user.email}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant={getRoleColor(user.role) as 'default' | 'secondary' | 'destructive' | 'outline'}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                      </Badge>
                      <Badge variant={getStatusColor(user.status) as 'default' | 'secondary' | 'destructive' | 'outline'}>
                        {getStatusIcon(user.status)}
                        <span className="ml-1">{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Phone:</span>
                      <span className="text-sm font-medium">{user.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Verified:</span>
                      <Badge variant={user.verified ? 'success' : 'secondary'}>
                        {user.verified ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Join Date:</span>
                      <span className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    {user.role === 'Customer' && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Phone:</span>
                        <span className="text-sm font-medium">{user.phone}</span>
                        </div>
                    )}
                    {user.role === 'Influencer' && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Followers:</span>
                        <span className="text-sm font-medium">{user.followers?.toLocaleString() || 0}</span>
                      </div>
                    )}
                    {user.role === 'Doctor' && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Experience:</span>
                        <span className="text-sm font-medium">{user.experience || 0} years</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2 mt-auto">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => openViewModal(user)}
                          className="flex-1 gap-2"
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View user profile</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => openEditModal(user)}
                          className="flex-1 gap-2"
                          size="sm"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit user details</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage 
                                src={getUserImage(user)} 
                                alt={`${user.firstName} ${user.lastName}`}
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder-user.svg'
                                }}
                              />
                              <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{user.firstName} {user.lastName}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleColor(user.role) as 'default' | 'secondary' | 'destructive' | 'outline'}>
                            {getRoleIcon(user.role)}
                            <span className="ml-1">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(user.status) as 'default' | 'secondary' | 'destructive' | 'outline'}>
                            {getStatusIcon(user.status)}
                            <span className="ml-1">{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => openViewModal(user)}
                                  variant="ghost"
                                  size="icon"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View user</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => openEditModal(user)}
                                  variant="ghost"
                                  size="icon"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit user</p>
                              </TooltipContent>
                            </Tooltip>
                            {user.role !== 'Admin' && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    onClick={() => openDeleteModal(user)}
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete user</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}

            {/* Pagination */}
            {!isLoading && users.length > 0 && totalPages > 1 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, pagination.total)} of {pagination.total} users
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.max(pagination.page - 1, 1))}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={pagination.page === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.min(pagination.page + 1, totalPages))}
                    disabled={pagination.page === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
            )}
          </>
        )}

        {/* View User Modal */}
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>User Profile - {selectedUser?.firstName} {selectedUser?.lastName}</DialogTitle>
              <DialogDescription>
                Complete user information and account details.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                {/* User Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">{selectedUser.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date of Birth:</span>
                        <span className="font-medium">{selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString() : 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Address:</span>
                        <span className="font-medium text-right max-w-[200px]">{selectedUser.address}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Role:</span>
                        <Badge variant={getRoleColor(selectedUser.role) as 'default' | 'secondary' | 'destructive' | 'outline'}>
                          {getRoleIcon(selectedUser.role)}
                          <span className="ml-1">{selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}</span>
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={getStatusColor(selectedUser.status) as 'default' | 'secondary' | 'destructive' | 'outline'}>
                          {getStatusIcon(selectedUser.status)}
                          <span className="ml-1">{selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}</span>
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Verified:</span>
                        <Badge variant={selectedUser.verified ? 'success' : 'secondary'}>
                          {selectedUser.verified ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Join Date:</span>
                        <span className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span className="font-medium">{new Date(selectedUser.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bio */}
                <Card>
                  <CardHeader>
                    <CardTitle>Bio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{selectedUser.bio}</p>
                  </CardContent>
                </Card>

                {/* Role-specific Information */}
                {selectedUser.role === 'Customer' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">Contact Info</p>
                          <p className="text-sm text-muted-foreground">{selectedUser.phone}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">Status</p>
                          <p className="text-sm text-muted-foreground">{selectedUser.isActive ? 'Active' : 'Inactive'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedUser.role === 'Influencer' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Influencer Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{selectedUser.followers?.toLocaleString() || 0}</p>
                          <p className="text-sm text-muted-foreground">Followers</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{selectedUser.platform || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">Platform</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{selectedUser.commissionRate || 0}%</p>
                          <p className="text-sm text-muted-foreground">Commission Rate</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedUser.role === 'Doctor' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Doctor Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{selectedUser.experience || 0}</p>
                          <p className="text-sm text-muted-foreground">Years Experience</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{selectedUser.hospital || 'Not specified'}</p>
                          <p className="text-sm text-muted-foreground">Hospital</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{selectedUser.consultationFee || 0}</p>
                          <p className="text-sm text-muted-foreground">Consultation Fee</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit User - {selectedUser?.firstName} {selectedUser?.lastName}</DialogTitle>
              <DialogDescription>
                Update user information and account settings.
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-6">
                {/* Avatar Section - Top Center */}
                <div className="flex flex-col items-center space-y-4 py-4">
                  <Label htmlFor="avatar" className="text-lg font-medium">Profile Picture</Label>
                  <Avatar className="w-24 h-24">
                    <AvatarImage 
                      src={selectedUser.imageUrl || '/placeholder-user.svg'} 
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                    />
                    <AvatarFallback className="text-xl">{selectedUser.firstName[0]}{selectedUser.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex gap-3">
                    <Button onClick={handleAvatarUpload} variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                    <Button onClick={removeAvatar} variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={selectedUser.firstName}
                      onChange={(e) => setSelectedUser({...selectedUser, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={selectedUser.lastName}
                      onChange={(e) => setSelectedUser({...selectedUser, lastName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={selectedUser.email}
                      onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={selectedUser.phone}
                      onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      value={selectedUser.role} 
                      onValueChange={(value: "Admin" | "Doctor" | "Influencer" | "Customer") => setSelectedUser({...selectedUser, role: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Doctor">Doctor</SelectItem>
                        <SelectItem value="Influencer">Influencer</SelectItem>
                        <SelectItem value="Customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={selectedUser.status} 
                      onValueChange={(value: "Active" | "Inactive") => setSelectedUser({...selectedUser, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={selectedUser.dateOfBirth}
                      onChange={(e) => setSelectedUser({...selectedUser, dateOfBirth: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="verified">Verified</Label>
                    <Select 
                      value={selectedUser.verified ? 'true' : 'false'} 
                      onValueChange={(value) => setSelectedUser({...selectedUser, verified: value === 'true'})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select verification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Verified</SelectItem>
                        <SelectItem value="false">Not Verified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={selectedUser.address}
                    onChange={(e) => setSelectedUser({...selectedUser, address: e.target.value})}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={selectedUser.bio}
                    onChange={(e) => setSelectedUser({...selectedUser, bio: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditModal(false)} disabled={modalLoading}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  // Update user using Redux
                  setModalLoading(true)
                  dispatch(updateUser(selectedUser!._id, selectedUser!))
                  setShowEditModal(false)
                  setModalLoading(false)
                }} 
                disabled={modalLoading}
              >
                {modalLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update User'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add User Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with the required information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Avatar Section - Top Center */}
              <div className="flex flex-col items-center space-y-4 py-4">
                <Label htmlFor="newAvatar" className="text-lg font-medium">Profile Picture</Label>
                <Avatar className="w-24 h-24">
                  <AvatarImage 
                    src={newUser.imageUrl || '/placeholder-user.svg'} 
                    alt={`${newUser.firstName} ${newUser.lastName}`}
                  />
                  <AvatarFallback className="text-xl">
                    {newUser.firstName ? newUser.firstName[0] : '?'}{newUser.lastName ? newUser.lastName[0] : '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-3">
                  <Button onClick={handleNewUserAvatarUpload} variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <Button onClick={removeNewUserAvatar} variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
                <input
                  ref={newUserFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleNewUserFileSelect}
                  className="hidden"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="newFirstName">First Name</Label>
                  <Input
                    id="newFirstName"
                    placeholder="Enter first name"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="newLastName">Last Name</Label>
                  <Input
                    id="newLastName"
                    placeholder="Enter last name"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="newEmail">Email</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    placeholder="Enter email address"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="newPhone">Phone</Label>
                  <Input
                    id="newPhone"
                    placeholder="Enter phone number"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="newRole">Role</Label>
                  <Select value={newUser.role} onValueChange={(value: "Admin" | "Doctor" | "Influencer" | "Customer") => setNewUser({...newUser, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Doctor">Doctor</SelectItem>
                      <SelectItem value="Influencer">Influencer</SelectItem>
                      <SelectItem value="Customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="newStatus">Status</Label>
                  <Select defaultValue="active">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="newDateOfBirth">Date of Birth</Label>
                  <Input
                    id="newDateOfBirth"
                    type="date"
                  />
                </div>
                <div>
                  <Label htmlFor="newVerified">Verified</Label>
                  <Select defaultValue="false">
                    <SelectTrigger>
                      <SelectValue placeholder="Select verification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Verified</SelectItem>
                      <SelectItem value="false">Not Verified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="newAddress">Address</Label>
                <Textarea
                  id="newAddress"
                  placeholder="Enter address"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="newBio">Bio</Label>
                <Textarea
                  id="newBio"
                  placeholder="Enter bio"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddModal(false)} disabled={modalLoading}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  // Add new user logic here
                  setModalLoading(true)
                  // TODO: Implement createUser logic with form data
                  setShowAddModal(false)
                  setModalLoading(false)
                }} 
                disabled={modalLoading}
              >
                {modalLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create User'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedUser?.firstName} {selectedUser?.lastName}? This action cannot be undone.
                {selectedUser?.role === 'Admin' && (
                  <span className="block mt-2 text-destructive font-medium">
                    Admin users cannot be deleted.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteUser} 
                disabled={isLoading || selectedUser?.role === 'Admin'}
              >
                {modalLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete User'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}

export default UsersPage