'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface StayDay {
  _id: string;
  hotel_name: string;
  hotel_description: string;
  hotel_images: string[];
  stay_type: string;
}

interface Stay {
  _id: string;
  days: StayDay[];
}

const StaysEditor = () => {
  const { id } = useParams() as { id: string };
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStays = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package_view/${id}`);
        setStays(response.data.data.stays || []);
      } catch (error) {
        console.error('Error fetching stays:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStays();
  }, [id]);

  const handleStayChange = (
    stayIndex: number,
    dayIndex: number,
    field: 'hotel_name' | 'hotel_description' | 'stay_type',
    value: string
  ) => {
    const updatedStays = [...stays];
    updatedStays[stayIndex].days[dayIndex][field] = value;
    setStays(updatedStays);
  };

  const addNewStay = () => {
    const timestamp = Date.now();
    setStays((prev) => [
      ...prev,
      {
        _id: `temp-${timestamp}`,
        days: [
          {
            _id: `temp-day-${timestamp}`,
            hotel_name: '',
            hotel_description: '',
            hotel_images: [],
            stay_type: 'standard',
          },
        ],
      },
    ]);
  };

  const addDayToStay = (stayIndex: number) => {
    const updatedStays = [...stays];
    updatedStays[stayIndex].days.push({
      _id: `temp-day-${Date.now()}`,
      hotel_name: '',
      hotel_description: '',
      hotel_images: [],
      stay_type: 'standard',
    });
    setStays(updatedStays);
  };

  const removeStay = (stayIndex: number) => {
    setStays((prev) => prev.filter((_, i) => i !== stayIndex));
  };

  const removeDayFromStay = (stayIndex: number, dayIndex: number) => {
    const updatedStays = [...stays];
    updatedStays[stayIndex].days.splice(dayIndex, 1);
    setStays(updatedStays);
  };

  const removeImageFromDay = (stayIndex: number, dayIndex: number, imgIndex: number) => {
    const updatedStays = [...stays];
    updatedStays[stayIndex].days[dayIndex].hotel_images.splice(imgIndex, 1);
    setStays(updatedStays);
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package_update/${id}/stays`, { stays });
      alert('Stays updated successfully!');
    } catch (error) {
      console.error('Error updating stays:', error);
      alert('Failed to update stays');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-600">Loading stays...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Edit Stays</h2>

      <button
        onClick={addNewStay}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Add New Stay Group
      </button>

      <div className="space-y-8">
        {stays.map((stay, stayIndex) => (
          <div key={stay._id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-700">Stay Group {stayIndex + 1}</h3>
              <button
                onClick={() => removeStay(stayIndex)}
                className="text-red-600 hover:underline text-sm"
              >
                Remove Group
              </button>
            </div>

            <button
              onClick={() => addDayToStay(stayIndex)}
              className="mb-4 text-blue-600 hover:underline text-sm"
            >
              + Add Day
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stay.days.map((day, dayIndex) => (
                <div key={day._id} className="border rounded-lg p-4 relative bg-gray-50">
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => removeDayFromStay(stayIndex, dayIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>

                  <label className="block text-sm font-medium text-gray-600 mb-1">Hotel Name</label>
                  <input
                    type="text"
                    value={day.hotel_name}
                    onChange={(e) =>
                      handleStayChange(stayIndex, dayIndex, 'hotel_name', e.target.value)
                    }
                    className="w-full border rounded px-3 py-2 mb-3"
                    placeholder="Hotel Name"
                  />

                  <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                  <textarea
                    value={day.hotel_description}
                    onChange={(e) =>
                      handleStayChange(stayIndex, dayIndex, 'hotel_description', e.target.value)
                    }
                    className="w-full border rounded px-3 py-2 mb-3"
                    placeholder="Hotel Description"
                  />

                  <label className="block text-sm font-medium text-gray-600 mb-1">Stay Type</label>
                  <select
                    value={day.stay_type}
                    onChange={(e) =>
                      handleStayChange(stayIndex, dayIndex, 'stay_type', e.target.value)
                    }
                    className="w-full border rounded px-3 py-2 mb-3"
                  >
                    <option value="standard">Standard</option>
                    <option value="luxury">Luxury</option>
                    <option value="resort">Resort</option>
                  </select>

                  <div className="grid grid-cols-2 gap-2">
                    {day.hotel_images.map((img, imgIndex) => (
                      <div key={imgIndex} className="relative">
                        <Image
                          src={img}
                          alt={`Hotel ${dayIndex + 1}`}
                          height={150}
                          width={200}
                          className="rounded object-cover"
                        />
                        <button
                          onClick={() => removeImageFromDay(stayIndex, dayIndex, imgIndex)}
                          className="absolute top-1 right-1 bg-white text-red-500 text-xs px-1 rounded"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {/* Image upload placeholder */}
                    <div className="border border-dashed border-gray-300 rounded p-4 text-center text-sm text-gray-500">
                      + Upload Image
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={saveChanges}
        disabled={saving}
        className="mt-8 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default StaysEditor;
