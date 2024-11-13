import React, {useEffect, useState} from "react";
import axios from "axios";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import axiosInstance from "../axiosInstance";

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [userRole, setUserRole] = useState(null); // 사용자 역할 저장
    const [userId, setUserId] = useState(null); // 사용자 ID 저장
    const navigate = useNavigate();

    useEffect(() => {
        // 강의 목록 가져오기
        axios.get("http://localhost:8080/course/list")
            .then((response) => {
                const camelCasedData = response.data.map(course => ({
                    ...course,
                    courseCreatedDate: course.course_created_date // 키 변경
                }));
                setCourses(camelCasedData);
                return fetchUserRoleAndId()
            }).then((userData) => {
            setUserRole(userData.role);   // 사용자 역할 설정
            setUserId(userData.mid);      // 사용자 ID 설정
            //console.log(userData.role);
            //console.log(userData.mid);
        })
            .catch((error) => {
                console.error("Error fetching the courses:", error);
            });
    }, []);

    // JWT 토큰에서 사용자 역할과 ID를 추출
    const fetchUserRoleAndId = async () => {
        //console.log("fetchUserRoleAndId 함수 호출됨");
        const token = localStorage.getItem('accessToken');

        if (!token) {
            throw new Error("Token not found");
        }

        try {
            const response = await axiosInstance.get('/token/decode', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data;
            return {
                mid: data.mid,
                role: data.role,
                username: data.username
            };

        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    };

    const handleDelete = async (courseId) => {
        if (window.confirm("정말 이 강의를 삭제하시겠습니까?")) {
            try {
                const response = await axios.delete(`http://localhost:8080/course/${courseId}`
                    , {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });
                if (response.status === 200) {
                    setCourses((prevCourses) => prevCourses.filter(course => course.courseId !== courseId));
                    alert(response.data.success); // "강좌가 삭제되었습니다." 메시지 표시
                }
            } catch (error) {
                console.error("Error deleting the course:", error);
                if (error.response && error.response.status === 404) {
                    alert("강의를 찾을 수 없습니다.");
                } else {
                    alert("강의 삭제에 실패했습니다.");
                }
            }
        }
    };

    const handleEdit = (courseId) => {
        navigate(`/admin/courses/edit/${courseId}`);
    };

    const handleInquiryManagement = (courseId) => {
        navigate(`/admin/courses/inquiries/${courseId}`);
    };

    const handleNewsManagement = (courseId) => {
        if (!courseId) {
            console.error("courseId가 undefined입니다.");
            return;
        }
        console.log("courseId is ", courseId);
        navigate(`/admin/courses/news/${courseId}`)
    }
    return (
        <CoursePage>
            <CourseList>
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <CourseItem key={course.courseId}>
                            <CourseInfo>
                                <h3
                                    onClick={() => navigate(`/courses/${course.courseId}`)}
                                    style={{cursor: 'pointer', color: 'blue'}}
                                >   {course.courseName}
                                </h3>
                                <p>강사명: {course.memberNickname}</p>
                                <p>강의 아이디: {course.courseId}</p>
                            </CourseInfo>
                            <ButtonContainer>
                                <EditButton onClick={() => handleEdit(course.courseId)}>강좌 수정</EditButton>
                                <CourseButton onClick={() => navigate(`/video/${course.courseId}`)}>비디오
                                    보기</CourseButton>
                                <InquiryButton onClick={() => {
                                    handleInquiryManagement(course.courseId)
                                }}>문의 관리</InquiryButton>
                                <NewsButton onClick={() => handleNewsManagement(course.courseId)}>새소식 관리</NewsButton>
                                <DeleteButton onClick={() => handleDelete(course.courseId)}>삭제</DeleteButton>
                            </ButtonContainer>
                        </CourseItem>
                    ))
                ) : (
                    <p>등록된 강의가 없습니다.</p>
                )}
            </CourseList>
        </CoursePage>
    );
};

export default CourseManagement;

// 스타일 코드
const CoursePage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    margin-right: 120px;
`;

const CourseList = styled.div`
    width: 100%;
    max-width: 600px;
`;

const CourseItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border: 1px solid #ddd;
    margin-bottom: 1rem;
    border-radius: 5px;
    width: 100%;
    min-width: 700px;
`;

const CourseInfo = styled.div`
    display: flex;
    flex-direction: column;

    h3 {
        margin: 0;
        font-size: 1.2rem;
    }

    p {
        margin: 0.2rem 0;
        font-size: 0.9rem;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const EditButton = styled.button`
    background-color: #4CAF50;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #45a049;
    }
`;

const CourseButton = styled.button`
    background-color: #2196F3;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #1976D2;
    }
`;

const InquiryButton = styled.button`
    background-color: #FFC107;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #FFA000;
    }
`;

const NewsButton = styled.button`
    background-color: #ac07ff;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #8400ff;
    }
`;

const DeleteButton = styled.button`
    background-color: #f44336;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #d32f2f;
    }
`;
