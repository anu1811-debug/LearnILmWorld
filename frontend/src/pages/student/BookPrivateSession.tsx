import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const BookPrivateSession = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  
  const [duration, setDuration] = useState<number>(60);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const pricing = { 30: 25, 60: 45, 90: 65 }; 

  // Fetch slots whenever the date or duration changes
  useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      setLoading(true);
      try {
        // Hitting your new class-schedule endpoint
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/class-schedule/slots?teacherId=${trainerId}&dateStr=${selectedDate}&durationMinutes=${duration}`
        );
        setAvailableSlots(res.data.slots);
      } catch (error) {
        console.error("Error fetching slots", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, duration, trainerId]);

  const handleProceedToPayment = () => {
    if (!selectedDate || !selectedTime) return alert("Please select a date and time");
    navigate('/payment', { 
      state: { trainerId, duration, date: selectedDate, time: selectedTime, price: pricing[duration as keyof typeof pricing] } 
    });
  };

  return (
    <>
    <Navbar/>
    <div className=" mx-auto p-6 mt-10 bg-gradient-to-r from-white via-white to-[#79A2CE4D]">
      <h2 className="text-2xl font-bold mb-6">Session Duration</h2>
      
      <div className="flex gap-4 mb-10">
        {[30, 60, 90].map((mins) => (
          <button 
            key={mins}
            onClick={() => { setDuration(mins); setSelectedTime(''); }}
            className={`flex-1 p-6 border-2 rounded-xl text-center transition ${duration === mins ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
          >
            <div className="text-gray-700 text-2xl font-bold">{mins} min</div>
          </button>
        ))}
      </div>

      <div className="border-2 border-blue-400 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Schedule</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Select Date</label>
          <input 
            type="date" 
            onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }}
            className="border p-3 rounded-lg w-full md:w-1/3 focus:outline-blue-500"
            min={new Date().toISOString().split('T')[0]} // Prevent past dates
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
             Available Times
          </label>
          
          {loading ? (
             <p className="text-blue-500 animate-pulse">Calculating available slots...</p>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableSlots.map((time) => (
                <button 
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 border rounded-lg text-center transition ${selectedTime === time ? 'border-blue-500 bg-blue-500 text-white font-bold' : 'border-gray-300 hover:border-blue-400'}`}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : selectedDate ? (
             <p className="text-gray-500">No available slots for this duration on this date.</p>
          ) : (
             <p className="text-gray-400">Please select a date to view available times.</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleProceedToPayment}
          disabled={!selectedTime}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 disabled:opacity-50"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default BookPrivateSession;