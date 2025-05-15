'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'
import FlightRule from '../../components/Rules/FlightRule';
import HotelRule from '../../components/Rules/HotelRule'
import CarRule from '../../components/Rules/CarRule'



export default function AddMarkupRule() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    productType: '',
    applicationType: '',
    ruleStatus: '',
    ruleName: '',
    currencyCode: '',
    ruleType: '',
    rulePriority: '',
    priceType : {
      priceAmount:'',
      amountType:'',
      applicableOn:'',
      calculatedOn:''
    },
    conditions:{
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> , fromComponent = false) => {
    if(fromComponent){
      setFormData(prev => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          ...e,
        }
      }));
    }else{
      const { name, value } = e.target
      if (['priceAmount', 'amountType', 'applicableOn', 'calculatedOn'].includes(name)) {
        setFormData(prev => ({
          ...prev,
          priceType: {
            ...prev.priceType,
            [name]: value
          }
        }))
      }
      else {
        setFormData(prev => ({ ...prev, [name]: value }))
      }
    }
  }
  useEffect(()=>{
    console.log('Updated Form:')
    console.log( formData)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // setIsSubmitting(true)
    // const token = localStorage.getItem('authToken')

    // try {
    //   const response = await axios.post(
    //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/create-rule`,
    //     formData,
    //     {
    //       headers: {
    //         Authorization: `${token}`,
    //         'Content-Type': 'application/json'
    //       }
    //     }
    //   )
    //   toast.success("Rule added successfully!");
    //   router.push('/dashboard/list-rules')
    // } catch (error: any) {
    //   console.error(error)
    //   toast.error("Submission failed. Rule is not created.");
    // } finally {
    //   setIsSubmitting(false)
    // }
  }

  const renderRuleComponent = () => {
    switch (formData.productType) {
      case '1':
        // return <FlightRule conditions={formData.conditions} onFormDataChange={handleChange}  />
      case '2':
        // return <HotelRule  conditions={formData.conditions} onFormDataChange={handleChange} />
      case '3':
        // return <CarRule  conditions={formData.conditions} onFormDataChange={handleChange} />
      default:
        return null
    }
  }

  return (
    <div className="container-fluid">
      <div className="heading mt-3">
        <h2>Create Rule</h2>
      </div>
      <div className="body mt-4">
        <form onSubmit={handleSubmit}>
          <table className="table CreateRules"> 
            <tbody>
              <tr>
                <th>Product Type</th>
                <td>
                  <select
                    className="form-select"
                    id="productType"
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Product Type</option>
                    <option value="1">Air</option>
                    <option value="2">Hotel</option>
                    <option value="3">Car</option>
                  </select>
                </td>
                <th>Application Type</th>
                <td>
                  <select className="form-select" id="applicationType" name="applicationType" required value={formData.applicationType} onChange={handleChange}>
                    <option value="">Select Application Type</option>
                    <option value="1">B2C</option>
                    {/* <option value="2">B2B</option> */}
                  </select>
                </td>
                <th>Active</th>
                <td>
                  <select className="form-select" id="ruleStatus" name="ruleStatus" value={formData.ruleStatus} onChange={handleChange} required>
                    <option value="">Select Active Type</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </td>
              </tr>
              <tr className='rule-tr mt-5'>
                <th>Rule Type</th>
                <td>
                  <select className="form-select" id="ruleType" name="ruleType" value={formData.ruleType} onChange={handleChange}>
                    <option value="">Select Rule Type</option>
                    <option value="0">Markup/Commission</option>
                    <option value="1">Discount</option>
                  </select>
                </td>
                <th>Rule Name</th>
                <td>
                  <input className="form-control" id="ruleName" name="ruleName" type="text" required  value={formData.ruleName} onChange={handleChange}/>
                </td>
                <th>Currency</th>
                <td>
                  <select className="form-select" id="currencyCode" name="currencyCode" required value={formData.currencyCode} onChange={handleChange}>
                    <option value=""> Select Currency</option>
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                    <option value="CAD">CAD</option>
                    <option value="NZD">NZD</option>
                    <option value="GBP">GBP</option>
                    <option value="AUD">AUD</option>
                  </select>
                </td>
              </tr>
              <tr>
                  <th>Rule Priority</th>
                  <td>
                    <select name="rulePriority" id="rulePriority" className='form-select' onChange={handleChange} value={formData.rulePriority}>
                      <option value="">Select Priority</option>
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                    </select>
                  </td>
              </tr>
              <tr>
                <td colSpan={6} className="blank"></td>
              </tr>
              {/* Markup and Discount */}
              {formData.ruleType == '0' && (
                <tr>
                  <th>Markup Type</th>
                  <td colSpan={3}>
                    <input
                      className="form-control"
                      id="priceAmount"
                      name="priceAmount"
                      type="text"
                      value={formData.priceType.priceAmount}
                      onChange={handleChange}
                      required
                    />
                    <select
                      className="form-select mt-1"
                      id="amountType"
                      name="amountType"
                      value={formData.priceType.amountType}
                      onChange={handleChange}
                      required
                    >
                      <option value="0">Fixed</option>
                      <option value="1">Percentage</option>
                    </select>
                    <select
                      className="form-select mt-1"
                      id="applicableOn"
                      name="applicableOn"
                      value={formData.priceType.applicableOn}
                      onChange={handleChange}
                      required
                    >
                      <option value="0">PerBooking</option>
                      <option value="1">PerPax</option>
                    </select>
                  </td>
                  <th>Calculated On</th>
                  <td>
                    <select
                      className="form-select"
                      id="calculatedOn"
                      name="calculatedOn"
                      value={formData.priceType.calculatedOn}
                      onChange={handleChange}
                      required
                    >
                      <option value="basefare">BaseFare</option>
                      <option value="totalfare">TotalFare</option>
                    </select>
                  </td>
                </tr>
              )}

              {formData.ruleType == '1' && (
                <tr>
                  <th>Discount Amount</th>
                  <td colSpan={3}>
                    <input
                      className="form-control"
                      id="priceAmount"
                      name="priceAmount"
                      type="text"
                      onChange={handleChange}
                      value={formData.priceType.priceAmount}
                      defaultValue="0.00"
                    />
                    <select className="form-select" id="amountType" name="amountType" onChange={handleChange} value={formData.priceType.amountType}>
                      <option value="0">Fixed</option>
                      <option value="1">Percentage</option>
                    </select>
                    <select className="form-select" id="applicableOn" name="applicableOn" onChange={handleChange} 
                      value={formData.priceType.applicableOn}>
                      <option value="0">PerBooking</option>
                      <option value="1">PerPax</option>
                    </select>
                  </td>
                  <th>Calculated On</th>
                  <td>
                    <select className="form-select" id="calculatedOn" name="calculatedOn" onChange={handleChange} 
                      value={formData.priceType.calculatedOn}>
                      <option value="">Select Discount AppliedOn</option>
                      <option value="0">BaseFare</option>
                      <option value="1">TotalFare</option>
                    </select>
                  </td>
                </tr>
              )}

            </tbody>
          </table>

          {/* Render product-specific rule section */}
          <div className="mt-4">
            {renderRuleComponent()}
          </div>

          <button type="submit" className="btn btn-primary mt-3" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  )
}
