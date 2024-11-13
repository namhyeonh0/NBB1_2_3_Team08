import React from 'react';
import Sidebar from './Sidebar';
import CourseManagement from './CourseManagement';
import CourseCreate from '../course/CourseCreate';
import CourseInquiryList from "./CourseInquiryManagement";
import CourseNewsList from "./CourseNewsManagement";
import InquiryList from "../Inquiry/InquiryList";
import CourseUpdate from './CourseUpdateManagement';
import MemberList from './MemberListManagement';

import {Route, Routes} from 'react-router-dom';

function AdminDashboard() {
    return (
        <div style={adminDashboardStyle}>
            <div style={sidebarStyle}>
                <Sidebar/>
            </div>
            <main style={mainContentStyle}>
                <Routes>
                    <Route path="courses-management" element={<CourseManagement/>}/>
                    <Route path="courses/create" element={<CourseCreate/>}/>
                    <Route path="courses/edit/:courseId" element={<CourseUpdate/>}/>
                    <Route path="courses/inquiries/:courseId" element={<CourseInquiryList/>}/>
                    <Route path="courses/news/:courseId" element={<CourseNewsList/>}/>
                    <Route path="inquiries" element={<InquiryList/>}/>
                    <Route path="members" element={<MemberList/>}/>
                </Routes>
            </main>
        </div>
    );
}

export default AdminDashboard;


const adminDashboardStyle = {
    display: 'flex',
    height: '100vh',
};

const sidebarStyle = {
    width: '250px',
    height: '200vh',
};

const mainContentStyle = {
    flex: 1,
    padding: '20px',
    marginRight: '200px',
    width: '100%',
};
