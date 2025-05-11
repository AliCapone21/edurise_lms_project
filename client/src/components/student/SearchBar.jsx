import React, { useState, useContext } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';

const SUGGESTIONS = [
    "React", "NodeJS", "JavaScript", "Frontend", "Backend",
    "Web Development", "Fullstack", "HTML", "CSS",
    "MongoDB", "Express", "Redux", "VueJS", "Next.js", "Django"
];

const SearchBar = ({ data }) => {
    const navigate = useNavigate();
    const { backendUrl } = useContext(AppContext);
    const [input, setInput] = useState(data || '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const onSearchHandler = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        try {
            const { data: aiResponse } = await axios.post(`${backendUrl}/api/ai/extract-tags`, { input });

            if (aiResponse.success && aiResponse.tags?.length > 0) {
                const tagQuery = aiResponse.tags.join(',');
                navigate(`/course-list?tags=${encodeURIComponent(tagQuery)}`);
            } else {
                navigate('/course-list/' + encodeURIComponent(input));
            }
        } catch (err) {
            navigate('/course-list/' + encodeURIComponent(input));
        }
    };

    const handleSuggestionClick = (word) => {
        setInput(word);
        setShowSuggestions(false);
        navigate(`/course-list?tags=${encodeURIComponent(word)}`);
    };

    const filteredSuggestions = input.trim()
        ? SUGGESTIONS.filter(tag =>
            tag.toLowerCase().includes(input.toLowerCase())
        ).sort((a, b) =>
            a.toLowerCase().startsWith(input.toLowerCase()) ? -1 : 1
        )
        : SUGGESTIONS.slice(0, 6);

    return (
        <div className="relative max-w-xl w-full">
            <form
                onSubmit={onSearchHandler}
                className="md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded"
            >
                <img className="md:w-auto w-10 px-3" src={assets.search_icon} alt="search_icon" />
                <input
                    onFocus={() => {
                        setShowSuggestions(true);
                        setIsFocused(true);
                    }}
                    onBlur={() => {
                        setTimeout(() => {
                            setShowSuggestions(false);
                            setIsFocused(false);
                        }, 200);
                    }}
                    onChange={e => setInput(e.target.value)}
                    value={input}
                    type="text"
                    className="w-full h-full outline-none text-gray-700 placeholder:text-gray-400"
                    placeholder="Search for courses"
                />
                <button
                    type="submit"
                    className="bg-blue-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1"
                >
                    Search
                </button>
            </form>

            {showSuggestions && filteredSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 max-h-60 overflow-auto shadow-lg">
                    {filteredSuggestions.map((tag, index) => {
                        const matchIndex = tag.toLowerCase().indexOf(input.toLowerCase());
                        const before = tag.slice(0, matchIndex);
                        const match = tag.slice(matchIndex, matchIndex + input.length);
                        const after = tag.slice(matchIndex + input.length);

                        return (
                            <li
                                key={index}
                                onClick={() => handleSuggestionClick(tag)}
                                className="px-4 py-2 cursor-pointer hover:bg-blue-50 transition text-gray-700"
                            >
                                {matchIndex > -1 ? (
                                    <>
                                        {before}
                                        <span className="font-semibold text-blue-600">{match}</span>
                                        {after}
                                    </>
                                ) : (
                                    tag
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* Tag cloud - only show when not typing */}
            {!input && !isFocused && (
                <div className="flex flex-wrap gap-2 mt-4 transition-all duration-200 ease-in">
                    {SUGGESTIONS.slice(0, 8).map((tag, i) => (
                        <span
                            key={i}
                            onClick={() => handleSuggestionClick(tag)}
                            className="cursor-pointer text-sm px-3 py-1 bg-blue-50 text-blue-700 border border-blue-500/20 rounded-full hover:bg-blue-100 transition"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
