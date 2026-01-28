"use client"
import React, { useState } from 'react'
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Redux Imports
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { createLead, selectLeadsLoading } from "@/lib/redux/features/leadSlice";

const Contact = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectLeadsLoading);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data object matching your Lead interface
    const newLeadData = {
      ...formData,
      status: "New", // Default status for web inquiries
      priority: "Medium", // Default priority
      source: "Website Contact Form",
      estimatedValue: 0,
    };

    try {
      // Dispatch the createLead action
      const success = await dispatch(createLead(newLeadData));

      if (success) {
        alert("Message sent successfully! Our team will contact you soon.");
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "General Inquiry",
          message: "",
        });
      } else {
        alert("Failed to send message. Please try again later.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-white">
          <div className="relative min-h-[220px] sm:min-h-[280px] lg:min-h-[320px]">
            <Image
              src="https://www.nutra-zen.com/cdn/shop/files/dwsk.png?v=1731306219&width=2000"
              alt="Contact banner"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
      <section className="pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="max-w-xl">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-blue-900">
                Do you have any
                <br />
                question?
              </h3>
              <p className="mt-3 text-sm text-slate-600">Please contact us at</p>

              <div className="mt-6 text-sm text-slate-700 leading-relaxed">
                <div className="font-semibold">Wellness Nutraceuticals Private Limited</div>
                <div>Wellness | Home-1, Block A1, Tiril,</div>
                <div>Vipul World, Sohna Road,</div>
                <div>Near GD Goenka Public School, Sector 48, Gurugram,</div>
                <div>Haryana, 122018, India</div>
              </div>

              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <span className="font-semibold">Contact Us:</span> info@nutra-zen.com
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <span className="font-semibold">Phone:</span> 011-408-48448
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <span className="font-semibold">Location:</span> Gurugram, India
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Name"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="E-mail"
                  />
                </div>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Phone"
                />

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Message"
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Send message
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact