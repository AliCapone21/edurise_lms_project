import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

const CustomVideoPlayer = ({ src }) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [progress, setProgress] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [hideTimeout, setHideTimeout] = useState(null);
    const [showReplay, setShowReplay] = useState(false);
    const [replayTimeout, setReplayTimeout] = useState(null);

    const togglePlayPause = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        const video = videoRef.current;
        if (!video) return;
        const newMuted = !video.muted;
        video.muted = newMuted;
        setIsMuted(newMuted);
    };

    const handleVolumeChange = (e) => {
        e.stopPropagation();
        const val = parseFloat(e.target.value);
        const video = videoRef.current;
        if (!video) return;
        setVolume(val);
        video.volume = val;
        video.muted = val === 0;
        setIsMuted(video.muted);
    };

    const handleSpeedChange = (e) => {
        e.stopPropagation();
        const val = parseFloat(e.target.value);
        setSpeed(val);
        const video = videoRef.current;
        if (video) video.playbackRate = val;
    };

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (video?.duration) {
            const progress = (video.currentTime / video.duration) * 100;
            setProgress(progress);
        }
    };

    const handleSeek = (e) => {
        e.stopPropagation();
        const val = parseFloat(e.target.value);
        const video = videoRef.current;
        if (video?.duration) {
            video.currentTime = (val / 100) * video.duration;
            setProgress(val);
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (hideTimeout) clearTimeout(hideTimeout);
        const timeout = setTimeout(() => setShowControls(false), 2500);
        setHideTimeout(timeout);
    };

    const handleVideoEnd = () => {
        setIsPlaying(false);
        setShowReplay(true);

        const timeout = setTimeout(() => setShowReplay(false), 5000);
        setReplayTimeout(timeout);
    };

    const handleReplay = (e) => {
        e.stopPropagation();
        const video = videoRef.current;
        if (video) {
            video.currentTime = 0;
            video.play();
            setShowReplay(false);
            setIsPlaying(true);
            if (replayTimeout) clearTimeout(replayTimeout);
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.volume = volume;
            video.playbackRate = speed;
            video.muted = isMuted;
        }

        const container = containerRef.current;
        container?.addEventListener('mousemove', handleMouseMove);

        return () => {
            container?.removeEventListener('mousemove', handleMouseMove);
            if (hideTimeout) clearTimeout(hideTimeout);
            if (replayTimeout) clearTimeout(replayTimeout);
        };
    }, [volume, speed, hideTimeout, isMuted, replayTimeout]);

    return (
        <div
            ref={containerRef}
            className="w-full aspect-video bg-black relative overflow-hidden rounded"
            onClick={togglePlayPause}
        >
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnd}
                onContextMenu={(e) => e.preventDefault()}
                controls={false}
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
            />

            {/* Replay Overlay */}
            {showReplay && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-xl font-semibold cursor-pointer animate-fade"
                    onClick={handleReplay}
                >
                    ▶ Rewatch Video
                </div>
            )}

            {/* Controls */}
            <div
                className={`absolute bottom-0 left-0 w-full bg-black/70 px-4 py-2 transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full"
                    onClick={(e) => e.stopPropagation()}
                />

                <div className="flex justify-between items-center mt-2 text-white text-sm">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePlayPause();
                        }}
                        className="text-white text-xl"
                    >
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>



                    <div className="flex items-center gap-3">
                        <button onClick={toggleMute} className="text-white text-xl">
                            {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                        </button>

                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={handleVolumeChange}
                            onClick={(e) => e.stopPropagation()}
                        />

                        <select
                            value={speed}
                            onChange={handleSpeedChange}
                            className="bg-gray-800 text-white px-1 rounded"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <option value={0.5}>0.5x</option>
                            <option value={1}>1x</option>
                            <option value={1.5}>1.5x</option>
                            <option value={2}>2x</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomVideoPlayer;
