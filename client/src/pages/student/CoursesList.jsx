import React, { useContext, useEffect, useState } from 'react';
import Footer from '../../components/student/Footer';
import { assets } from '../../assets/assets';
import CourseCard from '../../components/student/CourseCard';
import { AppContext } from '../../context/AppContext';
import { useParams, useSearchParams } from 'react-router-dom';
import SearchBar from '../../components/student/SearchBar';
import axios from 'axios';

const CoursesList = () => {
    const { input } = useParams();
    const [params] = useSearchParams();
    const tagParams = params.get('tags');
    const tags = tagParams ? tagParams.split(',') : [];

    const { allCourses, backendUrl, navigate } = useContext(AppContext);
    const [filteredCourse, setFilteredCourse] = useState([]);
    const [fact, setFact] = useState('');

    const searchTerm = input || tags.join(' ');

    useEffect(() => {
        if (!allCourses || allCourses.length === 0) return;

        const tempCourses = [...allCourses];

        let matchedCourses = [];

        if (input) {
            matchedCourses = tempCourses.filter(course =>
                course.courseTitle.toLowerCase().includes(input.toLowerCase())
            );
        } else if (tags.length > 0) {
            matchedCourses = tempCourses.filter(course =>
                tags.some(tag =>
                    course.courseTitle.toLowerCase().includes(tag.toLowerCase())
                )
            );
        } else {
            matchedCourses = tempCourses;
        }

        setFilteredCourse(matchedCourses);

        // If no results, fetch an AI fact
        if (matchedCourses.length === 0 && searchTerm.trim()) {
            axios.post(`${backendUrl}/api/ai/course-fact`, { topic: searchTerm })
                .then(res => {
                    if (res.data.success) setFact(res.data.fact);
                })
                .catch(() => setFact(''));
        } else {
            setFact('');
        }

    }, [allCourses, input, tagParams]);

    return (
        <>
            <div className="relative md:px-36 px-8 pt-20 text-left">
                <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
                    <div>
                        <h1 className="text-4xl font-semibold text-gray-800">Course List</h1>
                        <p className="text-gray-500">
                            <span onClick={() => navigate('/')} className="text-blue-600 cursor-pointer">Home</span> / <span>Course List</span>
                        </p>
                    </div>
                    <SearchBar data={searchTerm} />
                </div>

                {(input || tags.length > 0) && (
                    <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600">
                        <p>{searchTerm}</p>
                        <img onClick={() => navigate('/course-list')} className="cursor-pointer" src={assets.cross_icon} alt="clear search" />
                    </div>
                )}

                {filteredCourse.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0">
                        {filteredCourse.map((course, index) => (
                            <CourseCard key={index} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="my-20 text-center text-gray-500">
                        <p className="text-xl">No courses found.</p>
                        <p className="mt-2 text-sm">
                            Try searching with keywords like <strong>JavaScript</strong>, <strong>React</strong>, or <strong>Fullstack</strong>.
                        </p>
                        {fact && (
                            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700 max-w-xl mx-auto rounded">
                                💡 <em>{fact}</em>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default CoursesList;
