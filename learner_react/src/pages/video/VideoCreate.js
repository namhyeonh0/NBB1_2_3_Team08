import React, {useEffect, useState} from "react";
import axios from "../axiosInstance";
import {useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";

const AddVideo = () => {
    const {courseId} = useParams();
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    const [memberId, setMemberId] = useState(null);
    const [role, setRole] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 사용자 역할 및 memberId 확인 (서버로 요청)
    const checkUserRole = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const response = await axios.get('/token/decode', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMemberId(response.data.mid);
                setRole(response.data.role);
            }
        } catch (error) {
            console.error("토큰 확인 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        checkUserRole();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                courseId: courseId,
                title,
                url,
                description,
                memberId,  // memberId 포함
                role       // role 포함
            };

            await axios.post('http://localhost:8080/video', payload, {withCredentials: true});

            alert("강의 생성에 성공하였습니다.");
            navigate("/courses/list");
        } catch (err) {
            setError("강좌 생성에 실패했습니다.");
            console.error("강좌 생성 중 오류:", err);
        }
    };

    return (
        <FormContainer>
            <h2>비디오 추가</h2>
            <form onSubmit={handleSubmit}>
                <Label>
                    제목:
                    <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                </Label>
                <Label>
                    URL:
                    <Input type="text" value={url} onChange={(e) => setUrl(e.target.value)} required/>
                </Label>
                <Label>
                    설명:
                    <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)}/>
                </Label>
                {error && <p style={{color: "red"}}>{error}</p>}
                <Button type="submit">추가</Button>
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

export default AddVideo;
