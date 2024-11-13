import React from 'react';
import {Route, Routes} from 'react-router-dom';
import VideoList from './pages/video/VideoList'; // 비디오 목록 페이지
import VideoCreate from "./pages/video/VideoCreate";
import VideoUpdate from "./pages/video/VideoUpdate"; // 비디오 수정 페이지
import VideoInstructor from "./pages/video/VideoInstructor";

const VideoRoutes = () => (
    <Routes>
        <Route path="/:courseId" element={<VideoList/>}/>
        <Route path="/create/:courseId" element={<VideoCreate/>}/> {/* 비디오 추가 */}
        <Route path="/update/:videoId" element={<VideoUpdate/>}/> {/* 비디오 수정 */}
        <Route path="/Instructor/:courseId" element={<VideoInstructor/>}/>{/*강사 비디오 수정*/}
    </Routes>
);

export default VideoRoutes;
