"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link'
import { useParams } from 'next/navigation';
 import '../../../css/edits.css';

 interface Package {
  package_name: string;
  // Add other fields as needed
}

const PackageEditOptions = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`https://backend.fantasticfare.com/api/package_view/${id}`);
        setPackageData(response.data.data);
      } catch (error) {
        console.error('Error fetching package:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  if (loading) return <div>Loading package details...</div>;
  if (!packageData) return <div>Package not found</div>;

  return (
    <div className="edit-options">
      <h2>Edit Package: {packageData.package_name}</h2>
      
      <div className="options-list">
        <div className="option-card">
          <h3>Basic Information</h3>
          <p>Edit package name, description, pricing, etc.</p>
          <Link href={`/dashboard/packages/update/${id}`} className="edit-btn">
            Edit
          </Link>
        </div>

        <div className="option-card">
          <h3>Itinerary</h3>
          <p>Edit day-by-day itinerary details</p>
          <Link href={`/dashboard/itenary/edit/${id}`} className="edit-btn">
            Edit
          </Link>
        </div>

        <div className="option-card">
          <h3>Stays</h3>
          <p>Edit hotel and accommodation details</p>
          <Link href={`/dashboard/stays/edit/${id}`} className="edit-btn">
            Edit
          </Link>
        </div>

        <div className="option-card">
          <h3>Activities</h3>
          <p>Edit activities included in the package</p>
          <Link href={`/dashboard/activities/edit/${id}`} className="edit-btn">
            Edit
          </Link>
        </div>

        <div className="option-card">
          <h3>Inclusions/Exclusions</h3>
          <p>Edit {`what's`} included and excluded</p>
          <Link href={`/dashboard/inclusions/edit/${id}`} className="edit-btn">
            Edit
          </Link>
        </div>

        <div className="option-card">
          <h3>Addons</h3>
          <p>Edit additional services or upgrades</p>
          <Link href={`/dashboard/addons/update/${id}`} className="edit-btn">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageEditOptions;