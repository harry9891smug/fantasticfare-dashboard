'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios , { AxiosError }from 'axios';
type Activity = {
  day_name: string;
  day_activity: string;
  activity_type: 'solo' | 'family' | 'couple';
  day_images: File[];
};

export default function NewActivity() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [error, setError] = useState('')
  const [activities, setActivities] = useState<Activity[]>([{
    day_name: '',
    day_activity: '',
    activity_type: 'solo',
    day_images: []
  }]);

  const handleAddActivity = () => {
    setActivities([...activities, {
      day_name: '',
      day_activity: '',
      activity_type: 'solo',
      day_images: []
    }]);
  };

  const handleRemoveActivity = (index: number) => {
    if (activities.length > 1) {
      setActivities(activities.filter((_, i) => i !== index));
    }
  };

  const handleActivityChange = (index: number, field: keyof Activity, value: string) => {
    const updated = [...activities];
    
    if (field === 'activity_type') {
      if (value === 'solo' || value === 'family' || value === 'couple') {
        updated[index].activity_type = value;
      } else {
        console.warn('Invalid activity type:', value);
        return;
      }
    } else if (field === 'day_name' || field === 'day_activity') {
      updated[index][field] = value;
    }

    setActivities(updated);
  };

  const handleFileChange = (index: number, files: FileList | null) => {
    if (!files) return;
    const updated = [...activities];
    updated[index].day_images = Array.from(files);
    setActivities(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const formData = new FormData();
    let hasError = false;

    activities.forEach((activity, index) => {
      if (!activity.day_name) {
        console.error(`Activity ${index + 1}: day_name is empty`);
        hasError = true;
      }
      if (!activity.day_activity) {
        console.error(`Activity ${index + 1}: day_activity is empty`);
        hasError = true;
      }
      if (!activity.activity_type) {
        console.error(`Activity ${index + 1}: activity_type is empty`);
        hasError = true;
      }
    });

    if (!id) {
      console.error('package_id is missing');
      hasError = true;
    }

    if (hasError) {
      alert('Please fill all required fields');
      return;
    }

    formData.append('package_id', id);
    activities.forEach((activity, index) => {
      formData.append(`day_name[${index}]`, activity.day_name);
      formData.append(`day_activity[${index}]`, activity.day_activity);
      formData.append(`activity_type[${index}]`, activity.activity_type);
      activity.day_images.forEach(file => {
        formData.append(`day_images[${index}][]`, file);
      });
    });

    try {
      await axios.post('https://backend.fantasticfare.com/api/activity-create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Activity created successfully!');
      router.push(`/dashboard/stays/${id}`);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save Activities')
    }
  };

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header">
          <h5>Create Activities</h5>
        </div>
        <div className="card-body">
          <form className="theme-form mega-form" onSubmit={handleSubmit}>
            {activities.map((activity, index) => (
              <div key={index} className="mb-4 border p-3 rounded">
                <h6>Activity {index + 1}</h6>
                <div className="row">
                  <div className="col-sm-4">
                    <label className="form-label-title">Day Name*</label>
                    <input
                      className="form-control"
                      type="text"
                      value={activity.day_name}
                      onChange={(e) => handleActivityChange(index, 'day_name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-sm-4">
                    <label className="form-label-title">Activity Type*</label>
                    <select
                      className="form-control"
                      value={activity.activity_type}
                      onChange={(e) => handleActivityChange(index, 'activity_type', e.target.value)}
                    >
                      <option value="solo">Solo</option>
                      <option value="family">Family</option>
                      <option value="couple">Couple</option>
                    </select>
                  </div>
                  <div className="col-sm-4">
                    <label className="form-label-title">Images</label>
                    <input
                      className="form-control"
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(index, e.target.files)}
                      accept="image/*"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="form-label-title">Activity Description*</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={activity.day_activity}
                    onChange={(e) => handleActivityChange(index, 'day_activity', e.target.value)}
                    required
                  />
                </div>
                {activities.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => handleRemoveActivity(index)}
                  >
                    Remove Activity
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline-primary mb-3"
              onClick={handleAddActivity}
            >
              Add Another Activity
            </button>

            <div className="card-footer text-end">
              <button type="submit" className="btn btn-primary me-3">Submit</button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => router.push('/dashboard/packages')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}