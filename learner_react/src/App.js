import React, {useState} from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import Courses from "./pages/Courses";
import SignUp from "./pages/SignUp";
import LoginModal from "./components/LoginModal";
import PostCourseInquiry from "./pages/PostCourseInquiry"
import CourseNews from "./pages/CourseNews";
import MyPage from "./pages/MyPage";
import CreateNews from "./pages/CreateNews";
import UpdateNews from "./pages/UpdateNews";
import EditProfile from './components/EditProfile';
import Instructor from "./pages/Instructor";
import CourseReviewCreate from "./pages/course-review/CourseReviewCreate";
import CourseReviewEdit from "./pages/course-review/CourseReviewEdit";
import InstructorReviewCreate from "./pages/instructor-review/InstructorReviewCreate";
import InstructorReviewEdit from "./pages/instructor-review/InstructorReviewEdit";
import CourseRoutes from './CourseRoutes';
import OrderRoutes from "./OrderRoutes";
import VideoRoutes from "./VideoRoutes";
import YoutubePlayer from "./components/YoutubePlayer";
import ResetPassword from "./components/ResetPassword"; // ResetPassword 컴포넌트 가져오기
import MyCourses from './pages/MyCourses';
import InquiryList from "./pages/Inquiry/InquiryList";
import InquiryDetail from "./pages/Inquiry/InquiryDetail";
import InquiryRegistration from "./pages/Inquiry/InquiryRegistration";
import MemberDetail from './pages/MemberDetail';
import OtherUserPage from "./pages/OtherUserPage";
import {NotificationProvider} from "./components/NotificationContext";
import SendNotificationComponent from "./components/SendNotification"; // 컴포넌트 가져오기
import NotificationDisplay from "./components/NotificationDisplay";
import axios from "axios";
import AttendanceCheck from "./components/attendance/AttendanceCheck";
import Chat from "./components/Chat";
import AlarmRoutes from "./AlarmRoutes";
import AdminDashboard from './pages/admin/AdminDashboard';

axios.defaults.withCredentials = true;

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <NotificationProvider>
            <Router>
                <AttendanceCheck/>
                <Header openModal={openModal}/>
                {isModalOpen && <LoginModal closeModal={closeModal}/>}
                <Routes>
                    <Route path="/" element={<Navigate to="/courses"/>}/>
                    <Route path="/signup" element={<SignUp/>}/>
                    <Route path="/courses" element={<Courses/>}/> {/* 수정된 경로 */}
                    <Route path="/courses/:courseId/post" element={<PostCourseInquiry/>}/>
                    <Route path="/courses/:courseId/news/:newsId" element={<CourseNews/>}/>
                    <Route path="/내정보" element={<MyPage/>}/>
                    <Route path="/courses/:courseId/news/create" element={<CreateNews/>}/>
                    <Route path="/courses/:courseId/news/:newsId/edit" element={<UpdateNews/>}/>
                    <Route path="/edit-profile" element={<EditProfile/>}/>
                    <Route path="/courses/:courseId/reviews/create" element={<CourseReviewCreate/>}/>
                    <Route path="/courses/:courseId/reviews/:reviewId" element={<CourseReviewEdit/>}/>
                    <Route path="/members/instructor/:nickname" element={<Instructor/>}/>
                    <Route path="/members/instructor/:nickname/reviews/create" element={<InstructorReviewCreate/>}/>
                    <Route path="/members/instructor/:nickname/reviews/:reviewId" element={<InstructorReviewEdit/>}/>
                    <Route path="/video/:videoId/play" element={<YoutubePlayer/>}/> {/* 추가된 부분 */}
                    <Route path="/*" element={<CourseRoutes/>}/> {/* 모든 하위 경로를 CourseRoutes로 전달 */}
                    <Route path="/orders/*" element={<OrderRoutes/>}/>
                    <Route path="/video/*" element={<VideoRoutes/>}/> {/* 비디오 관련 라우팅 추가 */}
                    <Route path="/members/instructor/:nickname/reviews/create"
                           element={<InstructorReviewCreate/>}/> {/* 강사 리뷰 생성 페이지 */}
                    <Route path="/members/instructor/:nickname/reviews/:reviewId"
                           element={<InstructorReviewEdit/>}/> {/* 강사 리뷰 수정 페이지 */}
                    <Route path="/reset-password/:uuid" element={<ResetPassword/>}/> {/* 비밀번호 변경 */}
                    <Route path="/my-courses" element={<MyCourses/>}/>
                    <Route path="/inquiries" element={<InquiryList/>}/>
                    <Route path="/inquiries/new" element={<InquiryRegistration/>}/>
                    <Route path="/inquiries/:inquiryId" element={<InquiryDetail/>}/>
                    <Route path="/members/:memberId" element={<MemberDetail/>}/>
                    <Route path="/members/other/:nickname" element={<OtherUserPage/>}/>
                    <Route path="/alarm/send" element={<SendNotificationComponent/>}/>
                    <Route path="/alarm/display" element={<NotificationDisplay/>}/>
                    <Route path="/chat" element={<Chat/>}/>
                    <Route path="/alarm/*" element={<AlarmRoutes/>}/>
                    <Route path="/admin/*" element={<AdminDashboard/>}/>
                </Routes>
            </Router>
        </NotificationProvider>
    );
}

export default App;

