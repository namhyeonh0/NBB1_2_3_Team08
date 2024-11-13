import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from "./axiosInstance";

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    const [memberId, setMemberId] = useState(null);

    // 사용자 역할 및 memberId 확인 (서버로 요청)
    const checkUserRole = async () => {
        try {
            const token = localStorage.getItem('accessToken');

            if (token) {
                // Authorization 헤더에 JWT 토큰 추가
                const response = await axiosInstance.get('/token/decode', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // 서버 응답에서 사용자 ID 설정
                setMemberId(response.data.mid); // memberId 설정
            }
        } catch (error) {
            console.error("토큰 확인 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        // memberId가 설정된 이후에 강좌 목록을 가져오기 위해 checkUserRole을 호출하고 이후 fetchCourses 실행
        checkUserRole();
    }, []);

    useEffect(() => {
        // memberId가 설정된 후에만 강좌 목록을 가져옴
        if (memberId) {
            const fetchCourses = async () => {
                try {
                    const response = await axiosInstance.get(`/course/${memberId}/list`, {withCredentials: true});
                    setCourses(response.data);
                    console.log(response.data); // 받아온 강좌 데이터 확인
                } catch (error) {
                    console.error('Error fetching courses:', error);
                }
            };
            fetchCourses();
        }
    }, [memberId]); // memberId가 변경될 때만 실행되도록 의존성 추가

    const handleCourseClick = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>내 수강 정보</h1>
            {courses.length > 0 ? (
                <ul style={styles.courseList}>
                    {courses.map((course, index) => (
                        <li key={index} style={styles.courseItem}>
                            <div onClick={() => handleCourseClick(course.courseId)} style={styles.courseLink}>
                                <div>
                                    <span style={styles.courseName}>{course.courseName}</span>
                                    <p style={styles.instructor}>강사: <span
                                        style={styles.instructorName}>{course.instructor}</span></p>
                                    <p style={styles.purchaseDate}>구매일: <span
                                        style={styles.purchaseDateText}>{new Date(course.purchaseDate).toLocaleDateString()}</span>
                                    </p>
                                </div>
                                <span style={styles.courseArrow}>→</span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>수강 중인 과정이 없습니다.</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '40px auto',
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    },
    header: {
        fontSize: '32px',
        color: '#333',
        marginBottom: '20px',
        borderBottom: '3px solid #007bff',
        paddingBottom: '10px',
        fontWeight: 'bold',
    },
    courseList: {
        listStyleType: 'none',
        padding: 0,
    },
    courseItem: {
        marginBottom: '20px',
        transition: 'transform 0.3s ease',
    },
    courseLink: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        color: '#333',
        textDecoration: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        cursor: 'pointer',
    },
    instructor: {
        margin: '5px 0',
        fontSize: '16px',
        color: '#555',
    },
    instructorName: {
        color: '#007bff',
    },
    purchaseDate: {
        margin: '5px 0',
        fontSize: '14px',
        color: '#777',
        paddingLeft: '5px',
    },
    purchaseDateText: {
        fontWeight: 'normal',
    },
    courseName: {
        fontWeight: 'bold',
        fontSize: '18px',
    },
    courseArrow: {
        fontSize: '20px',
        color: '#007bff',
        transition: 'transform 0.3s ease',
    },
    courseItemHover: {
        backgroundColor: '#e0e0e0',
    },
};

export default MyCourses;
