
import React from 'react';
import './AllCsspart/EventList.css';

export const EventList = ({ events, onEdit, onDelete }) => {
  return (
    <div className="event-list-container">
      <h2 className="event-list-title">Upcoming Events</h2>
      {events.length > 0 ? (
        <div className="event-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h3 className="event-name">{event.name}</h3>
                <span className="event-time">
                  {event.startTime} - {event.endTime}
                </span>
              </div>
              {event.description && (
                <p className="event-description">{event.description}</p>
              )}
              <div className="event-actions">
                <button 
                  className="btn btn-edit"
                  onClick={() => onEdit(event)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-delete"
                  onClick={() => onDelete(event.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-events-message">No events scheduled for this day.</p>
      )}
    </div>
  );
};
