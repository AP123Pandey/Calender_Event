
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AllCsspart/EventModal.css';

export const EventModal = ({ onClose, onSave, initialEvent = null }) => {
  const [event, setEvent] = useState({
    name: '',
    startTime: '',
    endTime: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialEvent) {
      setEvent(initialEvent);
    }
  }, [initialEvent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Enhanced validation
    const newErrors = {};
    if (!event.name) newErrors.name = 'Event name is required';
    if (!event.startTime) newErrors.startTime = 'Start time is required';
    if (!event.endTime) newErrors.endTime = 'End time is required';
    
    if (event.startTime && event.endTime && event.startTime >= event.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(event);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent(prevEvent => ({
      ...prevEvent,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      const newErrors = {...errors};
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="event-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="event-modal-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="modal-header">
            <h2>{initialEvent ? 'Edit Event' : 'Add New Event'}</h2>
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={`form-group ${errors.name ? 'error' : ''}`}>
              <label htmlFor="name">Event Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={event.name}
                onChange={handleChange}
                placeholder="Enter event name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="time-group">
              <div className={`form-group ${errors.startTime ? 'error' : ''}`}>
                <label htmlFor="startTime">Start Time</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={event.startTime}
                  onChange={handleChange}
                />
                {errors.startTime && <span className="error-message">{errors.startTime}</span>}
              </div>

              <div className={`form-group ${errors.endTime ? 'error' : ''}`}>
                <label htmlFor="endTime">End Time</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={event.endTime}
                  onChange={handleChange}
                />
                {errors.endTime && <span className="error-message">{errors.endTime}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={event.description}
                onChange={handleChange}
                placeholder="Add event details"
                rows="3"
              />
            </div>

            <div className="modal-actions">
              <motion.button 
                type="submit" 
                className="save-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {initialEvent ? 'Update Event' : 'Create Event'}
              </motion.button>
              <motion.button
                type="button"
                className="cancel-button"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};