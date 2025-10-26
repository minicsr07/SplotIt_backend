"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { apiCall } from "@/lib/api-client"

const CATEGORIES = ["Train", "Road", "Sanitation", "Lighting", "Water", "Traffic", "Other"]

export default function ReportForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Road",
    address: "",
    email: "",
    phone: "",
    trainNumber: "",
  })
  const [photos, setPhotos] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [complaintId, setComplaintId] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const photoUrls = photos.map((photo) => URL.createObjectURL(photo))

      const data = await apiCall("/issues", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          photos: photoUrls,
          location: { address: formData.address },
        }),
      })

      if (data.complaintId) {
        setComplaintId(data.complaintId)
        setSuccess(true)
        setFormData({
          title: "",
          description: "",
          category: "Road",
          address: "",
          email: "",
          phone: "",
          trainNumber: "",
        })
        setPhotos([])
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="card bg-success/5 border-success text-center py-12">
        <h2 className="text-2xl font-bold text-success mb-4">Issue Reported Successfully!</h2>
        <p className="text-muted-foreground mb-4">Your complaint ID is:</p>
        <p className="text-3xl font-bold text-primary mb-6">{complaintId}</p>
        <p className="text-muted-foreground mb-6">Save this ID to track your complaint status</p>
        <Button onClick={() => setSuccess(false)} className="btn-primary">
          Report Another Issue
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Brief title of the issue"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
          <select name="category" value={formData.category} onChange={handleInputChange} className="input-field">
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Detailed description of the issue"
          rows={4}
          className="input-field"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Location Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Street address or landmark"
            className="input-field"
            required
          />
        </div>

        {formData.category === "Train" && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Train Number</label>
            <input
              type="text"
              name="trainNumber"
              value={formData.trainNumber}
              onChange={handleInputChange}
              placeholder="e.g., 12345"
              className="input-field"
            />
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your@email.com"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+91 XXXXX XXXXX"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Upload Photos</label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload" className="cursor-pointer">
            <span className="text-4xl mb-2 block">📤</span>
            <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
          </label>
        </div>
        {photos.length > 0 && <p className="text-sm text-success mt-2">{photos.length} photo(s) selected</p>}
      </div>

      <Button type="submit" disabled={loading} className="w-full btn-primary">
        {loading ? "Submitting..." : "Submit Report"}
      </Button>
    </form>
  )
}
