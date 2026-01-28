'use client'

import React, { useState } from 'react'
import { 
  Copy,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Gift,
  Download,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// Types
interface ReferralCode {
  id: number
  code: string
  name: string
  description: string
  type: 'percentage' | 'fixed' | 'product'
  value: number
  maxUses: number | null
  currentUses: number
  status: 'active' | 'inactive' | 'expired'
  validFrom: string
  validUntil: string | null
  createdAt: string
  updatedAt: string
  createdBy: string
  totalEarnings: number
  lastUsed: string | null
}

interface ReferralUsage {
  id: number
  referralCode: string
  referredUser: string
  referredUserEmail: string
  referredUserPhone: string
  rewardAmount: number
  status: 'pending' | 'completed' | 'cancelled'
  usedAt: string
  completedAt: string | null
  notes: string
}

const dummyReferralUsage: ReferralUsage[] = [
  {
    id: 1,
    referralCode: "WELCOME20",
    referredUser: "John Doe",
    referredUserEmail: "john.doe@email.com",
    referredUserPhone: "+91 98765 43210",
    rewardAmount: 200,
    status: "completed",
    usedAt: "2024-03-15",
    completedAt: "2024-03-15",
    notes: "Successful referral"
  },
  {
    id: 2,
    referralCode: "FRIEND50",
    referredUser: "Sarah Wilson",
    referredUserEmail: "sarah.wilson@email.com",
    referredUserPhone: "+91 87654 32109",
    rewardAmount: 50,
    status: "completed",
    usedAt: "2024-03-10",
    completedAt: "2024-03-10",
    notes: "Friend referral"
  },
  {
    id: 3,
    referralCode: "SUMMER15",
    referredUser: "Mike Johnson",
    referredUserEmail: "mike.johnson@email.com",
    referredUserPhone: "+91 76543 21098",
    rewardAmount: 150,
    status: "pending",
    usedAt: "2024-03-12",
    completedAt: null,
    notes: "Awaiting order completion"
  },
  {
    id: 4,
    referralCode: "WELCOME20",
    referredUser: "Emily Davis",
    referredUserEmail: "emily.davis@email.com",
    referredUserPhone: "+91 65432 10987",
    rewardAmount: 180,
    status: "completed",
    usedAt: "2024-03-08",
    completedAt: "2024-03-08",
    notes: "New customer referral"
  },
  {
    id: 5,
    referralCode: "FIRST25",
    referredUser: "David Brown",
    referredUserEmail: "david.brown@email.com",
    referredUserPhone: "+91 54321 09876",
    rewardAmount: 250,
    status: "cancelled",
    usedAt: "2024-03-05",
    completedAt: null,
    notes: "Order cancelled by customer"
  }
]


const ReferralsPage = () => {
  const [referralUsage] = useState(dummyReferralUsage)
  const [showUsageModal, setShowUsageModal] = useState(false)
  const [selectedReferral] = useState<ReferralCode | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getUsageStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'pending': return 'warning'
      case 'cancelled': return 'outline'
      default: return 'secondary'
    }
  }

  const getReferralUsage = (code: string) => {
    return referralUsage.filter(usage => usage.referralCode === code)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Referral Code</h1>
            <p className="text-muted-foreground">Track your referral code performance and earnings</p>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export referral data</p>
              </TooltipContent>
            </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
              </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Refresh data</p>
            </TooltipContent>
          </Tooltip>
          </div>
        </div>

        {/* My Referral Code Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Code</CardTitle>
            <CardDescription>Share this code with others to earn commission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-6 bg-primary/5 rounded-lg border-2 border-dashed border-primary/20">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Your unique referral code:</p>
                <p className="text-3xl font-bold font-mono text-primary">WELCOME20</p>
                <p className="text-sm text-muted-foreground mt-2">Earn ₹200 for each successful referral</p>
              </div>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => copyToClipboard('WELCOME20')}
                      className="gap-2"
                      size="lg"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy your referral code</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Referrals</p>
                  <p className="text-2xl font-bold text-foreground">{referralUsage.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {referralUsage.filter(u => u.status === 'completed').length} completed
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Commission</p>
                  <p className="text-2xl font-bold text-foreground">₹{referralUsage.reduce((sum, u) => sum + u.rewardAmount, 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This month: ₹{Math.floor(referralUsage.reduce((sum, u) => sum + u.rewardAmount, 0) * 0.3).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold text-foreground">
                    {referralUsage.length > 0 ? Math.round((referralUsage.filter(u => u.status === 'completed').length / referralUsage.length) * 100) : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {referralUsage.filter(u => u.status === 'pending').length} pending
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Commission</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{referralUsage.length > 0 ? Math.round(referralUsage.reduce((sum, u) => sum + u.rewardAmount, 0) / referralUsage.length) : 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Per successful referral
                  </p>
                </div>
                <Gift className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Referral Usage Table */}
        <Card>
          <CardHeader>
            <CardTitle>Referral Usage History</CardTitle>
            <CardDescription>Track all users who used your referral code and their commission details</CardDescription>
                </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Details</TableHead>
                  <TableHead>Commission Earned</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Used Date</TableHead>
                  <TableHead>Completed Date</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referralUsage.map(usage => (
                  <TableRow key={usage.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{usage.referredUser}</p>
                        <p className="text-sm text-muted-foreground">{usage.referredUserEmail}</p>
                        <p className="text-sm text-muted-foreground">{usage.referredUserPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-green-600">₹{usage.rewardAmount}</TableCell>
                    <TableCell>
                      <Badge variant={getUsageStatusColor(usage.status) as 'default' | 'secondary' | 'outline'}>
                        {usage.status.charAt(0).toUpperCase() + usage.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(usage.usedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {usage.completedAt ? new Date(usage.completedAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{usage.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {referralUsage.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No referral usage found yet.</p>
              </div>
            )}
            </CardContent>
          </Card>

        {/* Usage Modal */}
        <Dialog open={showUsageModal} onOpenChange={setShowUsageModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Referral Code Usage - {selectedReferral?.code}</DialogTitle>
              <DialogDescription>
                View all usage details for the referral code &quot;{selectedReferral?.name}&quot;.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Usage Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                <div>
                        <p className="text-sm text-muted-foreground">Total Uses</p>
                        <p className="text-2xl font-bold">{selectedReferral?.currentUses || 0}</p>
                </div>
                      <Users className="w-8 h-8 text-blue-600" />
                </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                <div>
                        <p className="text-sm text-muted-foreground">Total Earnings</p>
                        <p className="text-2xl font-bold text-green-600">₹{selectedReferral?.totalEarnings || 0}</p>
                </div>
                      <DollarSign className="w-8 h-8 text-green-600" />
              </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                <div>
                        <p className="text-sm text-muted-foreground">Last Used</p>
                        <p className="text-sm font-medium">
                          {selectedReferral?.lastUsed ? new Date(selectedReferral.lastUsed).toLocaleDateString() : 'Never'}
                        </p>
                </div>
                      <Calendar className="w-8 h-8 text-purple-600" />
                </div>
                  </CardContent>
                </Card>
              </div>

              {/* Usage Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Usage History</CardTitle>
                  <CardDescription>Detailed history of all uses of this referral code</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Reward Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Used At</TableHead>
                        <TableHead>Completed At</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getReferralUsage(selectedReferral?.code || '').map(usage => (
                        <TableRow key={usage.id}>
                          <TableCell className="font-medium">{usage.referredUser}</TableCell>
                          <TableCell>{usage.referredUserEmail}</TableCell>
                          <TableCell>{usage.referredUserPhone}</TableCell>
                          <TableCell className="font-medium">₹{usage.rewardAmount}</TableCell>
                          <TableCell>
                            <Badge variant={getUsageStatusColor(usage.status) as 'default' | 'secondary' | 'destructive' | 'outline'}>
                              {usage.status.charAt(0).toUpperCase() + usage.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(usage.usedAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {usage.completedAt ? new Date(usage.completedAt).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{usage.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {getReferralUsage(selectedReferral?.code || '').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No usage history found for this referral code.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUsageModal(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
                </div>
    </TooltipProvider>
  )
}

export default ReferralsPage