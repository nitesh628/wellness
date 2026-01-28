'use client'

import React from 'react'
import { ShoppingBag, DollarSign, TrendingUp, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface UserStats {
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  favoriteCategory: string
  lastOrderDate: string
}

interface StatsCardsProps {
  stats: UserStats
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-blue-900">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-green-50 to-green-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Spent</p>
              <p className="text-3xl font-bold text-green-900">₹{stats.totalSpent.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Avg Order Value</p>
              <p className="text-3xl font-bold text-purple-900">₹{stats.averageOrderValue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-orange-50 to-orange-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Favorite Category</p>
              <p className="text-2xl font-bold text-orange-900">{stats.favoriteCategory}</p>
            </div>
            <div className="p-3 bg-orange-500 rounded-full">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatsCards
