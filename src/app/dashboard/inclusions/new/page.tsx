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
        const response = await axios.get(`http://localhost:8000/api/package_view/${id}`);
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

  const saveChanges = async () => {
    setSaving(true);
    try {
      await axios.put(`http://localhost:8000/api/package_update/${id}/inclusions`, {
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

  return (
    <div className="editor-container">
      <h2>Edit Inclusions & Exclusions</h2>
      
      {inclusions.map((inclusion, inclusionIndex) => (
        <div key={inclusion._id} className="inclusion-group">
          <h3>Inclusion Group {inclusionIndex + 1}</h3>
          
          <div className="add-new-item">
            <select
              value={newItem.type}
              onChange={(e) => setNewItem({...newItem, type: e.target.value})}
              className="type-select"
            >
              <option value="inclusion">Inclusion</option>
              <option value="exclusion">Exclusion</option>
            </select>
            <input
              type="text"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              placeholder="Enter description"
              className="description-input"
            />
            <button 
              onClick={() => addNewItem(inclusionIndex)}
              className="add-btn"
            >
              Add Item
            </button>
          </div>

          <div className="items-list">
            {inclusion.types.map((item, itemIndex) => (
              <div key={item._id} className={`item-card ${item.type}`}>
                <div className="item-type">{item.type.toUpperCase()}</div>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleInclusionChange(inclusionIndex, itemIndex, 'description', e.target.value)}
                  className="item-description"
                />
                <button 
                  onClick={() => removeItem(inclusionIndex, itemIndex)} 
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button 
        onClick={saveChanges} 
        disabled={saving}
        className="save-btn"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default InclusionsEditor;