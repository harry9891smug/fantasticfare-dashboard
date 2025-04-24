'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

// Types
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
        const response = await axios.get(`https://backend.fantasticfare.com/api/package_view/${id}`);
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
      await axios.put(`https://backend.fantasticfare.com/api/package_update/${id}/stays`, { stays });
      alert('Stays updated successfully!');
    } catch (error) {
      console.error('Error updating stays:', error);
      alert('Failed to update stays');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading stays...</div>;

  return (
    <div className="editor-container">
      <h2>Edit Stays</h2>

      <button onClick={addNewStay} className="add-btn">
        Add New Stay Group
      </button>

      {stays.map((stay, stayIndex) => (
        <div key={stay._id} className="stay-group">
          <div className="group-header">
            <h3>Stay Group {stayIndex + 1}</h3>
            <button onClick={() => removeStay(stayIndex)} className="remove-btn">
              Remove Group
            </button>
          </div>

          <button onClick={() => addDayToStay(stayIndex)} className="add-day-btn">
            Add Day to This Stay
          </button>

          {stay.days.map((day, dayIndex) => (
            <div key={day._id} className="day-card">
              <input
                type="text"
                value={day.hotel_name}
                onChange={(e) =>
                  handleStayChange(stayIndex, dayIndex, 'hotel_name', e.target.value)
                }
                placeholder="Hotel Name"
                className="hotel-name"
              />

              <textarea
                value={day.hotel_description}
                onChange={(e) =>
                  handleStayChange(stayIndex, dayIndex, 'hotel_description', e.target.value)
                }
                placeholder="Hotel Description..."
                className="hotel-description"
              />

              <div className="hotel-images">
                {day.hotel_images.map((img, imgIndex) => (
                  <div key={imgIndex} className="image-preview">
                    <Image src={img} alt={`Hotel ${dayIndex + 1}`} height={200} width={300} />
                    <button
                      onClick={() => removeImageFromDay(stayIndex, dayIndex, imgIndex)}
                      className="remove-image-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {/* TODO: Add image upload component here */}
              </div>

              <select
                value={day.stay_type}
                onChange={(e) =>
                  handleStayChange(stayIndex, dayIndex, 'stay_type', e.target.value)
                }
                className="type-select"
              >
                <option value="standard">Standard</option>
                <option value="luxury">Luxury</option>
                <option value="resort">Resort</option>
              </select>

              <button
                onClick={() => removeDayFromStay(stayIndex, dayIndex)}
                className="remove-day-btn"
              >
                Remove This Day
              </button>
            </div>
          ))}
        </div>
      ))}

      <button onClick={saveChanges} disabled={saving} className="save-btn">
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default StaysEditor;
