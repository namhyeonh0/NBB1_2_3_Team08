import React from 'react';
import {Route, Routes} from 'react-router-dom';
import CourseList from './pages/course/CourseList';
import CourseCreate from './pages/course/CourseCreate';
import CourseUpdate from './pages/course/CourseUpdate';
import CourseDetail from './pages/course/CourseDetail';

const CourseRoutes = () => (
    <Routes>
        <Route path="/courses/list" element={<CourseList/>}/>
        <Route path="/courses/create" element={<CourseCreate/>}/>
        <Route path="/courses/update/:courseId" element={<CourseUpdate/>}/>
        <Route path="/courses/:courseId" element={<CourseDetail/>}/>
    </Routes>
);

export default CourseRoutes;
