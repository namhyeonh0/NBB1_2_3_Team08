import React, {useEffect, useState} from "react";
import axios from "../axiosInstance";
import axiosInstance from "../axiosInstance"; // axiosInstance import 추가
import {useNavigate} from "react-router-dom";
import styled from "styled-components";

const Course_Url = "http://localhost:8080/course";

const CourseCreate = () => {
    const [courseName, setCourseName] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [coursePrice, setCoursePrice] = useState(0);
    const [courseLevel, setCourseLevel] = useState(1); // 기본값 1
    const [courseAttribute, setCourseAttribute] = useState("");
    const [memberNickname, setMemberNickname] = useState(null); // memberNickname 상태 추가
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 사용자 역할 및 memberNickname 확인 (서버로 요청)
    const checkUserRole = async () => {
        try {
            const token = localStorage.getItem('accessToken');

            if (token) {
                const response = await axiosInstance.get('/token/decode', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("서버 응답:", response.data); // 응답 로그 추가
                setMemberNickname(response.data.username); // memberNickname 설정
            } else {
                console.error("토큰이 존재하지 않습니다.");
                setError("로그인이 필요합니다.");
            }
        } catch (error) {
            console.error("토큰 확인 중 오류 발생:", error);
            setError("사용자 정보를 가져오는 데 실패했습니다.");
        }
    };

    // 컴포넌트가 마운트될 때 사용자 역할 확인
    useEffect(() => {
        checkUserRole();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!memberNickname) {
                throw new Error("회원 닉네임이 설정되어 있지 않습니다.");
            }

            const payload = {
                courseName,
                courseDescription,
                coursePrice,
                courseLevel,
                courseAttribute,
                memberNickname, // memberNickname 사용
            };

            await axios.post(Course_Url, payload, {withCredentials: true});

            // 성공 메시지와 페이지 리디렉션
            alert("강의 생성에 성공하였습니다.");
            navigate("/courses/list");
        } catch (err) {
            setError("강좌 생성에 실패했습니다.");
        }
    };

    return (
        <Container>
            <h2>강좌 생성</h2>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <form onSubmit={handleSubmit}>
                <Label>
                    강좌 이름:
                    <Input
                        type="text"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        required
                    />
                </Label>
                <Label>
                    강사 이름:
                    <Input
                        type="text"
                        value={memberNickname}
                        onChange={(e) => setMemberNickname(e.target.value)}
                        required
                    />
                </Label>
                <Label>
                    강좌 설명:
                    <Input
                        type="text"
                        value={courseDescription}
                        onChange={(e) => setCourseDescription(e.target.value)}
                        required
                    />
                </Label>

                <Label>
                    강좌 가격:
                    <Input
                        type="number"
                        value={coursePrice}
                        onChange={(e) => setCoursePrice(Number(e.target.value))}
                        required
                    />
                </Label>

                <Label>
                    강좌 레벨:
                    <Input
                        type="number"
                        value={courseLevel}
                        onChange={(e) => setCourseLevel(Number(e.target.value))}
                        min="1"
                        max="5"
                        required
                    />
                </Label>
                <Label>
                    강좌 과목:
                    <Input
                        type="text"
                        value={courseAttribute}
                        onChange={(e) => setCourseAttribute(e.target.value)}
                        required
                    />
                </Label>

                <Button type="submit">생성</Button>
            </form>
        </Container>
    );
};

export default CourseCreate;

const Container = styled.div`
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    background: #f9f9f9;
    border-radius: 8px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 1rem;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.5rem;
`;

const Button = styled.button`
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

const ErrorMessage = styled.p`
    color: red;
    font-weight: bold;
`;
