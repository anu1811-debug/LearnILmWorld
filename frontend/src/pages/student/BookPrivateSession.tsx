import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookPrivateSession = ({ trainerId }: { trainerId: string }) => {
  const navigate = useNavigate();
  
  const [duration, setDuration] = useState<number>(60);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const pricing = { 30: 25, 60: 45, 90: 65 }; 

  useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/class-schedule/slots?teacherId=${trainerId}&dateStr=${selectedDate}&durationMinutes=${duration}`
        );
        // Ab yahan array of ISO strings aayega
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
      state: { 
        trainerId, 
        duration, 
        date: selectedDate, 
        time: selectedTime, 
        price: pricing[duration as keyof typeof pricing],
        type: 'private' 
      } 
    });
  };

  return (
    <div className="w-full">
      <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-slate-700">Select Duration</h4>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
        {[30, 60, 90].map((mins) => (
          <button 
            key={mins}
            onClick={() => { setDuration(mins); setSelectedTime(''); }}
            className={`p-3 sm:p-4 border-2 rounded-xl text-center transition flex flex-col items-center justify-center ${duration === mins ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 bg-white'}`}
          >
            <span className="text-slate-700 text-lg sm:text-xl font-bold leading-none">{mins}</span>
            <span className="text-[10px] sm:text-sm font-normal text-slate-500 mt-1">min</span>
          </button>
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-200 p-4 sm:p-6 rounded-xl">
        <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-slate-700">Pick Date & Time</h4>
        
        <div className="mb-5 sm:mb-6">
          <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-slate-600">Select Date</label>
          <input 
            type="date" 
            onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }}
            className="border border-slate-300 p-2.5 sm:p-3 rounded-lg w-full md:w-1/2 focus:outline-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm sm:text-base bg-white"
            min={new Date().toISOString().split('T')[0]} 
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-slate-600">Available Times</label>
          
          {loading ? (
             <p className="text-blue-500 animate-pulse text-xs sm:text-sm">Calculating available slots...</p>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {availableSlots.map((isoTime) => {
              //ISO String ko local browser time me convert karna
                const dateObj = new Date(isoTime);
                const displayTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <button 
                    key={isoTime}
                    onClick={() => setSelectedTime(isoTime)} 
                    className={`p-2 sm:p-2.5 border rounded-lg text-center transition text-xs sm:text-sm font-medium ${selectedTime === isoTime ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 bg-white hover:border-blue-400 text-slate-700'}`}
                  >
                    {displayTime} 
                  </button>
                );
              })}
            </div>
          ) : selectedDate ? (
             <p className="text-slate-500 text-xs sm:text-sm bg-white p-3 border border-slate-200 rounded-lg">No available slots for this duration on this date.</p>
          ) : (
             <p className="text-slate-400 text-xs sm:text-sm italic">Please select a date first.</p>
          )}
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <button 
          onClick={handleProceedToPayment}
          disabled={!selectedTime}
          className="w-full py-3 sm:py-3.5 text-sm sm:text-base bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-400 transition"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default BookPrivateSession;