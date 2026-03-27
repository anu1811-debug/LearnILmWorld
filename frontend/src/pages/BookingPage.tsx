import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { BookOpen, User as UserIcon, Calendar, Clock, DollarSign, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to load Razorpay
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const BookingPage = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [trainer, setTrainer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingRes, setBookingRes] = useState<any>(null);

  // Extract data passed from BookPrivateSession / BookGroupSession
  const bookingDetails = location.state || {};
  const isGroup = bookingDetails.type === 'group';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Redirect back if accessed directly without selecting a session
    if (!bookingDetails.type) {
        navigate(`/trainer/${trainerId}`);
        return;
    }

    const fetchTrainer = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/profile/${trainerId}`);
        setTrainer(response.data);
      } catch (err) {
        setError('Failed to load trainer information');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [trainerId, user, navigate, bookingDetails]);

  // --- Formatting Display Data ---
  const displaySubject = isGroup 
    ? bookingDetails.title 
    : (trainer?.profile?.specializations?.[0] || trainer?.profile?.languages?.[0] || 'Learning Session');
    
  const displaySessionType = isGroup ? 'Group Session' : '1-1 Private Session';
  const displayTeacher = trainer?.name || 'Loading...';
  
  // Parse the date/time correctly based on which component sent it
  const sessionDateObj = new Date(bookingDetails.time || bookingDetails.date);
  const displayDate = sessionDateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const displayTime = sessionDateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  
  const displayDuration = bookingDetails.duration ? `${bookingDetails.duration} minutes` : '60 minutes'; // fallback for group if not passed
  const finalPrice = bookingDetails.price || 0;

  // --- Payment Handler ---
  const handlePayment = async () => {
    setError('');
    setProcessing(true);
    if (finalPrice <= 0) {
      setError("Amount must be greater than 0 to proceed with payment.");
      setProcessing(false);
      return;
    }

    // 🚨 Check 2: Get the auth token
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authentication token missing. Please log in again.");
      setProcessing(false);
      return;
    }

    try {
      const isRazorpayLoaded = await loadRazorpayScript();
      if (!isRazorpayLoaded) {
        setError("Razorpay SDK failed to load. Are you online?");
        setProcessing(false);
        return;
      }

      // student nationalityCode
      const nationalityCode = await axios.get(`${API_BASE_URL}/api/users/profile/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => res.data.profile.nationalityCode)
      .catch(() => 'USD');
      
      // 1. Create order on the backend
      const orderResponse = await axios.post(`${API_BASE_URL}/api/payments/create-razorpay-order`, {
        amount: nationalityCode === 'IN' ? finalPrice*95 : finalPrice,
        currency: nationalityCode === 'IN' ? 'INR' : 'USD' 
      });
      
      const { id: order_id, currency, amount } = orderResponse.data;

      // 2. Create pending booking
      const payload = {
        trainerId: trainerId,
        studentName: user?.name || 'Student',
        studentEmail: user?.email,
        paymentMethod: 'razorpay',
        amount: Number(finalPrice),
        bookingType: bookingDetails.type || (finalPrice === 0 ? 'free demo' : 'private'),
        date: bookingDetails.date,
        time: bookingDetails.time,
        duration: bookingDetails.duration,
        classId: bookingDetails.classId
      };
      const bookingResponse = await axios.post(`${API_BASE_URL}/api/bookings`, payload);

      // 3. Razorpay Config
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: amount.toString(),
        currency: currency,
        name: "LearniLM World",
        description: `${displaySessionType} with ${trainer.name}`,
        order_id: order_id,
        handler: async function (response: any) {
          try {
            // 4. Verify Payment
            const verifyRes = await axios.post(`${API_BASE_URL}/api/payments/verify-razorpay-payment`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: bookingResponse.data._id,
              amount: finalPrice,
              currency: currency
            });

            if (verifyRes.data.success) {
              setBookingRes(verifyRes.data.booking);
              setSuccess(true);
            }
          } catch (err) {
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#276dc9", 
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any){
          setError(`Payment failed: ${response.error.description}`);
      });
      paymentObject.open();

    } catch (err) {
      console.error(err);
      setError('Failed to initiate secure checkout.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">Loading...</div>;
  }

  if (success) {
      navigate('/student/sessions')
  }

  return (
    <>
      <Navbar/>
    <div className="min-h-screen  flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-[420px] w-full">
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Subject */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#f0f5fb] text-[#276dc9] flex items-center justify-center shrink-0">
              <BookOpen size={20} strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">Subject</p>
              <p className="text-[15px] font-semibold text-gray-800">{displaySubject}</p>
            </div>
          </div>

          {/* Session Type */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#f0f5fb] text-[#276dc9] flex items-center justify-center shrink-0 font-bold text-lg">
              {isGroup ? 'G' : 'P'}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">Session Type</p>
              <p className="text-[15px] font-semibold text-gray-800">{displaySessionType}</p>
            </div>
          </div>

          {/* Teacher */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#f0f5fb] text-[#276dc9] flex items-center justify-center shrink-0">
              <UserIcon size={20} strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">Teacher</p>
              <p className="text-[15px] font-semibold text-gray-800">{displayTeacher}</p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#f0f5fb] text-[#276dc9] flex items-center justify-center shrink-0">
              <Calendar size={20} strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">Date</p>
              <p className="text-[15px] font-semibold text-gray-800">{displayDate}</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#f0f5fb] text-[#276dc9] flex items-center justify-center shrink-0">
              <Clock size={20} strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">Time</p>
              <p className="text-[15px] font-semibold text-gray-800">{displayTime}</p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#f0f5fb] text-[#276dc9] flex items-center justify-center shrink-0">
              <Clock size={20} strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">Duration</p>
              <p className="text-[15px] font-semibold text-gray-800">{displayDuration}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-100" />

        {/* Total Price */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 text-[#276dc9] flex items-center justify-center shrink-0">
                <DollarSign size={24} strokeWidth={2} />
             </div>
             <p className="text-base font-bold text-gray-800">Total</p>
          </div>
          <p className="text-[22px] font-bold text-[#276dc9]">
            ${finalPrice.toFixed(2)}
          </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={handlePayment}
          disabled={processing}
          className="w-full py-3.5 bg-[#276dc9] hover:bg-[#1d59a7] text-white rounded-lg font-medium text-[15px] transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed mb-4 shadow-sm"
        >
          {processing ? 'Loading...' : 'Confirm & Pay'}
        </button>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-400">
          You won't be charged until the session is confirmed
        </p>

      </div>
    </div>
    <Footer/>
    </>
  );
};

export default BookingPage;