import React, { useState } from 'react';
// import { CalendarGrid } from './components/CalendarGrid';
import CalendarGrid from './components/CalendarGrid';

import { EventModal } from './components/EventModal';
import { EventList } from './components/EventList';
function App() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleAddEvent = event => {
    setEvents([...events, { ...event, id: Date.now(), date: selectedDate }]);
    setShowModal(false); // Close modal after adding
  };

  const handleEditEvent = updatedEvent => {
    setEvents(events.map(e => (e.id === updatedEvent.id ? updatedEvent : e)));
    setShowModal(false); // Close modal after editing
  };

  const handleDeleteEvent = id => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="app">
      <CalendarGrid
        events={events}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onDayClick={() => {
          setEditingEvent(null); // Reset editing event
          setShowModal(true); // Open modal
        }}
      />
      <EventList
        events={events.filter(
          e => new Date(e.date).toDateString() === selectedDate.toDateString()
        )}
        onEdit={event => {
          setEditingEvent(event);
          setShowModal(true);
        }}
        onDelete={handleDeleteEvent}
      />
      {showModal && (
        <EventModal
          onClose={() => setShowModal(false)}
          onSave={editingEvent ? handleEditEvent : handleAddEvent}
          initialEvent={editingEvent}
        />
      )}
    </div>
  );
}

export default App;


