// PostCourseInquiry.js
import React, {useEffect, useState} from "react";
import axios from "axios";
import styled from "styled-components";
import {useNavigate, useParams} from "react-router-dom";
import axiosInstance from "./axiosInstance";

const PostCourseInquiry = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const {courseId} = useParams(); // courseId를 URL에서 가져오기
    const [setUserRole] = useState(null); // 사용자 역할 저장
    const [userId, setUserId] = useState(null); // 사용자 ID 저장
    const navigate = useNavigate(); // 성공적으로 문의 등록 후 다시 목록으로 이동

    // 컴포넌트가 처음 렌더링될 때 fetchUserRoleAndId 호출
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await fetchUserRoleAndId();
                setUserRole(userData.role);   // 사용자 역할 설정
                setUserId(userData.mid);      // 사용자 ID 설정
                //console.log(userData.role);
                //console.log(userData.mid);
            } catch (error) {
                console.error("Error fetching user role and ID:", error);
            }
        };

        fetchData();
    }, []);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const fetchUserRoleAndId = async () => {
        //console.log("fetchUserRoleAndId 함수 호출됨!");
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

    const handleSubmit = (e) => {
        e.preventDefault();

        // 로컬 스토리지에서 accessToken 가져오기
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error("로그인된 사용자의 토큰을 찾을 수 없습니다.");
            alert("로그인이 필요합니다. 로그인 후 다시 시도해 주세요.");
            return;
        }

        // POST 요청으로 문의 데이터를 서버에 전송
        axios.post(`http://localhost:8080/course/${courseId}/course-inquiry`, {
            courseId: courseId,  // 혹은 courseId만 전달되었는지 확인
            memberId: userId,  // 로컬 스토리지에서 가져온 memberId 추가
            inquiryTitle: title,  // 제목이 비어있거나 null이 아닌지 확인
            inquiryContent: content,  // 내용이 비어있지 않은지 확인
            inquiryStatus: "PENDING"  // 상태가 올바르게 설정되었는지 확인
        }, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then((response) => {
                console.log("문의 등록 성공:", response.data);
                navigate(`/courses/${courseId}`);

            })
            .catch((error) => {
                console.error("문의 등록 실패:", error);
            });
    };


    return (
        <FormContainer>
            <h2>강의에 대한 문의를 작성해주세요.</h2>
            <Form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="제목을 입력하세요"
                />
                <TextArea
                    value={content}
                    onChange={handleContentChange}
                    placeholder="내용을 입력하세요"
                />
                <ButtonContainer>
                    <CancelButton type="button" onClick={() => navigate(`/courses/${courseId}`)}>취소</CancelButton>
                    <SubmitButton type="submit">등록</SubmitButton>
                </ButtonContainer>
            </Form>
        </FormContainer>
    );
};

export default PostCourseInquiry;

const FormContainer = styled.div`
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Input = styled.input`
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1.1rem;
    width: 100%;
    box-sizing: border-box;
`;

const TextArea = styled.textarea`
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1.1rem;
    width: 100%;
    height: 300px;
    box-sizing: border-box;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
`;

const CancelButton = styled.button`
    padding: 0.75rem 1.5rem;
    background-color: #ccc;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
        background-color: #bbb;
    }
`;

const SubmitButton = styled.button`
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
