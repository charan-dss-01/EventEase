/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

import axios from 'axios';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

interface VerifyTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventId: string;
    eventDate: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function VerifyTicketModal({ isOpen, onClose, eventId, eventDate }: VerifyTicketModalProps) {
    const [ticketId, setTicketId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [daysUntilEvent, setDaysUntilEvent] = useState<number | null>(null);

    const handleVerify = async () => {
        if (!ticketId.trim()) {
            setError('Please enter a ticket ID');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.post('/api/event/verifyTicket', {
                ticketId,
                eventId
            });

            if (response.data.success) {
                setSuccess(true);
                setTicketId('');
            }
        } catch (error: any) {
            if (error.response?.data?.daysUntilEvent) {
                setDaysUntilEvent(error.response.data.daysUntilEvent);
            }
            setError(error.response?.data?.message || 'Failed to verify ticket');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md relative border border-zinc-800">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-4">Verify Ticket</h2>

                {success ? (
                    <div className="text-center py-6">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <p className="text-green-500 text-lg font-medium mb-2">Ticket Verified Successfully!</p>
                        <p className="text-gray-400">The attendee can now enter the event.</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="ticketId" className="block text-sm font-medium text-gray-400 mb-1">
                                    Ticket ID
                                </label>
                                <input
                                    type="text"
                                    id="ticketId"
                                    value={ticketId}
                                    onChange={(e) => setTicketId(e.target.value)}
                                    placeholder="Enter ticket ID"
                                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg">
                                    <AlertCircle className="w-5 h-5" />
                                    <p>{error}</p>
                                </div>
                            )}

                            {daysUntilEvent !== null && (
                                <div className="text-center text-yellow-500">
                                    <p>Event is in {daysUntilEvent} days</p>
                                </div>
                            )}

                            <button
                                onClick={handleVerify}
                                disabled={loading}
                                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                                    loading
                                        ? 'bg-purple-500/50 cursor-not-allowed'
                                        : 'bg-purple-500 hover:bg-purple-600'
                                }`}
                            >
                                {loading ? 'Verifying...' : 'Verify Ticket'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
} 