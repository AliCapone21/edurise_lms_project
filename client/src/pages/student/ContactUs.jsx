import React, { useState } from 'react';
import Footer from '../../components/student/Footer';

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState(null); // 'success' | 'error' | null
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);
        try {
            const res = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                setStatus('success');
                setMessage('Message sent successfully!');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
                setMessage(data.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Network error. Please try again later.');
        }

        // Hide the message after 4 seconds
        setTimeout(() => setStatus(null), 4000);
    };

    return (
        <>
            <div className="min-h-screen bg-white px-6 md:px-36 py-16 text-gray-800">
                <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
                <p className="text-center text-gray-600 mb-12">
                    Have a question or need help? We're here to assist you. Fill out the form below and we’ll get back to you soon.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="max-w-2xl mx-auto bg-gray-50 p-8 rounded shadow space-y-6"
                >
                    {status && (
                        <div
                            className={`text-center py-2 px-4 rounded text-sm ${
                                status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                        >
                            {message}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            type="text"
                            className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Your name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="5"
                            className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Type your message here..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Send Message
                    </button>
                </form>
            </div>

            <Footer />
        </>
    );
};

export default ContactUs;
