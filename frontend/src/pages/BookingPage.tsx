// src/pages/BookingPage.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link , useLocation} from 'react-router-dom'
import {
  User,
  Star,
  Clock,
  Globe,
  CreditCard,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  Shield,
  Lock,
  Receipt,
} from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  'pk_test_51SFTuTAiYefZpFfcyRQjJAUIlyldQfTLpmtR1XvsmwPHESrdu7b5klbKyxsDF0a6YLurpdSnHEDLPFHmcyjbb6DP00KsLS35fZ'
)

/* ------------------ Injected CSS ------------------ */
const INJECTED_CSS = `
:root{
  --brand-#9787F3: #9787F3;
  --#9787F3-mid: #6ee7b7;
  --dark-#9787F3: #0b766a;
  --accent-orange: #f97316;
  --coral-deep: #ff6b35;
  --bg-pale-top: #f8fbff;
  --bg-pale: #f6faf9;
  --card: #ffffff;
  --muted: #6b7280;
  --text: #0f172a;
  --danger: #ef4444;
}
*{box-sizing:border-box}
body,html,#root{margin:0;padding:0;font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial;color:var(--text);background:linear-gradient(180deg,var(--bg-pale-top),var(--bg-pale));}
.container{max-width:1100px;margin:0 auto;padding:28px}
.header-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
.logo-box{width:64px;height:64px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,var(--brand-#9787F3),var(--#9787F3-mid));color:#fff;box-shadow:0 8px 30px rgba(14,165,163,0.12)}
.app-title{font-size:20px;font-weight:700}
.app-sub{font-size:13px;color:var(--muted);margin-top:4px}
.grid-2{display:grid;grid-template-columns:1fr 420px;gap:28px}
@media(max-width:900px){.grid-2{grid-template-columns:1fr}}
.avatar{width:76px;height:76px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,var(--brand-#9787F3),var(--#9787F3-mid));color:#fff;box-shadow:0 12px 30px rgba(14,165,163,0.12)}
.section-title{font-size:18px;font-weight:700;margin-bottom:12px}
.small-muted{color:var(--muted);font-size:13px}
.info-list{list-style:none;padding:0;margin:0}
.info-list li{display:flex;gap:10px;align-items:center;margin-bottom:10px;color:var(--muted)}
.stat-row{display:flex;gap:12px;align-items:center}
.method-group{margin-top:16px;display:flex;flex-direction:column;gap:12px}
.method-item{display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;border:1px solid rgba(15,23,42,0.05);cursor:pointer;background:transparent;transition:all .18s}
.method-item:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(2,6,23,0.04)}
.method-item.active{border:2px solid var(--dark-#9787F3);box-shadow:0 12px 30px rgba(11,118,106,0.12);background:linear-gradient(180deg,rgba(11,118,106,0.02),rgba(14,165,163,0.01))}
.method-icon{width:34px;height:34px;border-radius:8px;display:grid;place-items:center;background:#fff;box-shadow:0 8px 18px rgba(2,6,23,0.04)}
.method-label{font-weight:700}
.method-sub{font-size:13px;color:var(--muted)}
.right-card{padding:18px;border-radius:12px}
.card{background:var(--card);border-radius:14px;border:1px solid rgba(15,23,42,0.04);box-shadow:0 18px 40px rgba(2,6,23,0.06);padding:20px}
.card-compact{padding:16px}
.card-logos{display:flex;gap:8px;align-items:center}
.stripe-field{padding:12px;border-radius:10px;border:1px solid rgba(15,23,42,0.06);margin-bottom:12px;background:linear-gradient(180deg,#fff,#fcfffb);position:relative}
.label{display:block;font-weight:600;color:var(--muted);margin-bottom:8px;font-size:13px}
.input{width:100%;padding:12px;border-radius:10px;border:1px solid rgba(15,23,42,0.06);background:var(--card);font-size:14px;outline:none}
.btn-primary{background:var(--accent-orange);color:#fff;padding:12px;border-radius:10px;border:none;font-weight:800;cursor:pointer}
.btn-secondary{background:var(--brand-#9787F3);color:#fff;padding:10px;border-radius:10px;border:none;font-weight:700;cursor:pointer}
.helper{font-size:13px;color:var(--muted)}
.alert{display:flex;gap:10px;align-items:center;border-radius:10px;padding:10px 12px;background:#fff7f7;color:var(--danger);border:1px solid rgba(239,68,68,0.08);font-weight:600}
.footer-note{margin-top:14px;font-size:13px;color:var(--muted)}
.card-brand { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); display:flex; align-items:center; justify-content:center; width:44px; height:28px; pointer-events:none; }
.card-brand img { max-height:22px; max-width:44px; display:block; }
.amex-badge { background:#003876; color:#fff; font-weight:700; font-size:12px; padding:2px 6px; border-radius:4px; }
.split-row { display:flex; gap:12px; align-items:center; }
@media (max-width:640px) {.logo-box{width:56px;height:56px}}
`;

/* inject style once */
const injectCssOnce = () => {
  if (document.getElementById('booking-page-styles')) return
  const s = document.createElement('style')
  s.id = 'booking-page-styles'
  s.innerHTML = INJECTED_CSS
  document.head.appendChild(s)
}

/* brand mounting helper */
const mountBrandToContainer = (containerId, brand) => {
  const container = document.getElementById(containerId)
  if (!container) return
  container.innerHTML = ''
  if (!brand || brand === 'unknown') return
  const visa = 'https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg'
  const mc = 'https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg'
  const discover = 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Discover_Card_logo.svg'
  if (brand === 'visa') {
    const img = document.createElement('img'); img.src = visa; img.alt = 'visa'; img.style.maxHeight = '20px'; container.appendChild(img); return
  }
  if (brand === 'mastercard' || brand === 'maestro') {
    const img = document.createElement('img'); img.src = mc; img.alt = 'mc'; img.style.maxHeight = '20px'; container.appendChild(img); return
  }
  if (brand === 'amex') {
    const b = document.createElement('div'); b.className = 'amex-badge'; b.textContent = 'AMEX'; container.appendChild(b); return
  }
  if (brand === 'discover') {
    const img = document.createElement('img'); img.src = discover; img.alt = 'discover'; img.style.maxHeight = '20px'; container.appendChild(img); return
  }
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '18'); svg.setAttribute('height', '18'); svg.setAttribute('viewBox', '0 0 24 24')
  svg.innerHTML = '<path fill="#0f172a" d="M2 7h20v10H2z" opacity="0.12"></path><rect x="3" y="8" width="18" height="2" rx="1" fill="#0f172a" />'
  container.appendChild(svg)
}

/* ---------------- PaymentPanel (right) - uses separate Stripe elements ---------------- */
const PaymentPanel = ({ trainer, selectedMethod, onPaymentSuccess, onPaymentError, bookingDetails }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [studentName, setStudentName] = useState('')
  const [cardError, setCardError] = useState('')
  const finalPrice = bookingDetails?.price || trainer.profile?.hourlyRate || 25

  useEffect(() => {
    injectCssOnce()
  }, [])

  // invoked by CardNumberElement's onChange
  const handleCardNumberChange = (ev) => {
    setCardError(ev?.error ? ev.error.message : '')
    mountBrandToContainer('card-brand-container', ev?.brand || 'unknown')
  }

  // optional: handle expiry / cvc errors (show aggregated)
  const handleGenericChange = (ev) => {
    if (ev?.error) setCardError(ev.error.message)
    else if (!ev?.error) setCardError('')
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   if (!studentName.trim()) {
  //     onPaymentError('Please enter your name')
  //     return
  //   }
  //   setLoading(true)

  //   try {
  //     if (selectedMethod === 'card') {
  //       if (!stripe || !elements) {
  //         onPaymentError('Stripe not loaded')
  //         setLoading(false)
  //         return
  //       }

  //       const cardNumberEl = elements.getElement(CardNumberElement)
  //       if (!cardNumberEl) {
  //         onPaymentError('Card number field missing')
  //         setLoading(false)
  //         return
  //       }

  //       // Create payment intent (kept same as original: amount not multiplied)
  //       const { data } = await axios.post(`${API_BASE_URL}/api/payments/create-payment-intent`, {
  //         amount: trainer.profile?.hourlyRate || 25,
  //         currency: 'usd'
  //       })

  //       // Confirm payment using the CardNumberElement as card
  //       const result = await stripe.confirmCardPayment(data.clientSecret, {
  //         payment_method: {
  //           card: cardNumberEl,
  //           billing_details: { name: studentName }
  //         }
  //       })

  //       if (result.error) {
  //         onPaymentError(result.error.message)
  //       } else {
  //         // Create booking
  //         const bookingResponse = await axios.post('/api/bookings', {
  //           trainerId: trainer._id,
  //           studentName,
  //           paymentMethod: 'stripe',
  //           amount: trainer.profile?.hourlyRate || 25
  //         })

  //         // Update payment status
  //         await axios.put(`/api/bookings/${bookingResponse.data._id}/payment`, {
  //           paymentStatus: 'completed',
  //           paymentId: result.paymentIntent.id
  //         })

  //         onPaymentSuccess({
  //           ...bookingResponse.data,
  //           paymentDetails: {
  //             paymentId: result.paymentIntent.id,
  //             amount: result.paymentIntent.amount / 100,
  //             currency: result.paymentIntent.currency,
  //             status: result.paymentIntent.status
  //           }
  //         })
  //       }
  //     } else {
  //       // Demo flow: call fake-payment endpoint (keeps your original flow)
  //       const fakePaymentResponse = await axios.post('/api/payments/fake-payment', {
  //         amount: trainer.profile?.hourlyRate || 25
  //       })

  //       // Create booking
  //       const bookingResponse = await axios.post('/api/bookings', {
  //         trainerId: trainer._id,
  //         studentName,
  //         paymentMethod: 'fake',
  //         amount: trainer.profile?.hourlyRate || 25
  //       })

  //       // Update payment status
  //       await axios.put(`/api/bookings/${bookingResponse.data._id}/payment`, {
  //         paymentStatus: 'completed',
  //         paymentId: fakePaymentResponse.data.paymentId
  //       })

  //       onPaymentSuccess({
  //         ...bookingResponse.data,
  //         paymentDetails: {
  //           paymentId: fakePaymentResponse.data.paymentId,
  //           amount: trainer.profile?.hourlyRate || 25,
  //           currency: 'usd',
  //           status: 'succeeded'
  //         }
  //       })
  //     }
  //   } catch (err) {
  //     console.error('Payment error:', err)
  //     onPaymentError(err?.response?.data?.message || 'Payment failed')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted ✅");

    try {
      console.log("Trainer:", trainer);
      console.log("Student Name:", studentName);

      const payload = {
        trainerId: trainer?._id || trainer?.id,
        studentName,
        paymentMethod: 'fake',
        amount: finalPrice, 
        bookingType: bookingDetails?.type || 'paid',
      };

      console.log("Payload being sent:", payload);

      const bookingResponse = await axios.post(`${API_BASE_URL}/api/bookings`, payload);
      console.log("Booking created:", bookingResponse.data);

      await axios.put(`${API_BASE_URL}/api/bookings/${bookingResponse.data._id}/payment`, {
        paymentStatus: 'completed',
        paymentId: 'FREE-BOOKING'
      });

      onPaymentSuccess({
        ...bookingResponse.data,
        paymentDetails: {
          paymentId: 'FREE-BOOKING',
          amount: finalPrice,
          currency: 'usd',
          status: 'succeeded'
        }
      });
    } catch (err) {
      console.error('Booking error:', err.response?.data || err.message);
      onPaymentError('Failed to complete free booking');
    }
  };



  return (
    <div className="right-card card">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div className="section-title">{selectedMethod === 'card' ? 'Card Payment' : 'Demo Payment'}</div>
            <div className="small-muted">
              {selectedMethod === 'card'
                ? 'Enter your card details'
                : 'Complete a demo payment (no charge)'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div className="small-muted">Total</div>
            <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--brand-#9787F3)' }}>
              ${finalPrice}
            </div>
          </div>
        </div>

        <label className="label">Your Full Name</label>
        <input className="input" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="John Doe" />

        {selectedMethod === 'card' && (
          <div style={{ marginTop: 12 }}>
            <div className="label">Card number</div>
            <div className="stripe-field">
              <CardNumberElement
                options={{
                  placeholder: '1234 5678 9012 3456',
                  style: { base: { fontSize: '15px', color: '#0f172a', '::placeholder': { color: '#9aa3ad' } } }
                }}
                onChange={handleCardNumberChange}
              />
              <div id="card-brand-container" className="card-brand" aria-hidden />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div className="label">Expiry</div>
                <div className="stripe-field">
                  <CardExpiryElement
                    options={{
                      placeholder: 'MM/YY',
                      style: { base: { fontSize: '15px', color: '#0f172a', '::placeholder': { color: '#9aa3ad' } } }
                    }}
                    onChange={handleGenericChange}
                  />
                </div>
              </div>

              <div style={{ width: 140 }}>
                <div className="label">CVC</div>
                <div className="stripe-field">
                  <CardCvcElement
                    options={{
                      placeholder: '3 digits',
                      style: { base: { fontSize: '15px', color: '#0f172a', '::placeholder': { color: '#9aa3ad' } } }
                    }}
                    onChange={handleGenericChange}
                  />
                </div>
              </div>
            </div>

            {cardError && (
              <div className="alert" style={{ marginTop: 10 }}>
                <span>⚠️</span>
                <div style={{ marginLeft: 8 }}>{cardError}</div>
              </div>
            )}

            <div className="helper" style={{ marginTop: 10 }}>
              <Lock style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Your card information is encrypted and secure
            </div>
          </div>
        )}

        {selectedMethod === 'demo' && (
          <div style={{ marginTop: 12 }}>
            <div className="card card-compact">
              <div className="small-muted">Demo payment: no real charge will occur. Click complete to proceed.</div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <button type="submit" disabled={loading || (selectedMethod === 'card' && !stripe)} className="btn-primary" style={{ flex: 1 }}>
            {loading ? 'Processing…' : selectedMethod === 'card' ? `Pay $${finalPrice}` : `Complete Demo $${finalPrice}`}
          </button>
        </div>

        <div className="footer-note" style={{ marginTop: 12 }}>
          By completing this payment you accept our <a className="link-accent">Terms</a>.
        </div>
      </form>
    </div>
  )
}

/* ---------------- BookingPage (main) ---------------- */
const BookingPage = () => {
  const { trainerId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [trainer, setTrainer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [booking, setBooking] = useState(null)
  const [selectedMethod, setSelectedMethod] = useState('card') // 'card' or 'demo'
  const location = useLocation() 
  const bookingDetails = location.state || {}

  const sessionTitle = bookingDetails.type === 'group' 
    ? `Group Class: ${bookingDetails.title}` 
    : bookingDetails.duration 
      ? `${bookingDetails.duration} Min Private Session` 
      : 'Private Session';
      
  const finalPrice = bookingDetails.price || trainer?.profile?.hourlyRate || 25;

  useEffect(() => {
    injectCssOnce()
  }, [])

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'student') {
      navigate('/main')
      return
    }
    fetchTrainer()
    // eslint-disable-next-line
  }, [trainerId, user, navigate])

  const fetchTrainer = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/profile/${trainerId}`)
      setTrainer(response.data)
    } catch (err) {
      setError('Failed to load trainer information')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = (bookingData) => {
    setBooking(bookingData)
    setSuccess(true)
    setError('')
  }

  const handlePaymentError = (msg) => {
    setError(msg)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <div>Loading…</div>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="container">
        <div className="card">
          <h2 className="section-title">Trainer not found</h2>
          <Link to="/main" className="btn-primary">Browse Trainers</Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="container py-5">
        <div
          className="card text-center shadow-lg border-0"
          style={{ maxWidth: 560, margin: "0 auto", borderRadius: 20 }}
        >
          {/* Success Icon */}
          <div
            className="d-flex align-items-center justify-content-center bg-light rounded-circle shadow-sm"
            style={{ width: 96, height: 96, margin: "24px auto" }}
          >
            <CheckCircle size={48} strokeWidth={2.5} color="var(--brand-#9787F3)" />
          </div>

          {/* Title & Subtitle */}
          <h3 className="fw-bold mb-2">Payment Successful</h3>
          <p className="text-muted mb-4">
            Your session with{" "}
            <strong style={{ color: "var(--brand-#9787F3)" }}>{trainer.name}</strong>{" "}
            has been booked successfully.
          </p>

          {/* Booking Summary Card */}
          <div
            className="card border-0 shadow-sm"
            style={{ margin: "0 24px", borderRadius: 16 }}
          >
            <div className="card-body" style={{ padding: "20px" }}>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Trainer</span>
                <strong>{trainer.name}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Amount</span>
                <strong style={{ color: "var(--brand-#9787F3)" }}>
                  ${booking?.amount}
                </strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Method</span>
                <strong className="text-secondary">{booking?.paymentMethod}</strong>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-center gap-3 my-4">
            <Link to="/student/sessions" className="btn btn-primary px-4 py-2">
              View My Sessions
            </Link>
            <Link
              to="/main"
              className="btn px-4 py-2"
              style={{
                background: "var(--brand-#9787F3)",
                color: "white",
              }}
            >
              Book Another
            </Link>
          </div>
        </div>
      </div>

    )
  }

  return (
    <div className="bg-[url('/src/assets/bg_main.jpeg')] min-h-screen font-inter text-[#2D274B] transition-colors duration-500 bg-[#FFFAF1] bg-fixed"
      style={{
        position: "relative",
        backgroundSize: "cover",
        backgroundPosition: "right bottom",
        backgroundRepeat: "no-repeat",
        width: "100%",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-10 font-sans">
        <div className="container">
          <div className="header-row">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>

              <div>
                <div className="text-lg font-semibold">LearniLM🌎World</div>
                <div className="text-xs text-[#2D274B]500 -mt-1">Live lessons · Micro-courses</div>
              </div>
            </div>
            <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
              <ArrowLeft /> Back
            </button>
          </div>

          <div className="grid-2">
            {/* LEFT: trainer + select payment type */}
            <div>
              <div className="card bg-white rounded-3xl shadow-xl p-8 mb-8">
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                  <div className="avatar w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-2xl font-bold text-white">{trainer.profile?.imageUrl ? (
                    <img src={trainer.profile?.imageUrl} alt="trainer-profile" />
                  )
                    :
                    (
                      <User />
                    )}</div>
                  <div className='flex-1'>
                    <h2 className='text-2xl font-bold text-gray-900' style={{ margin: 0, fontSize: 22 }}>{trainer.name}</h2>
                    <div style={{ marginTop: 6 }} className="stat-row">
                      <Star className='text-yellow-400 text-lg' />
                      <strong className='font-semibold text-gray-800'>{trainer.stats?.rating || 5.0}</strong>
                      <div className="text-sm text-gray-500">({Math.floor(Math.random() * 200) + 50} reviews)</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <div className="font-semibold text-gray-700" style={{ fontWeight: 700 }}>Languages</div>
                    <div className="text-gray-600">
                      {trainer.profile?.trainerLanguages?.length > 0
                        ? trainer.profile.trainerLanguages.map((l) => l.language).join(', ')
                        : trainer.profile?.languages?.join(', ') || 'English'}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-700" style={{ fontWeight: 700 }}>Experience</div>
                    <div className="text-gray-600">{trainer.profile?.experience || 5}+ years</div>
                  </div>
                </div>

                <p className="mt-5 text-gray-600 leading-relaxed">{trainer.profile?.bio || 'Experienced language trainer helping students achieve fluency.'}</p>

                <div className="card " style={{ marginTop: 12 }}>
                  <div className='mt-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl px-6 py-4 flex justify-between items-center' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className='font-semibold text-gray-800' >{sessionTitle}</div>
                    {bookingDetails.date && (
                           <div className='text-sm text-gray-600 mt-1'>
                             {new Date(bookingDetails.date).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                           </div>
                        )}
                  </div>
                </div>
              </div>

              {/* separate Select Payment Type card (left) */}
              <div className="card bg-white rounded-3xl shadow-lg p-8" style={{ marginTop: 14 }}>
                <h4 className="section-title text-xl font-bold text-gray-900 mb-6">Select payment type</h4>
                <div className="method-group border-2 border-pink-500 bg-pink-50 rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition hover:shadow-md">
                  <div className={`method-item ${selectedMethod === 'card' ? 'active' : ''}`} onClick={() => setSelectedMethod('card')}>
                    <div className="method-icon w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow"><CreditCard /></div>
                    <div style={{ flex: 1 }}>
                      <div className="method-label font-semibold text-gray-900">Credit / Debit Card</div>
                      <div className="method-sub text-sm text-gray-500">Pay securely with any major card</div>
                    </div>
                    <div className="card-logos">
                      <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" alt="visa" style={{ height: 20 }} />
                      <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="mc" style={{ height: 20 }} />
                    </div>
                  </div>

                  <div className={` method-item ${selectedMethod === 'demo' ? 'active' : ''}`} onClick={() => setSelectedMethod('demo')}>
                    <div className="method-icon"><DollarSign /></div>
                    <div style={{ flex: 1 }}>
                      <div className="method-label font-semibold text-gray-900">Demo Payment</div>
                      <div className="method-sub text-sm text-gray-500">Testing flow — no real charge</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* what's included */}
              <div className="card" style={{ marginTop: 14 }}>
                <h4 className="section-title">What's Included</h4>
                <ul className="info-list">
                  {[
                    'One-on-one personalized session',
                    'HD video call via Jitsi Meet',
                    'Customized materials',
                    'Real-time feedback',
                    'Session recording (if requested)',
                  ].map((i, idx) => (
                    <li key={idx}><CheckCircle /> <span style={{ marginLeft: 8 }}>{i}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* RIGHT: payment panel */}
            <div>
              <div className="card">
                <h3 className="section-title">Payment</h3>
                {error && (
                  <div className="alert" style={{ marginBottom: 12 }}>
                    <span>⚠️</span>
                    <div style={{ marginLeft: 8 }}>{error}</div>
                  </div>
                )}

                <Elements stripe={stripePromise}>
                  <PaymentPanel
                    trainer={trainer}
                    selectedMethod={selectedMethod}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    bookingDetails={bookingDetails}
                  />
                </Elements>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default BookingPage
