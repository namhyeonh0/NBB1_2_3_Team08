import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axiosInstance from '../axiosInstance';
import styled from "styled-components"; // axiosInstance import

const CourseNewsManagement = (props) => {
    const {courseId: propsCourseId} = props; // props에서 courseId 가져오기
    const {courseId: paramCourseId} = useParams(); // URL 파라미터에서 courseId 가져오기

    const courseId = propsCourseId || paramCourseId; // props가 있으면 props 값을, 없으면 URL 파라미터 값을 사용

    const [newsList, setNewsList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState(null);
    const [instructorName, setInstructorName] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const newsPerPage = 5;
    const navigate = useNavigate();

    // 강사 이름 가져오기
    const fetchInstructorName = async () => {
        try {
            const response = await axiosInstance.get(`/course/${courseId}/member-nickname`);
            setInstructorName(response.data);
        } catch (err) {
            console.error("Failed to fetch instructor nickname:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // 사용자 역할 확인 (서버로 요청)
    const checkUserRole = async () => {
        try {
            // 로컬 스토리지에서 JWT 토큰 가져오기
            const token = localStorage.getItem('accessToken');
            if (token) {
                const response = await axiosInstance.get('/token/decode', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                // 서버 응답에서 사용자 역할 및 이름 설정
                setUserRole(response.data.role);  // role 설정
                setUserName(response.data.mid);   // 사용자 ID 설정
                //console.log("User Role:", response.data.role);
                //console.log("User Name:", response.data.mid);
            }
        } catch (error) {
            console.error("토큰 확인 중 오류 발생:", error);
        }
    };

    // 새소식 목록 가져오기
    const fetchNews = (page) => {
        fetch(`http://localhost:8080/course/${courseId}/news?page=${page}&size=${newsPerPage}`)
            .then(res => res.json())
            .then(data => {
                setNewsList(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(err => console.error("새소식 가져오기 실패:", err));
    };

    // 페이지 로드 시 사용자 역할 확인 및 강사 이름 가져오기
    useEffect(() => {
        console.log("courseId", courseId)
        checkUserRole();
        fetchInstructorName();
    }, [courseId]);

    // 페이지 변경 시 새소식 목록 가져오기
    useEffect(() => {
        fetchNews(currentPage);
    }, [courseId, currentPage]);

    // 사용자 역할과 강사 이름이 설정된 후에 새소식 작성 가능 여부 확인
    const canCreateNews = () => {
        return (userRole === 'ROLE_INSTRUCTOR' && userName === instructorName) ||
            userRole === 'ROLE_ADMIN';
    };

    // 이전 페이지로 이동
    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    // 다음 페이지로 이동
    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    // 새소식 작성 버튼 클릭 시 처리
    const handleCreateNews = () => {
        if (isLoading) return;  // 로딩 중일 때는 처리하지 않음

        if (canCreateNews()) {
            navigate(`/courses/${courseId}/news/create`);
        } else {
            alert('새소식 등록은 강사 또는 관리자만 가능합니다.');
        }
    };

    return (
        <div>
            <div style={styles.buttonContainer}>
                <WriteButton onClick={() => navigate(`/admin/courses-management`)}>이전</WriteButton>
            </div>
            <div style={styles.newsContainer}>
                <h2 style={styles.newsHeader}>과정 새소식</h2>
                {canCreateNews() && (
                    <button onClick={handleCreateNews} style={styles.createNewsButton}>
                        새소식 등록하기
                    </button>
                )}

                <ul style={styles.newsList}>
                    {newsList.map(news => (
                        <li key={news.newsId} style={styles.newsItem}>
                            <Link
                                to={`/courses/${courseId}/news/${news.newsId}`}
                                style={styles.newsLink}
                            >
                                <span style={styles.newsTitle}>{news.newsName}</span>
                                <span style={styles.newsArrow}>→</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <div style={styles.pagination}>
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                        style={currentPage === 0 ? {...styles.paginationButton, ...styles.disabledButton} : styles.paginationButton}
                    >
                        이전
                    </button>

                    <span>{currentPage + 1} / {totalPages}</span>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1}
                        style={currentPage === totalPages - 1 ? {...styles.paginationButton, ...styles.disabledButton} : styles.paginationButton}
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    newsContainer: {
        maxWidth: '900px',
        margin: '40px auto',
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease',
    },
    newsHeader: {
        fontSize: '32px',
        color: '#333',
        marginBottom: '30px',
        borderBottom: '3px solid #007bff',
        paddingBottom: '15px',
        fontWeight: 'bold',
    },
    createNewsButton: {
        padding: '12px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '30px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        letterSpacing: '1px',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        marginBottom: '30px',
    },
    createNewsButtonHover: {
        backgroundColor: '#0056b3',
        transform: 'scale(1.05)',
    },
    newsList: {
        listStyleType: 'none',
        padding: 0,
        marginBottom: '20px',
    },
    newsItem: {
        marginBottom: '20px',
        transition: 'transform 0.3s ease',
    },
    newsItemHover: {
        transform: 'translateY(-5px)',
    },
    newsLink: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        color: '#333',
        textDecoration: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
    },
    newsLinkHover: {
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(-5px)',
    },
    newsTitle: {
        fontWeight: 'bold',
        fontSize: '18px',
    },
    newsArrow: {
        fontSize: '20px',
        color: '#007bff',
        transition: 'transform 0.3s ease',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '30px',
    },
    paginationButton: {
        padding: '12px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '30px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease, transform 0.3s ease',
        fontWeight: 'bold',
    },
    paginationButtonHover: {
        backgroundColor: '#0056b3',
        transform: 'scale(1.05)',
    },
    disabledButton: {
        backgroundColor: '#ccc',
        cursor: 'not-allowed',
    },
    paginationText: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
    },
    buttonContainer: {
        display: 'flex',
        marginLeft: '1100px',
        marginBottom: '70px',
    },
};

const WriteButton = styled.button`
    position: absolute;
    padding: 0.75rem 1.5rem;
    background-color: #3cb371;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
        background-color: #2a9d63;
    }
`;

export default CourseNewsManagement;