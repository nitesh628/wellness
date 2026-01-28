'use client'

import React, { useState } from 'react'
import { 
  Save,
  Edit,
  Loader2,
  Camera,
  Plus,
  X,
  Languages
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Influencer Settings Page Component
const InfluencerSettingsPage = () => {
  const [editStates, setEditStates] = useState({
    profile: false,
    business: false,
    security: false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [originalData, setOriginalData] = useState({
    profile: {
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@influencer.com',
      phone: '+1 (555) 123-4567',
      niche: 'Fashion & Lifestyle',
      followers: 125000,
      engagement: 4.2,
      platform: 'Instagram',
      location: 'Los Angeles, CA',
      bio: 'Fashion enthusiast and lifestyle influencer with 125K+ followers. Sharing daily style tips and wellness content.',
      avatar: '/avatars/influencer-1.jpg',
      languages: ['English', 'Spanish'],
      collaborationRate: 500,
      sponsoredPostRate: 800
    },
    business: {
      brandName: 'Emma Rodriguez Brand',
      businessAddress: '456 Fashion District, Los Angeles, CA 90210',
      businessPhone: '+1 (555) 987-6543',
      businessEmail: 'business@emmarodriguez.com',
      website: 'www.emmarodriguez.com',
      taxId: '12-3456789',
      businessType: 'Individual Influencer',
      socialMedia: {
        instagram: '@emmarodriguez',
        tiktok: '@emmarodriguez',
        youtube: 'Emma Rodriguez',
        twitter: '@emmarodriguez'
      },
      contentSchedule: {
        monday: { posts: 2, stories: 5, reels: 1 },
        tuesday: { posts: 1, stories: 3, reels: 2 },
        wednesday: { posts: 2, stories: 4, reels: 1 },
        thursday: { posts: 1, stories: 3, reels: 1 },
        friday: { posts: 2, stories: 5, reels: 2 },
        saturday: { posts: 1, stories: 2, reels: 1 },
        sunday: { posts: 1, stories: 2, reels: 0 }
      },
      averagePostTime: 2,
      maxCollaborationsPerMonth: 8,
      brandPartnerships: true
    },
    security: {
      twoFactorAuth: true,
      loginAlerts: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      ipWhitelist: ['192.168.1.100', '10.0.0.50'],
      auditLogs: true,
      dataEncryption: true,
      backupFrequency: 'daily'
    }
  })

  const [formData, setFormData] = useState(originalData)

  const handleEdit = (section: string) => {
    setEditStates(prev => ({ ...prev, [section]: true }))
  }

  const handleCancel = (section: string) => {
    setEditStates(prev => ({ ...prev, [section]: false }))
    setFormData(prev => ({ ...prev, [section]: originalData[section as keyof typeof originalData] }))
  }

  const handleSave = async (section: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setOriginalData(prev => ({ ...prev, [section]: formData[section as keyof typeof formData] }))
    setEditStates(prev => ({ ...prev, [section]: false }))
    setIsLoading(false)
  }

  const handleInputChange = (section: string, field: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleNestedInputChange = (section: string, parentField: string, childField: string, value: string | number | boolean | object) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [parentField]: {
          ...(prev[section as keyof typeof prev] as Record<string, unknown>)[parentField] as Record<string, unknown>,
          [childField]: value
        }
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, business settings, and influencer preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal and professional information
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {editStates.profile ? (
                    <>
                      <Button variant="outline" onClick={() => handleCancel('profile')}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={() => handleSave('profile')} disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleEdit('profile')}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={formData.profile.avatar} alt={formData.profile.name} />
                  <AvatarFallback className="text-2xl">
                    {formData.profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.profile.name}
                    onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
                    disabled={!editStates.profile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.profile.email}
                    onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                    disabled={!editStates.profile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.profile.phone}
                    onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                    disabled={!editStates.profile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="niche">Niche</Label>
                  <Select
                    value={formData.profile.niche}
                    onValueChange={(value) => handleInputChange('profile', 'niche', value)}
                    disabled={!editStates.profile}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fashion & Lifestyle">Fashion & Lifestyle</SelectItem>
                      <SelectItem value="Beauty & Skincare">Beauty & Skincare</SelectItem>
                      <SelectItem value="Fitness & Wellness">Fitness & Wellness</SelectItem>
                      <SelectItem value="Food & Cooking">Food & Cooking</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Gaming">Gaming</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followers">Followers Count</Label>
                  <Input
                    id="followers"
                    type="number"
                    value={formData.profile.followers}
                    onChange={(e) => handleInputChange('profile', 'followers', parseInt(e.target.value))}
                    disabled={!editStates.profile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="engagement">Engagement Rate (%)</Label>
                  <Input
                    id="engagement"
                    type="number"
                    step="0.1"
                    value={formData.profile.engagement}
                    onChange={(e) => handleInputChange('profile', 'engagement', parseFloat(e.target.value))}
                    disabled={!editStates.profile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform">Primary Platform</Label>
                  <Select
                    value={formData.profile.platform}
                    onValueChange={(value) => handleInputChange('profile', 'platform', value)}
                    disabled={!editStates.profile}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="TikTok">TikTok</SelectItem>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                      <SelectItem value="Twitter">Twitter</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.profile.location}
                    onChange={(e) => handleInputChange('profile', 'location', e.target.value)}
                    disabled={!editStates.profile}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.profile.bio}
                  onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
                  disabled={!editStates.profile}
                  rows={4}
                />
              </div>

              {/* Languages */}
              <div className="space-y-2">
                <Label>Languages Spoken</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.profile.languages.map((language, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Languages className="w-3 h-3" />
                      {language}
                      {editStates.profile && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => {
                            const newLanguages = formData.profile.languages.filter((_, i) => i !== index)
                            handleInputChange('profile', 'languages', newLanguages)
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </Badge>
                  ))}
                  {editStates.profile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newLanguage = prompt('Enter language:')
                        if (newLanguage) {
                          handleInputChange('profile', 'languages', [...formData.profile.languages, newLanguage])
                        }
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Language
                    </Button>
                  )}
                </div>
              </div>

              {/* Collaboration Rates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="collaborationRate">Collaboration Rate ($)</Label>
                  <Input
                    id="collaborationRate"
                    type="number"
                    value={formData.profile.collaborationRate}
                    onChange={(e) => handleInputChange('profile', 'collaborationRate', parseInt(e.target.value))}
                    disabled={!editStates.profile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sponsoredPostRate">Sponsored Post Rate ($)</Label>
                  <Input
                    id="sponsoredPostRate"
                    type="number"
                    value={formData.profile.sponsoredPostRate}
                    onChange={(e) => handleInputChange('profile', 'sponsoredPostRate', parseInt(e.target.value))}
                    disabled={!editStates.profile}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>
                    Manage your brand and business details
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {editStates.business ? (
                    <>
                      <Button variant="outline" onClick={() => handleCancel('business')}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={() => handleSave('business')} disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleEdit('business')}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Business
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand Name</Label>
                  <Input
                    id="brandName"
                    value={formData.business.brandName}
                    onChange={(e) => handleInputChange('business', 'brandName', e.target.value)}
                    disabled={!editStates.business}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select
                    value={formData.business.businessType}
                    onValueChange={(value) => handleInputChange('business', 'businessType', value)}
                    disabled={!editStates.business}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual Influencer">Individual Influencer</SelectItem>
                      <SelectItem value="Influencer Agency">Influencer Agency</SelectItem>
                      <SelectItem value="Content Creator">Content Creator</SelectItem>
                      <SelectItem value="Brand Ambassador">Brand Ambassador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    value={formData.business.businessPhone}
                    onChange={(e) => handleInputChange('business', 'businessPhone', e.target.value)}
                    disabled={!editStates.business}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={formData.business.businessEmail}
                    onChange={(e) => handleInputChange('business', 'businessEmail', e.target.value)}
                    disabled={!editStates.business}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.business.website}
                    onChange={(e) => handleInputChange('business', 'website', e.target.value)}
                    disabled={!editStates.business}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={formData.business.taxId}
                    onChange={(e) => handleInputChange('business', 'taxId', e.target.value)}
                    disabled={!editStates.business}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea
                  id="businessAddress"
                  value={formData.business.businessAddress}
                  onChange={(e) => handleInputChange('business', 'businessAddress', e.target.value)}
                  disabled={!editStates.business}
                  rows={3}
                />
              </div>

              {/* Social Media Handles */}
              <div className="space-y-4">
                <Label>Social Media Handles</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData.business.socialMedia).map(([platform, handle]) => (
                    <div key={platform} className="space-y-2">
                      <Label htmlFor={platform} className="capitalize">{platform}</Label>
                      <Input
                        id={platform}
                        value={handle}
                        onChange={(e) => 
                          handleNestedInputChange('business', 'socialMedia', platform, e.target.value)
                        }
                        disabled={!editStates.business}
                        placeholder={`@${platform}handle`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="averagePostTime">Average Post Time (hours)</Label>
                  <Input
                    id="averagePostTime"
                    type="number"
                    value={formData.business.averagePostTime}
                    onChange={(e) => handleInputChange('business', 'averagePostTime', parseInt(e.target.value))}
                    disabled={!editStates.business}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxCollaborationsPerMonth">Max Collaborations Per Month</Label>
                  <Input
                    id="maxCollaborationsPerMonth"
                    type="number"
                    value={formData.business.maxCollaborationsPerMonth}
                    onChange={(e) => handleInputChange('business', 'maxCollaborationsPerMonth', parseInt(e.target.value))}
                    disabled={!editStates.business}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Brand Partnerships</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.business.brandPartnerships}
                      onCheckedChange={(checked) => handleInputChange('business', 'brandPartnerships', checked)}
                      disabled={!editStates.business}
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.business.brandPartnerships ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and privacy settings
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {editStates.security ? (
                    <>
                      <Button variant="outline" onClick={() => handleCancel('security')}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={() => handleSave('security')} disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleEdit('security')}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Security
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={formData.security.twoFactorAuth}
                    onCheckedChange={(checked) => handleInputChange('security', 'twoFactorAuth', checked)}
                    disabled={!editStates.security}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone logs into your account
                    </p>
                  </div>
                  <Switch
                    checked={formData.security.loginAlerts}
                    onCheckedChange={(checked) => handleInputChange('security', 'loginAlerts', checked)}
                    disabled={!editStates.security}
                  />
                </div>

                </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}

export default InfluencerSettingsPage
                