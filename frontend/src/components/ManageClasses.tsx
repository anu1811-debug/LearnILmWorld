import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ManageClasses = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [price, setPrice] = useState<number>(15);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!user?.id) {
      setError('User authentication required.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        teacherId: user.id,
        title,
        startTime,
        durationMinutes,
        price
      };

      const res = await axios.post(`${API_BASE_URL}/api/class-schedule/group-session`, payload);
      setSuccess(res.data.message || 'Group class created!');
      setTitle('');
      setStartTime('');
      setDurationMinutes(60);
      setPrice(15);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to schedule group class.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-8 shadow-xl max-w-2xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Create a Group Session</h2>
      
      {success && (
        <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Class Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input-field w-full"
            placeholder="e.g., Advanced Conversational English"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Date & Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="input-field w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="input-field w-full"
            >
              <option value={30}>30 Minutes</option>
              <option value={60}>60 Minutes</option>
              <option value={90}>90 Minutes</option>
            </select>
          </div>

          {/* <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price per Student ($)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              min={1}
              className="input-field w-full"
            />
          </div> */}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#5186cd] text-white rounded-full font-bold shadow hover:bg-[#3f6fb0] transition disabled:opacity-50"
        >
          {loading ? 'Scheduling...' : 'Schedule Group Class'}
        </button>
      </form>
    </div>
  );
};

export default ManageClasses;