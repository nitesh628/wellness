"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "@/components/profile/ProfileHeader";
import StatsCards from "@/components/profile/StatsCards";
import OverviewTab from "@/components/profile/OverviewTab";
import OrdersTab from "@/components/profile/OrdersTab";
import AddressTab from "@/components/profile/AddressTab";
import AppointmentsTab from "@/components/profile/AppointmentsTab";
import PrescriptionsTab from "@/components/profile/PrescriptionsTab";
import SecuritySettings from "@/components/profile/SettingsTab";
import ProfileDialogs from "@/components/profile/ProfileDialogs";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  selectUser,
  updateProfile,
  User,
} from "@/lib/redux/features/authSlice";

interface Appointment {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  date: string;
  time: string;
  type: "in-person" | "video" | "phone";
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "rescheduled";
  location?: string;
  notes?: string;
  duration: number;
  price: number;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
}

interface Prescription {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  status: "active" | "completed" | "expired" | "cancelled";
  medications: Medication[];
  notes?: string;
  followUpDate?: string;
  totalCost: number;
}

const dummyAppointments: Appointment[] = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    doctorSpecialty: "Cardiologist",
    doctorImage: "",
    date: "2024-03-25",
    time: "10:00",
    type: "in-person",
    status: "scheduled",
    location: "Apollo Hospital, Mumbai",
    notes: "Regular checkup",
    duration: 30,
    price: 1500,
  },
  {
    id: "2",
    doctorName: "Dr. Michael Chen",
    doctorSpecialty: "Dermatologist",
    doctorImage: "",
    date: "2024-03-20",
    time: "14:30",
    type: "video",
    status: "completed",
    location: "",
    notes: "Skin consultation",
    duration: 20,
    price: 800,
  },
];

const dummyPrescriptions: Prescription[] = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    doctorSpecialty: "Cardiologist",
    date: "2024-03-15",
    status: "active",
    medications: [
      {
        id: "1",
        name: "Atorvastatin",
        dosage: "20mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take with food",
        quantity: 30,
      },
      {
        id: "2",
        name: "Metoprolol",
        dosage: "50mg",
        frequency: "Twice daily",
        duration: "30 days",
        instructions: "Take with water",
        quantity: 60,
      },
    ],
    notes: "Continue medication as prescribed",
    followUpDate: "2024-04-15",
    totalCost: 1200,
  },
];

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);

  const [appointments, setAppointments] =
    useState<Appointment[]>(dummyAppointments);
  const [prescriptions, setPrescriptions] =
    useState<Prescription[]>(dummyPrescriptions);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Local state for editing profile data
  const [editingProfile, setEditingProfile] = useState<User | null>(null);

  const handleSaveProfile = async () => {
    if (!currentUser?._id || !editingProfile) return;

    try {
      // Extract first and last name from editingProfile
      const firstName = editingProfile.firstName || currentUser.firstName;
      const lastName = editingProfile.lastName || currentUser.lastName;

      const updateData = {
        firstName: firstName,
        lastName: lastName,
        phone: editingProfile.phone,
        bio: editingProfile.occupation, // Using occupation field for bio
        imageUrl: editingProfile.imageUrl,
        dateOfBirth: editingProfile.dateOfBirth,
      };

      const success = await dispatch(
        updateProfile(currentUser._id, updateData),
      );

      if (success) {
        setIsEditing(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Profile will automatically reset to current user data
  };

  const handleAvatarChange = (file: File) => {
    // Handle avatar upload logic
    // Here you would typically upload the file to your server
    // and update the profile.avatar with the new URL
    // For now, we'll just log it
  };

  const handleTwoFactorAuth = () => {};

  const handleLoginHistory = () => {};

  const handleChangePassword = () => {
    setShowChangePassword(false);
  };

  const handlePaymentMethods = () => {};

  const handleDownloadData = () => {};

  const handleDeleteAccount = () => {
    setShowDeleteAccount(false);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <ProfileHeader
          profile={editingProfile || (currentUser as User)}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSaveProfile}
          onCancel={handleCancelEdit}
          onAvatarChange={handleAvatarChange}
          showEditButton={activeTab === "overview"}
          currentUser={currentUser as User}
        />

        {/* Stats Cards */}
        <StatsCards
          stats={{
            totalOrders: 0,
            totalSpent: 0,
            averageOrderValue: 0,
            favoriteCategory: "Health & Wellness",
            lastOrderDate: "No orders yet",
          }}
        />

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex justify-center">
            <TabsList className="inline-flex bg-white dark:bg-slate-800/90 shadow-xl shadow-blue-500/10 border border-blue-200/50 dark:border-blue-700/30 rounded-xl p-1 overflow-x-auto">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg px-4 py-2 whitespace-nowrap transition-all"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg px-4 py-2 whitespace-nowrap transition-all"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg px-4 py-2 whitespace-nowrap transition-all"
              >
                Addresses
              </TabsTrigger>
              <TabsTrigger
                value="appointments"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg px-4 py-2 whitespace-nowrap transition-all"
              >
                Appointments
              </TabsTrigger>
              <TabsTrigger
                value="prescriptions"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg px-4 py-2 whitespace-nowrap transition-all"
              >
                Prescriptions
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg px-4 py-2 whitespace-nowrap transition-all"
              >
                Security
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <OverviewTab
              profile={editingProfile || (currentUser as User)}
              isEditing={isEditing}
              onProfileChange={(profile) => setEditingProfile(profile)}
              currentUser={currentUser as User}
            />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <OrdersTab />
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <AddressTab />
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <AppointmentsTab
              appointments={appointments}
              onAppointmentChange={setAppointments}
            />
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="space-y-6">
            <PrescriptionsTab
              prescriptions={prescriptions}
              onPrescriptionChange={setPrescriptions}
            />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <SecuritySettings
              onChangePassword={() => setShowChangePassword(true)}
              onPaymentMethods={handlePaymentMethods}
              onDownloadData={handleDownloadData}
              onDeleteAccount={() => setShowDeleteAccount(true)}
              onTwoFactorAuth={handleTwoFactorAuth}
              onLoginHistory={handleLoginHistory}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <ProfileDialogs
        showChangePassword={showChangePassword}
        showDeleteAccount={showDeleteAccount}
        onCloseChangePassword={() => setShowChangePassword(false)}
        onCloseDeleteAccount={() => setShowDeleteAccount(false)}
        onChangePassword={handleChangePassword}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
};

export default UserProfile;
