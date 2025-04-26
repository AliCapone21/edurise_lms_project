import React, { useState } from 'react';
import { assets } from '../../assets/assets';

const CallToAction = () => {
    const [modalType, setModalType] = useState(null); // 'get-started' | 'learn-more'

    const closeModal = () => setModalType(null);

    return (
        <div className="flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0 text-center relative z-10">
            <h1 className="md:text-4xl text-xl text-gray-800 font-semibold leading-snug">
                Learn anything, anytime, anywhere
            </h1>
            <p className="text-gray-500 sm:text-sm max-w-xl">
                Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do ea.
            </p>

            <div className="flex items-center font-medium gap-6 mt-4">
                <button
                    className="px-10 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-200 shadow-sm hover:shadow-md"
                    onClick={() => setModalType('get-started')}
                >
                    Get started
                </button>

                <button
                    onClick={() => setModalType('learn-more')}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition duration-150 group"
                >
                    Learn more
                    <img
                        src={assets.arrow_icon}
                        alt="arrow_icon"
                        className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1"
                    />
                </button>
            </div>

            {/* Modal */}
            {modalType && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white max-w-md w-full rounded-xl shadow-lg p-6 text-left relative animate-fadeInUp"
                        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-3 text-xl text-gray-400 hover:text-gray-600 font-bold"
                        >
                            ×
                        </button>

                        {modalType === 'get-started' && (
                            <>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-3">🚀 Ready to get started?</h2>
                                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                    Join thousands of learners unlocking their potential. Sign up today and start your journey toward in-demand skills!
                                </p>
                                <button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
                                    onClick={() => {
                                        closeModal();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    Sign up now
                                </button>
                            </>
                        )}

                        {modalType === 'learn-more' && (
                            <>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-3">✨ Why choose us?</h2>
                                <ul className="list-disc pl-5 text-sm text-gray-600 leading-relaxed space-y-2">
                                    <li>Flexible learning at your pace</li>
                                    <li>Expert-led, practical lessons</li>
                                    <li>Lifetime access & certificates</li>
                                    <li>Community and support included</li>
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CallToAction;
