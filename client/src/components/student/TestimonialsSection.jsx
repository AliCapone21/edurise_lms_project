import React, { useState } from 'react';
import { assets, dummyTestimonial } from '../../assets/assets';

const TestimonialsSection = () => {
    const [openTestimonial, setOpenTestimonial] = useState(null);

    const handleOpen = (testimonial) => setOpenTestimonial(testimonial);
    const handleClose = () => setOpenTestimonial(null);

    return (
        <div className="pb-14 px-8 md:px-0">
            <h2 className="text-3xl font-semibold text-gray-800">Testimonials</h2>
            <p className="md:text-base text-gray-500 mt-3">
                Hear from our learners as they share their journeys of transformation, success, and how our <br />
                platform has made a difference in their lives.
            </p>

            <div className="grid grid-cols-auto gap-8 mt-14">
                {dummyTestimonial.map((testimonial, index) => (
                    <div
                        key={index}
                        className="text-sm text-left border border-gray-200 pb-6 rounded-xl bg-white shadow-[0_4px_15px_0px_rgba(0,0,0,0.05)] overflow-hidden
              transform transition duration-300 hover:scale-[1.02] hover:shadow-lg"
                    >
                        <div className="flex items-center gap-4 px-5 py-4 bg-gray-50">
                            <img
                                className="h-12 w-12 rounded-full object-cover border border-gray-300"
                                src={testimonial.image}
                                alt={testimonial.name}
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{testimonial.name}</h3>
                                <p className="text-sm text-gray-600">{testimonial.role}</p>
                            </div>
                        </div>

                        <div className="p-5 pb-7">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <img
                                        className="h-5 w-5 animate-pulseSlow"
                                        key={i}
                                        src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                                        alt="star"
                                    />
                                ))}
                            </div>
                            <p className="text-gray-600 mt-4 leading-relaxed line-clamp-3">{testimonial.feedback}</p>
                        </div>

                        <div className="px-5">
                            <button
                                onClick={() => handleOpen(testimonial)}
                                className="text-blue-600 text-sm font-medium hover:underline transition duration-150"
                            >
                                Read more →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {openTestimonial && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                    onClick={handleClose}
                >
                    <div
                        className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative"
                        onClick={(e) => e.stopPropagation()} // prevent modal close on inner click
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
                        >
                            ×
                        </button>
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                className="h-14 w-14 rounded-full object-cover border border-gray-300"
                                src={openTestimonial.image}
                                alt={openTestimonial.name}
                            />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">{openTestimonial.name}</h3>
                                <p className="text-sm text-gray-600">{openTestimonial.role}</p>
                            </div>
                        </div>

                        <div className="flex gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <img
                                    className="h-5 w-5 animate-pulseSlow"
                                    key={i}
                                    src={i < Math.floor(openTestimonial.rating) ? assets.star : assets.star_blank}
                                    alt="star"
                                />
                            ))}
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed">{openTestimonial.feedback}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestimonialsSection;
