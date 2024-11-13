import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../axiosInstance"; // axios 직접 import


const InstructorReviewCreate = () => {
    const {nickname} = useParams();
    const navigate = useNavigate();

    const [reviewName, setReviewName] = useState("");
    const [reviewDetail, setReviewDetail] = useState("");
    const [rating, setRating] = useState(1);
    const [memberId] = useState(1); // 예시로 하드코딩된 memberId
    const [courses, setCourses] = useState([]); // 강의 목록 상태
    const [selectedCourseId, setSelectedCourseId] = useState(""); // 선택한 강의 ID
    const [writerId, setWriterId] = useState(null); // 토큰에서 가져온 memberId 저장

    // useEffect를 통해 로그인한 사용자의 정보를 로컬 스토리지에서 가져옴
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
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch("http://localhost:8080/course/list"); // 강의 목록 API 엔드포인트
                if (!response.ok) throw new Error("강의 목록을 가져오는 데 실패했습니다.");
                const data = await response.json();
                console.log(data)
                const filteredCourses = data.filter(course => course.memberNickname === nickname);
                console.log(filteredCourses); // 데이터 확인
                setCourses(filteredCourses);
            } catch (error) {
                console.error(error);
                alert("강의 목록을 가져오는 중 오류가 발생했습니다.");
            }
        };

        fetchCourses();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const reviewData = {
            reviewName,
            reviewDetail,
            rating,
            memberId,
            writerId, // 로그인된 사용자의 memberId
            nickname,
            courseId: selectedCourseId, // 선택한 강의 ID 추가
        };

        const token = localStorage.getItem("accessToken"); // 토큰 가져오기

        const endpoint = `http://localhost:8080/members/instructor/${nickname}/reviews/create`;

        fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Authorization 헤더에 토큰 추가
            },
            body: JSON.stringify(reviewData),
            credentials: 'include',
        })
            .then((res) => {
                if (res.ok) {
                    alert("리뷰가 성공적으로 등록되었습니다.");
                    navigate(`/members/instructor/${nickname}`);
                } else {
                    res.json().then((data) => {
                        alert(data.message || "로그인한 사용자만 리뷰 등록 가능합니다");
                    });
                    throw new Error("로그인한 사용자만 리뷰 등록 가능합니다");
                }
            })
            .catch((err) => {
                console.error(err);
                alert("리뷰 등록 중 오류가 발생했습니다.");
            });
    };

    return (
        <FormContainer>
            <h2>강사 리뷰 작성</h2>
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
                <InputContainer>
                    <Label>강의 선택:</Label>
                    <Select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} required>
                        <option value="">강의를 선택하세요</option>
                        {courses.map((course) => (
                            <option key={course.courseId} value={course.courseId}>
                                {course.courseName} {/* courseName을 사용하여 강의 이름 표시 */}
                            </option>
                        ))}
                    </Select>
                </InputContainer>
                <ButtonContainer>
                    <SubmitButton type="submit">등록</SubmitButton>
                    <CancelButton type="button"
                                  onClick={() => navigate(`/members/instructor/${nickname}`)}>취소</CancelButton>
                </ButtonContainer>
            </Form>
        </FormContainer>
    );
};

export default InstructorReviewCreate;

// Styled Components는 기존 코드와 동일

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
        border-color: #3cb371; /* 포커스 시 색상 변경 */
        outline: none; /* 포커스 아웃라인 제거 */
    }
`;

const TextArea = styled.textarea`
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    height: 150px; /* 높이를 적절히 조정 */
    resize: none; /* 크기 조절 비활성화 */

    &:focus {
        border-color: #3cb371; /* 포커스 시 색상 변경 */
        outline: none; /* 포커스 아웃라인 제거 */
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
