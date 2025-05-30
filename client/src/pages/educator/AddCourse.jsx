import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import Quill from 'quill';
import uniqid from 'uniqid';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';

const AddCourse = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, getToken, userRole } = useContext(AppContext);

  if (userRole !== 'educator') {
    return (
        <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
          Unauthorized. Only educators can add courses.
        </div>
    );
  }


  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
    videoFile: null,
  });
  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      setShowChapterModal(true);
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
          chapters.map((chapter) =>
              chapter.chapterId === chapterId
                  ? { ...chapter, collapsed: !chapter.collapsed }
                  : chapter
          )
      );
    }
  };

  const addChapter = () => {
    if (newChapterTitle.trim()) {
      const newChapter = {
        chapterId: uniqid(),
        chapterTitle: newChapterTitle,
        chapterContent: [],
        collapsed: false,
        chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
      };
      setChapters([...chapters, newChapter]);
      setNewChapterTitle('');
      setShowChapterModal(false);
    } else {
      toast.error('Chapter title cannot be empty!');
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      setChapters(
          chapters.map((chapter) =>
              chapter.chapterId === chapterId
                  ? {
                    ...chapter,
                    chapterContent: chapter.chapterContent.filter((_, idx) => idx !== lectureIndex),
                  }
                  : chapter
          )
      );
    }
  };

  const addLecture = () => {
    const updatedChapters = chapters.map((chapter) => {
      if (chapter.chapterId === currentChapterId) {
        const newLecture = {
          ...lectureDetails,
          lectureOrder:
              chapter.chapterContent.length > 0
                  ? chapter.chapterContent[chapter.chapterContent.length - 1].lectureOrder + 1
                  : 1,
          lectureId: uniqid(),
        };

        return {
          ...chapter,
          chapterContent: [...chapter.chapterContent, newLecture],
        };
      }
      return chapter;
    });

    setChapters(updatedChapters);
    setShowPopup(false);

    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
      videoFile: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quillRef.current) return toast.error('Editor is not ready.');
    if (!image) return toast.error('Thumbnail not selected');
    if (chapters.length === 0 || chapters.some((ch) => ch.chapterContent.length === 0)) {
      return toast.error('Please add at least one lecture to every chapter');
    }

    const courseData = {
      courseTitle,
      courseDescription: quillRef.current.root.innerHTML,
      coursePrice: Number(coursePrice),
      discount: Number(discount),
      courseContent: chapters,
    };

    const formData = new FormData();
    formData.append('courseData', JSON.stringify(courseData));
    formData.append('image', image);

    chapters.forEach((chapter, chapterIndex) => {
      chapter.chapterContent.forEach((lecture, lectureIndex) => {
        if (lecture.videoFile) {
          formData.append(`video-${chapterIndex}-${lectureIndex}`, lecture.videoFile);
        }
      });
    });

    try {
      const token = await getToken();
      const { data } = await axios.post(`${backendUrl}/api/educator/add-course`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message);
        setCourseTitle('');
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        quillRef.current.root.innerHTML = '';
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
  }, []);


  return (
      <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full text-gray-500">
          <div className="flex flex-col gap-1">
            <p>Course Title</p>
            <input
                onChange={(e) => setCourseTitle(e.target.value)}
                value={courseTitle}
                type="text"
                placeholder="Type here"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
                required
            />
          </div>

          <div className="flex flex-col gap-1">
            <p>Course Description</p>
            <div ref={editorRef}></div>
          </div>

          <div className="flex items-center justify-between flex-wrap">
            <div className="flex flex-col gap-1">
              <p>Course Price</p>
              <input
                  onChange={(e) => setCoursePrice(e.target.value)}
                  value={coursePrice}
                  type="number"
                  placeholder="0"
                  className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
                  required
              />
            </div>

            <div className="flex md:flex-row flex-col items-center gap-3">
              <p>Course Thumbnail</p>
              <label htmlFor="thumbnailImage" className="flex items-center gap-3">
                <img src={assets.file_upload_icon} alt="" className="p-3 bg-blue-500 rounded" />
                <input type="file" id="thumbnailImage" onChange={(e) => setImage(e.target.files[0])} accept="image/*" hidden />
                <img className="max-h-10" src={image ? URL.createObjectURL(image) : ''} alt="" />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p>Discount %</p>
            <input
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                type="number"
                placeholder="0"
                min={0}
                max={100}
                className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
                required
            />
          </div>

          {/* Chapters */}
          <div>
            {chapters.map((chapter, chapterIndex) => (
                <div key={chapterIndex} className="bg-white border rounded-lg mb-4">
                  <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center">
                      <img
                          className={`mr-2 cursor-pointer transition-all ${chapter.collapsed && '-rotate-90'}`}
                          onClick={() => handleChapter('toggle', chapter.chapterId)}
                          src={assets.dropdown_icon}
                          width={14}
                          alt=""
                      />
                      <span className="font-semibold">{chapterIndex + 1} {chapter.chapterTitle}</span>
                    </div>
                    <span className="text-gray-500">{chapter.chapterContent.length} Lectures</span>
                    <img onClick={() => handleChapter('remove', chapter.chapterId)} src={assets.cross_icon} alt="" className="cursor-pointer" />
                  </div>
                  {!chapter.collapsed && (
                      <div className="p-4">
                        {chapter.chapterContent.map((lecture, lectureIndex) => (
                            <div key={lectureIndex} className="flex justify-between items-center mb-2">
                      <span>
                        {lectureIndex + 1} {lecture.lectureTitle} - {lecture.lectureDuration} mins -{' '}
                        <a href={lecture.lectureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                          Link
                        </a>{' '}
                        - {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                      </span>
                              <img onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)} src={assets.cross_icon} alt="" className="cursor-pointer" />
                            </div>
                        ))}
                        <div className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2" onClick={() => handleLecture('add', chapter.chapterId)}>
                          + Add Lecture
                        </div>
                      </div>
                  )}
                </div>
            ))}
            <div className="flex justify-center items-center bg-blue-500 text-white p-2 rounded-lg cursor-pointer" onClick={() => handleChapter('add')}>
              + Add Chapter
            </div>

            {/* Chapter Modal */}
            {showChapterModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                  <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-gray-800 relative">
                    <h2 className="text-lg font-semibold mb-4">Add Chapter</h2>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2 mb-4"
                        placeholder="Enter Chapter Title"
                        value={newChapterTitle}
                        onChange={(e) => setNewChapterTitle(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-4 rounded"
                          onClick={() => setShowChapterModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
                          onClick={addChapter}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
            )}

            {/* Lecture Popup */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                  <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-80">
                    <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>
                    <div className="mb-2">
                      <p>Lecture Title</p>
                      <input
                          type="text"
                          className="mt-1 block w-full border rounded py-1 px-2"
                          value={lectureDetails.lectureTitle}
                          onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <p>Duration (minutes)</p>
                      <input
                          type="number"
                          className="mt-1 block w-full border rounded py-1 px-2"
                          value={lectureDetails.lectureDuration}
                          onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <p>Lecture URL</p>
                      <input
                          type="text"
                          className="mt-1 block w-full border rounded py-1 px-2"
                          value={lectureDetails.lectureUrl}
                          onChange={(e) =>
                              setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value, videoFile: null })
                          }
                          placeholder="Paste video URL or leave blank to upload"
                      />

                      <label className="block mt-2 bg-blue-500 text-white text-sm text-center py-1.5 px-3 rounded cursor-pointer w-full">
                        {lectureDetails.videoFile ? 'Change Video' : 'Upload Video'}
                        <input
                            type="file"
                            accept="video/*"
                            hidden
                            onChange={(e) =>
                                setLectureDetails({
                                  ...lectureDetails,
                                  videoFile: e.target.files[0],
                                  lectureUrl: '',
                                })
                            }
                        />
                      </label>

                      {lectureDetails.videoFile && (
                          <p className="mt-1 text-xs text-green-600">
                            ✅ {lectureDetails.videoFile.name} selected
                          </p>
                      )}
                    </div>

                    <div className="flex gap-2 my-4">
                      <p>Is Preview Free?</p>
                      <input
                          type="checkbox"
                          className="mt-1 scale-125"
                          checked={lectureDetails.isPreviewFree}
                          onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                      />
                    </div>
                    <button type="button" className="w-full bg-blue-400 text-white px-4 py-2 rounded" onClick={addLecture}>
                      Add
                    </button>
                    <img onClick={() => setShowPopup(false)} src={assets.cross_icon} className="absolute top-4 right-4 w-4 cursor-pointer" alt="" />
                  </div>
                </div>
            )}
          </div>

          <button type="submit" className="bg-black text-white w-max py-2.5 px-8 rounded my-4">
            ADD
          </button>
        </form>
      </div>
  );
};

export default AddCourse;
