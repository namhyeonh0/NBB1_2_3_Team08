import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "../axiosInstance";
import styled from "styled-components";
import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";

const Course_Url = "http://localhost:8080/course";
const Video_Url = "http://localhost:8080/video";

const VideoList = () => {
    const {courseId} = useParams();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [setRole] = useState(null);
    const [setMemberNickName] = useState(null);

    useEffect(() => {
        const decodeJwt = (token) => {
            try {
                return jwtDecode(token);
            } catch (error) {
                console.error("JWT 디코딩 오류:", error);
                return null;
            }
        };

        const token = Cookies.get("Authorization");
        if (token) {
            const decodedToken = decodeJwt(token);
            setRole(decodedToken?.role);
            setMemberNickName(decodedToken?.mid);
        }

        const fetchVideos = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${Course_Url}/video/${courseId}`, {withCredentials: true});
                setVideos(response.data);
            } catch (error) {
                console.error("비디오 목록 가져오는 중 오류 발생:", error.response ? error.response.data : error.message);
                setError("비디오 목록을 가져오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [courseId]);

    const handleDeleteClick = async (videoId) => {
        if (window.confirm("정말로 이 비디오를 삭제하시겠습니까?")) {
            try {
                await axios.delete(`${Video_Url}/${videoId}`, {withCredentials: true});
                setVideos(videos.filter(video => video.videoId !== videoId));
            } catch (error) {
                console.error("비디오 삭제 중 오류 발생:", error);
                setError("비디오 삭제에 실패했습니다.");
            }
        }
    };

    if (loading) return <Message>로딩 중...</Message>;
    if (error) return <Message $error>{error}</Message>;

    return (
        <Container>
            <Header>비디오 목록</Header>
            <Link to={`/video/create/${courseId}`}>
                <StyledButton>비디오 추가</StyledButton>
            </Link>
            {videos.length > 0 ? (
                videos.map((video, index) => (
                    <VideoItem key={video.videoId}>
                        <VideoInfo>
                            <Title>{index + 1}. {video.description}</Title>
                        </VideoInfo>
                        <ButtonContainer>
                            <StyledButton onClick={() => navigate(`/video/update/${video.videoId}`)}>수정</StyledButton>
                            <StyledButton onClick={() => handleDeleteClick(video.videoId)}>삭제</StyledButton>
                        </ButtonContainer>
                    </VideoItem>
                ))
            ) : (
                <Message>비디오가 없습니다.</Message>
            )}

        </Container>
    );
};

// 스타일 컴포넌트
const Container = styled.div`
    max-width: 700px;
    margin: 0 auto;
    padding: 2rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Header = styled.h2`
    text-align: center;
    color: #222;
    margin-bottom: 2rem;
    font-size: 1.8rem;
    font-weight: bold;
`;

const Message = styled.p`
    text-align: center;
    color: ${(props) => (props.$error ? "#e74c3c" : "#007bff")};
    font-size: 1.2rem;
`;

const VideoItem = styled.div`
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 6px;
    margin-bottom: 1rem;
    background-color: #f7f7f7;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
`;

const VideoInfo = styled.div`
    flex: 1;
`;

const Title = styled.h3`
    font-size: 1.2rem;
    color: #333;
    margin: 0;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px; // 버튼 간 간격
`;

const StyledButton = styled.button`
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0056b3;
    }
`;

export default VideoList;
