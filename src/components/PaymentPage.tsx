import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { venuesData } from '../data/artistsData';
import { supabase } from '../lib/supabase';
import {
  CreditCard,
  Building,
  Users,
  Calendar,
  Clock,
  Info,
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Slot {
  slot_id: string;
  start_time: string;
  end_time: string;
}

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const venueId = searchParams.get('venue') || '';
  const venue = venuesData.find((v) => v.id === venueId);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);

  const [formData, setFormData] = useState({
    bookingName: '',
    persons: '1',
    whatsapp: '',
    email: '',
    decoration: false,
    slotId: '',
  });

  useEffect(() => {
    if (selectedDate && venue?.id) {
      fetchAvailableSlots();
    }
  }, [selectedDate, venue?.id]);

  const fetchAvailableSlots = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_available_slots', {
          p_venue_id: venue?.id,
          p_date: selectedDate
        });

      if (error) throw error;
      
      setSlots(data || []);
      if (data && data.length > 0) {
        setFormData(prev => ({ ...prev, slotId: data[0].slot_id }));
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!venue) return <div>Venue not found</div>;

  const basePrice = parseInt(venue.price.replace(/[^\d]/g, ''));
  const decorationFee = formData.decoration ? parseInt(venue.decorationFee.replace(/[^\d]/g, '')) : 0;
  const advanceAmount = 500;
  const balanceAmount = basePrice + decorationFee - advanceAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if slot is still available
      const { data: isAvailable, error: checkError } = await supabase
        .rpc('is_slot_available', {
          p_venue_id: venue.id,
          p_slot_id: formData.slotId,
          p_booking_date: selectedDate
        });

      if (checkError) throw checkError;
      if (!isAvailable) throw new Error('This slot has just been booked. Please select another slot.');

      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          venue_id: venue.id,
          slot_id: formData.slotId,
          booking_date: selectedDate,
          booking_name: formData.bookingName,
          persons: parseInt(formData.persons),
          whatsapp: formData.whatsapp,
          email: formData.email,
          decoration: formData.decoration,
          advance_paid: false
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: advanceAmount * 100,
        currency: 'INR',
        name: "Binge'N Celebration",
        description: `Booking for ${venue.name}`,
        image: '/BINGEN.png',
        order_id: booking.id,
        handler: async (response: any) => {
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              advance_paid: true,
              payment_id: response.razorpay_payment_id,
            })
            .eq('id', booking.id);

          if (updateError) throw updateError;
          navigate('/booking-success');
        },
        prefill: {
          name: formData.bookingName,
          email: formData.email,
          contact: formData.whatsapp,
        },
        theme: {
          color: '#DB2777',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Building className="h-8 w-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-white">
              Complete Your Booking
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-gray-800 rounded-xl p-6"
              >
                <h2 className="text-xl font-bold text-white mb-6">
                  Booking Details
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Booking Date*
                    </label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white"
                    />
                  </div>

                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Available Slots*
                      </label>
                      <select
                        required
                        value={formData.slotId}
                        onChange={(e) =>
                          setFormData({ ...formData, slotId: e.target.value })
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white"
                      >
                        {slots.length === 0 ? (
                          <option value="">No slots available</option>
                        ) : (
                          slots.map((slot) => (
                            <option key={slot.slot_id} value={slot.slot_id}>
                              {slot.start_time} - {slot.end_time}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Booking Name*
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.bookingName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bookingName: e.target.value,
                        })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white"
                      placeholder="Enter booking name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Number of Persons*
                    </label>
                    <select
                      required
                      value={formData.persons}
                      onChange={(e) =>
                        setFormData({ ...formData, persons: e.target.value })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white"
                    >
                      {[...Array(venue.baseMembers)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Person{i !== 0 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      WhatsApp Number*
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.whatsapp}
                      onChange={(e) =>
                        setFormData({ ...formData, whatsapp: e.target.value })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white"
                      placeholder="Enter WhatsApp number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email ID*
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Do you want decoration?*
                    </label>
                    <select
                      required
                      value={formData.decoration ? 'yes' : 'no'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          decoration: e.target.value === 'yes',
                        })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg transition-colors duration-300 font-bold mt-6 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Processing...' : 'PROCEED'}
                </button>

                {error && (
                  <p className="mt-4 text-red-500 text-center">{error}</p>
                )}
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl p-6 sticky top-6">
                <h2 className="text-xl font-bold text-white mb-6">
                  Booking Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Base Price</span>
                    <span className="text-white font-medium">₹{basePrice}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Decoration</span>
                    <span className="text-white font-medium">
                      ₹{decorationFee}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">
                      Advance Amount Payable
                    </span>
                    <div className="text-right">
                      <span className="text-white font-medium">
                        ₹{advanceAmount}
                      </span>
                      <p className="text-xs text-gray-400">
                        (Including ₹50/- convenience fee)
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">Balance Amount</span>
                      <div className="group relative">
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-700 text-xs text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Final amount can be negotiated directly with the venue
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-medium">
                        ₹{balanceAmount}
                      </span>
                      <p className="text-xs text-gray-400">
                        (Final amount negotiable — to be paid at venue)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;