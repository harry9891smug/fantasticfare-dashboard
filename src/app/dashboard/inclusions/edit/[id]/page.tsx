'use client';
import React from 'react'
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Inclusion {
  _id: string;
  types: {
    type: 'inclusion' | 'exclusion';
    description: string;
    _id: string;
  }[];
}


const InclusionsEditor = () => {
  const { id } = useParams();
  const [inclusions, setInclusions] = useState<Inclusion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newItem, setNewItem] = useState({
    type: 'inclusion',
    description: ''
  });

  useEffect(() => {
    const fetchInclusions = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package_view/${id}`);
        setInclusions(response.data.data.inclusion || []);
      } catch (error) {
        console.error('Error fetching inclusions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInclusions();
  }, [id]);

  const handleInclusionChange = (
    inclusionIndex: number,
    itemIndex: number,
    field: 'type' | 'description',
    value: string
  ) => {
    const updatedInclusions = [...inclusions];
  
    if (field === 'type' && (value === 'inclusion' || value === 'exclusion')) {
      updatedInclusions[inclusionIndex].types[itemIndex].type = value;
    } else if (field === 'description') {
      updatedInclusions[inclusionIndex].types[itemIndex].description = value;
    }
  
    setInclusions(updatedInclusions);
  };
  

  const addNewItem = (inclusionIndex:any) => {
    if (!newItem.description.trim()) return;
    
    const updatedInclusions = [...inclusions];
    updatedInclusions[inclusionIndex].types.push({
      type: newItem.type as 'inclusion' | 'exclusion',
      description: newItem.description,
      _id: `temp-${Date.now()}`
    });
    setInclusions(updatedInclusions);
    setNewItem({ type: 'inclusion', description: '' });
  };

  const removeItem = (inclusionIndex:any, itemIndex:any) => {
    const updatedInclusions = [...inclusions];
    updatedInclusions[inclusionIndex].types = 
      updatedInclusions[inclusionIndex].types.filter((_, i) => i !== itemIndex);
    setInclusions(updatedInclusions);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package_update/${id}/inclusions`, {
        inclusion: inclusions
      });
      alert('Inclusions/Exclusions updated successfully!');
    } catch (error) {
      console.error('Error updating inclusions:', error);
      alert('Failed to update inclusions');
    } finally {
      setSaving(false);
    }
  };
  if (loading) return <div>Loading inclusions...</div>;



  return (<div className="container-fluid">
    <div className="card">
      <div className="card-header">
        <h5>Create Inclusions & Exclusions</h5>
      </div>
      <div className="card-body">
        <form className="theme-form mega-form" onSubmit={handleSubmit}>
         

          {inclusions[0].types.map((item, index) => (
            <div key={index} className="mb-4 border p-3 rounded">
              <h6>Item {index + 1}</h6>
              <div className="row">
                <div className="col-sm-4">
                  <label className="form-label-title">Type*</label>
                  <select
                    className="form-control"
                    value={item.type}
                    // onChange={(e) => handleInclusionChange(index, 'type', e.target.value)}
                  >
                    <option value="inclusion">Inclusion</option>
                    <option value="exclusion">Exclusion</option>
                  </select>
                </div>
                <div className="col-sm-8">
                  <label className="form-label-title">Description*</label>
                  <input
                    className="form-control"
                    type="text"
                    value={item.description}
                    // onChange={(e) => handleChange(index, 'description', e.target.value)}
                    required
                  />
                </div>
              </div>
              {/* {items.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() => handleRemoveItem(index)}
                >
                  Remove Item
                </button>
              )} */}
            </div>
          ))}

          {/* <button
            type="button"
            className="btn btn-outline-primary mb-3"
            onClick={handleAddItem}
          >
            Add Another Item
          </button> */}

          <div className="card-footer text-end">
            <button type="submit" className="btn btn-primary me-3">Submit</button>
            <button
              type="button"
              className="btn btn-outline-primary"
              // onClick={() => router.push('/dashboard/packages')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)
};

export default InclusionsEditor;