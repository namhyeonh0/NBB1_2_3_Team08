import React, {useEffect, useState} from "react";
import axios from "../axiosInstance";
import {useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";

const Video_Url = "http://localhost:8080/video";

const UpdateVideo = () => {
    const {videoId} = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideo = async () => {
            setLoading(true);
            try {
                console.log("video id: ", videoId)
                const response = await axios.get(`${Video_Url}/${videoId}`, {withCredentials: true});
                setVideo(response.data);
                console.log(setVideo);
            } catch (error) {
                console.error("비디오 정보 가져오는 중 오류 발생:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [videoId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${Video_Url}/${videoId}`, video, {withCredentials: true});
            navigate(`/video/Instructor/${video.courseId}`); // 비디오 목록으로 이동
        } catch (error) {
            console.error("비디오 수정 중 오류 발생:", error);
        }
    };

    if (loading) return <LoadingMessage>로딩 중...</LoadingMessage>;
    if (!video) return <ErrorMessage>비디오를 찾을 수 없습니다.</ErrorMessage>;

    return (
        <FormContainer>
            <h2>비디오 수정</h2>
            <form onSubmit={handleSubmit}>
                <Label>
                    제목:
                    <Input type="text" value={video.title} onChange={(e) => setVideo({...video, title: e.target.value})}
                           required/>
                </Label>
                <Label>
                    URL:
                    <Input type="text" value={video.url} onChange={(e) => setVideo({...video, url: e.target.value})}
                           required/>
                </Label>
                <Label>
                    설명:
                    <Input type="text" value={video.description}
                           onChange={(e) => setVideo({...video, description: e.target.value})}/>
                </Label>
                <Label>
                    전체 동영상 시간:
                    <Input type="number" value={video.totalVideoDuration}
                           onChange={(e) => setVideo({...video, totalVideoDuration: e.target.value})}/>
                </Label>
                <Label>
                    현재 동영상 시간:
                    <Input type="number" value={video.currentVideoTime}
                           onChange={(e) => setVideo({...video, currentVideoTime: e.target.value})}/>
                </Label>
                <Button type="submit">수정</Button>
            </form>
        </FormContainer>
    );
};

// 스타일 컴포넌트들
const FormContainer = styled.div`
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

const Button = styled.button`
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
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

export default UpdateVideo;
