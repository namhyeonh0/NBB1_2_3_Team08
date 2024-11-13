import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import styled from "styled-components";
import axiosInstance from './axiosInstance';

export default function CourseNews() {
    const {courseId, newsId} = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [liked, setLiked] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userId, setUserId] = useState(null);
    const [instructorName, setInstructorName] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Loading state

    useEffect(() => {
        checkUserRole();
        fetchInstructorName();
        if (localStorage.getItem('memberId')) {
            checkLikeStatus();
        }
        fetchNewsData();
    }, [courseId, newsId]);

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

                // 서버 응답에서 사용자 역할 및 이름 설정
                setUserRole(response.data.role);  // role 설정
                setUserName(response.data.username);   // 사용자 ID 설정
                setUserId(response.data.mid);
                // console.log("User Role:", response.data.role);
                // console.log("User Name:", response.data.mid);
            }
        } catch (error) {
            console.error("토큰 확인 중 오류 발생:", error);
        }
    };


    const checkLikeStatus = async () => {
        // const memberId = localStorage.getItem('memberId');
        try {
            const response = await axiosInstance.get(`/course/${courseId}/news/${newsId}/like`, {
                params: {userId}
            });
            setLiked(response.data);
        } catch (err) {
            console.error("좋아요 상태 확인 실패:", err);
        }
    };

    const fetchNewsData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/course/${courseId}/news/${newsId}`);
            if (!response.ok) throw new Error('Failed to fetch news');
            const data = await response.json();
            setNews(data);
        } catch (err) {
            console.error("새소식 가져오기 실패:", err);
            alert('새소식을 불러오는데 실패했습니다.');
            navigate(`/courses/${courseId}`);
        }
    };


    const likeNews = async () => {
        // const memberId = localStorage.getItem('memberId');

        if (!userId) {
            alert('로그인 후 시도해주세요.');
            return;
        }

        const requestData = {
            memberId: parseInt(userId),
            newsId: parseInt(newsId)
        };

        try {
            if (liked) {
                // 좋아요 취소
                await axiosInstance.delete(`/course/${courseId}/news/${newsId}/like`, {
                    data: requestData // DELETE 요청의 경우 data 옵션으로 전달
                });
            } else {
                // 좋아요 추가
                await axiosInstance.patch(`/course/${courseId}/news/${newsId}/like`, requestData);
            }

            setLiked(!liked);
            setNews(prev => ({
                ...prev,
                likeCount: liked ? prev.likeCount - 1 : prev.likeCount + 1
            }));
        } catch (err) {
            console.error(`${liked ? '좋아요 취소 실패' : '좋아요 실패'}:`, err);
            alert('좋아요 처리 중 오류가 발생했습니다.');
        }
    };


    const deleteNews = async () => {
        if (!window.confirm('정말로 이 새소식을 삭제하시겠습니까?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/course/${courseId}/news/${newsId}`);
            alert('새소식이 성공적으로 삭제되었습니다.');
            navigate(`/courses/${courseId}`);
        } catch (err) {
            console.error("새소식 삭제 실패:", err);
            alert('새소식 삭제 중 오류가 발생했습니다.');
        }
    };

    const canCreateNews = () => {
        return (userRole === 'ROLE_INSTRUCTOR' && userName === instructorName) ||
            userRole === 'ROLE_ADMIN';
    };

    const handleUpdateNews = () => {
        if (canCreateNews()) {
            navigate(`/courses/${courseId}/news/${newsId}/edit`);
        } else {
            alert('새소식 수정은 강사 또는 관리자만 가능합니다.');
        }
    };

    if (isLoading) {
        return <div>로딩 중...</div>; // Show loading state
    }

    if (!news) {
        return <div>뉴스를 찾을 수 없습니다.</div>; // Handle the case where news is not found
    }

    return (
        <NewsContainer>
            <NewsHeader>{news.newsName}</NewsHeader>
            <NewsMetaInfo>
                <span>작성일: {new Date(news.newsDate).toLocaleDateString()}</span>
                <span>조회수: {news.viewCount}</span>
                <span>좋아요: {news.likeCount}</span>
            </NewsMetaInfo>
            <NewsContent>{news.newsDescription}</NewsContent>
            <NewsFooter>
                <span>마지막 수정일: {new Date(news.lastModifiedDate).toLocaleString()}</span>
                <ButtonContainer>
                    <LikeButton onClick={likeNews} $liked={liked}>
                        {liked ? '좋아요 취소' : '좋아요'}
                    </LikeButton>
                    {canCreateNews() && (
                        <>
                            <EditButton onClick={handleUpdateNews}>
                                수정하기
                            </EditButton>
                            <DeleteButton onClick={deleteNews}>
                                삭제하기
                            </DeleteButton>
                        </>
                    )}
                </ButtonContainer>
            </NewsFooter>
        </NewsContainer>
    );
}

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const NewsContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NewsHeader = styled.h2`
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
`;

const NewsMetaInfo = styled.div`
    display: flex;
    justify-content: space-between;
    color: #666;
    font-size: 14px;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;

    span {
        margin-right: 20px;

        &:last-child {
            margin-right: 0;
        }
    }
`;

const NewsContent = styled.div`
    font-size: 16px;
    line-height: 1.6;
    color: #333;
    margin-bottom: 20px;
    min-height: 200px;
    white-space: pre-wrap;
`;

const NewsFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #999;
    padding-top: 10px;
    border-top: 1px solid #eee;
`;

const LikeButton = styled.button`
    padding: 8px 16px;
    background-color: ${props => (props.$liked ? '#e74c3c' : '#3498db')};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: ${props => (props.$liked ? '#c0392b' : '#2980b9')};
    }
`;

const EditButton = styled.button`
    padding: 8px 16px;
    background-color: #f39c12;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #e67e22;
    }
`;

const DeleteButton = styled.button`
    padding: 8px 16px;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #c0392b;
    }
`;
