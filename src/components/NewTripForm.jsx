import { useState } from 'react';
import { useTrip } from '../context/TripContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { PlusIcon, XMarkIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const NewTripForm = ({ onClose }) => {
  const { createTrip } = useTrip();
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Default to a week
  });
  const [formErrors, setFormErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleDateChange = (date, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Trip name is required';
    }
    if (!formData.destination.trim()) {
      errors.destination = 'Destination is required';
    }
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    }
    if (formData.endDate < formData.startDate) {
      errors.endDate = 'End date cannot be before start date';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    createTrip(formData);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-30">
      <div className="card w-full max-w-md mx-auto relative animate-fade-in">
        <div className="form-card-header">
          <div className="flex flex-col items-center justify-center">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-20 mb-2 shadow">
              <GlobeAltIcon className="w-10 h-10 text-white" />
            </span>
            <h2 className="text-2xl font-bold tracking-tight">Create a New Trip</h2>
            <p className="mt-1 text-sm text-blue-50/90">Plan your next adventure!</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/20 transition-colors"
            title="Close"
          >
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="form-label">
                Trip Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Summer Vacation"
                className={`form-input ${formErrors.name ? 'border-red-400' : ''}`}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="destination" className="form-label">
                Destination
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Paris, France"
                className={`form-input ${formErrors.destination ? 'border-red-400' : ''}`}
              />
              {formErrors.destination && (
                <p className="mt-1 text-sm text-red-500">{formErrors.destination}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Start Date
                </label>
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date) => handleDateChange(date, 'startDate')}
                  selectsStart
                  startDate={formData.startDate}
                  endDate={formData.endDate}
                  className={`form-input ${formErrors.startDate ? 'border-red-400' : ''}`}
                />
                {formErrors.startDate && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.startDate}</p>
                )}
              </div>
              <div>
                <label className="form-label">
                  End Date
                </label>
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) => handleDateChange(date, 'endDate')}
                  selectsEnd
                  startDate={formData.startDate}
                  endDate={formData.endDate}
                  minDate={formData.startDate}
                  className={`form-input ${formErrors.endDate ? 'border-red-400' : ''}`}
                />
                {formErrors.endDate && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.endDate}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn"
              >
                <PlusIcon className="w-5 h-5 inline mr-1" />
                Create Trip
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTripForm; 