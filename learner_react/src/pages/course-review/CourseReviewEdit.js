import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../axiosInstance";

const CourseReviewEdit = () => {
    const {courseId, reviewId} = useParams();
    const navigate = useNavigate();

    const [reviewName, setReviewName] = useState("");
    const [reviewDetail, setReviewDetail] = useState("");
    const [rating, setRating] = useState(1);
    const [writerId, setWriterId] = useState(null); // writerId 상태 추가


    useEffect(() => {
        // /token/decode API 호출로 mid 가져오기
        axiosInstance.get('/token/decode')
            .then(response => {
                const {mid} = response.data;
                setWriterId(mid);
            })
            .catch(error => {
                console.error("Error decoding token:", error);
            });

        // 리뷰 데이터 가져오기
        fetch(`http://localhost:8080/course/${courseId}/reviews/${reviewId}`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setReviewName(data.reviewName);
                setReviewDetail(data.reviewDetail);
                setRating(data.rating);
            })
            .catch(err => console.error("리뷰 가져오기 실패:", err));
    }, [courseId, reviewId]);

    const handleSubmit = (e) => {
        const token = localStorage.getItem("accessToken");
        e.preventDefault();

        const reviewData = {
            reviewId,
            reviewName,
            reviewDetail,
            rating,
            reviewType: 'COURSE',
            writerId, // writerId 추가
            courseId,
        };

        // PUT 요청에 reviewId 포함
        fetch(`http://localhost:8080/course/${courseId}/reviews/${reviewId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reviewData),
            credentials: 'include',
        })
            .then((res) => {
                if (res.ok) {
                    alert("리뷰가 성공적으로 수정되었습니다.");
                    navigate(`/courses/${courseId}`);
                } else {
                    throw new Error("리뷰 수정 실패");
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <FormContainer>
            <h2>리뷰 수정</h2>
            <Form onSubmit={handleSubmit}>
                <InputContainer>
                    <Label>리뷰 제목:</Label>
                    <Input
                        type="text"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        required
                    />
                </InputContainer>
                <InputContainer>
                    <Label>리뷰 내용:</Label>
                    <TextArea
                        value={reviewDetail}
                        onChange={(e) => setReviewDetail(e.target.value)}
                        required
                    />
                </InputContainer>
                <InputContainer>
                    <Label>평점:</Label>
                    <Select value={rating} onChange={(e) => setRating(e.target.value)} required>
                        {[1, 2, 3, 4, 5].map((rate) => (
                            <option key={rate} value={rate}>{rate}</option>
                        ))}
                    </Select>
                </InputContainer>
                <ButtonContainer>
                    <SubmitButton type="submit">수정</SubmitButton>
                    <CancelButton type="button" onClick={() => navigate(`/courses/${courseId}`)}>취소</CancelButton>
                </ButtonContainer>
            </Form>
        </FormContainer>
    );
};

export default CourseReviewEdit;

// Styled Components
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

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Label = styled.label`
    font-size: 1rem;
    font-weight: bold;
`;

const Input = styled.input`
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;

    &:focus {
        border-color: #3cb371;
        outline: none;
    }
`;

const TextArea = styled.textarea`
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    height: 150px;
    resize: none;

    &:focus {
        border-color: #3cb371;
        outline: none;
    }
`;

const Select = styled.select`
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
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
