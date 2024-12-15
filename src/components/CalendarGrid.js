
import React, { useState, useMemo, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameDay, 
  isSameMonth, 
  isToday 
} from 'date-fns';
import './AllCsspart/CalendarGrid.css';
import { EventModal } from './EventModal';
import { EventList } from './EventList'; // Adjust the path based on your folder structure

const FullScreenCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem('calendar-events')) || [];
    const parsedEvents = savedEvents.map(event => ({
      ...event,
      date: new Date(event.date), // Ensure date is parsed correctly
    }));
    setEvents(parsedEvents); // Update the events state
  }, []);

  // Save events to localStorage whenever the events array changes
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('calendar-events', JSON.stringify(events));
    }
  }, [events]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const generateCalendarDays = useMemo(() => {
    const days = [];
    let currentDay = startDate;

    while (currentDay <= endDate) {
      days.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }

    return days;
  }, [startDate, endDate]);

  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => new Date(
      prevMonth.getFullYear(), 
      prevMonth.getMonth() - 1, 
      1
    ));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => new Date(
      prevMonth.getFullYear(), 
      prevMonth.getMonth() + 1, 
      1
    ));
  };

  const handleSaveEvent = (event) => {
    const updatedEvents = editingEvent
      ? events.map(e => (e.id === editingEvent.id ? event : e))
      : [...events, { ...event, id: Date.now(), date: selectedDate.toISOString() }]; // Ensure date is in ISO format

    setEvents(updatedEvents);
    setModalOpen(false);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleDeleteEvent = (id) => {
    // Remove event from state
    const updatedEvents = events.filter(event => event.id !== id);
    
    // Save updated events back to localStorage
    localStorage.setItem('calendar-events', JSON.stringify(updatedEvents));
    
    // Update the state with the new events list
    setEvents(updatedEvents);
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    const dayHasEvents = events.some(event => isSameDay(new Date(event.date), day));
    
    if (dayHasEvents) {
      setEditingEvent(null); // Don't open the form
      setModalOpen(true); // Open modal for adding more events
    } else {
      setEditingEvent(null); // Open modal in "Add New Event" mode
      setModalOpen(true);
    }
  };

  return (
    <div className="full-screen-calendar">
      <div className="calendar-container">
        <div className="calendar-grid-section">
          <div className="calendar-header">
            <div className="calendar-nav-buttons">
              <button 
                className="nav-button" 
                onClick={handlePrevMonth}
              >
                ←
              </button>
              <button 
                className="nav-button" 
                onClick={handleNextMonth}
              >
                →
              </button>
            </div>
            <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
          </div>

          <div className="calendar-weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {generateCalendarDays.map(day => {
              const dayEvents = events.filter(event => 
                isSameDay(new Date(event.date), day)
              );

              return (
                <div
                  key={day.toISOString()}
                  className={`calendar-day 
                    ${!isSameMonth(day, currentMonth) ? 'other-month' : ''} 
                    ${isToday(day) ? 'today' : ''} 
                    ${isSameDay(day, selectedDate) ? 'selected' : ''} 
                    ${dayEvents.length ? 'has-event' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  {format(day, 'd')}
                  {dayEvents.length > 0 && (
                    <div className="event-indicator">{dayEvents.length} Event</div>
                  )}
                  {/* Display event names below the date */}
                  <div className="event-names">
                    {dayEvents.slice(0, 2).map(event => (
                      <div key={event.id} className="event-name">
                        {event.name} {/* Display the event name */}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="more-events">+{dayEvents.length - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="events-sidebar">
          <h3 className="event-list-title">
            Events on {format(selectedDate, 'MMMM d, yyyy')}
          </h3>

          {events.filter(event => isSameDay(new Date(event.date), selectedDate)).length > 0 ? (
            <>
              <EventList
                events={events.filter(event => isSameDay(new Date(event.date), selectedDate))}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
              <button 
                className="add-more-events-button" 
                onClick={() => handleDateClick(selectedDate)}
              >
                Add More Events
              </button>
            </>
          ) : (
            <p>No events for this day.</p>
          )}
        </div>

      </div>

      {isModalOpen && (
        <EventModal
          onClose={() => setModalOpen(false)}
          onSave={handleSaveEvent}
          initialEvent={editingEvent}
        />
      )}
    </div>
  );
};

export default FullScreenCalendar;











