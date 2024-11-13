import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../axiosInstance";

const Course_Url = "http://localhost:8080/course";

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();
    const [memberId, setMemberId] = useState(null);
    const [memberNickname, setMemberNickname] = useState(null);

    // 사용자 역할 및 memberId 확인 (서버로 요청)
    const checkUserRole = async () => {
        try {
            const token = localStorage.getItem('accessToken');

            if (token) {
                const response = await axiosInstance.get('/token/decode', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("서버 응답:", response.data); // 응답 로그 추가
                setRole(response.data.role);
                setMemberId(response.data.mid);
                setMemberNickname(response.data.username);
            } else {
                console.error("토큰이 존재하지 않습니다.");
            }
        } catch (error) {
            console.error("토큰 확인 중 오류 발생:", error);
            setError("사용자 정보를 가져오는 데 실패했습니다.");
        }
    };


    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                console.log("닉네임 확인 :", memberNickname);
                const response = await axiosInstance.get(`/course/instructor/list/${memberNickname}`, {withCredentials: true});
                setCourses(response.data);
            } catch (error) {
                console.error("강좌 목록 가져오는 중 오류 발생:", error);
                setError("강좌 목록을 가져오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses(); // 강좌 목록 가져오기
    }, [memberNickname]); // memberNickname이 변경될 때마다 fetchCourses 실행

    useEffect(() => {
        checkUserRole(); // 컴포넌트가 마운트될 때 사용자 역할 확인
    }, []);

    const handleUpdateClick = (courseId) => {
        navigate(`/courses/update/${courseId}`);
    };

    const handleDeleteClick = async (courseId) => {
        if (window.confirm("정말로 이 강좌를 삭제하시겠습니까?")) {
            try {
                await axiosInstance.delete(`/course/${courseId}`, {withCredentials: true});
                console.log("삭제")
                setCourses(courses.filter(course => course.courseId !== courseId));
            } catch (error) {
                console.error("강좌 삭제 중 오류 발생:", error);
                const errorMessage = error.response?.data?.message || "강좌를 삭제하는 데 실패했습니다.";
                setError(errorMessage);
            }
        }
    };

    const handleCourseDetailClick = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    const handleVideoEditClick = (courseId) => {
        navigate(`/video/Instructor/${courseId}`);
    };

    if (loading) return <LoadingMessage>로딩 중...</LoadingMessage>;
    if (error) return <ErrorMessage>{error}</ErrorMessage>;

    return (
        <CourseListContainer>
            <Header>강좌 목록</Header>
            {role === "ROLE_INSTRUCTOR" ? (
                <Link to="/courses/create">
                    <StyledButton primary>강좌 생성</StyledButton>
                </Link>
            ) : (
                <p>강좌 생성을 위해 강사로 로그인해주세요.</p>
            )}
            {courses.length > 0 ? (
                courses.map(course => (
                    <CourseItem key={course.courseId}>
                        <CourseDetails>
                            <p>강좌 ID: <strong>{course.courseId}</strong></p>
                            <p>강좌 이름: <strong>{course.courseName}</strong></p>
                            <p>등록 날짜: <strong>{new Date(course.createdAt).toLocaleDateString()}</strong></p>
                        </CourseDetails>
                        <ButtonContainer>
                            <StyledButton onClick={() => handleUpdateClick(course.courseId)} secondary>수정</StyledButton>
                            <StyledButton onClick={() => handleDeleteClick(course.courseId)} delete>삭제</StyledButton>
                            <StyledButton onClick={() => handleCourseDetailClick(course.courseId)}>상세정보</StyledButton>
                            <StyledButton onClick={() => handleVideoEditClick(course.courseId)} secondary>비디오
                                수정</StyledButton>
                        </ButtonContainer>
                    </CourseItem>
                ))
            ) : (
                <p>강좌가 없습니다.</p>
            )}
        </CourseListContainer>
    );
};

// 스타일 컴포넌트들
const CourseListContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h2`
    text-align: center;
    color: #333;
    margin-bottom: 1.5rem;
`;

const LoadingMessage = styled.p`
    text-align: center;
    color: #007bff;
`;

const ErrorMessage = styled.p`
    text-align: center;
    color: red;
    font-weight: bold;
`;

const CourseItem = styled.div`
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 1rem;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CourseDetails = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
`;

const StyledButton = styled.button`
    padding: 0.5rem 1rem;
    background-color: ${props =>
            props.primary ? "#007bff" :
                    props.secondary ? "#6c757d" :
                            props.delete ? "#dc3545" : "#28a745"
    };
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: ${props =>
                props.primary ? "#0056b3" :
                        props.secondary ? "#5a6268" :
                                props.delete ? "#c82333" : "#218838"
        };
    }
`;

export default CourseList;
