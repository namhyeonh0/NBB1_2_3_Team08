// Instructor.js
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import InstructorReview from "./instructor-review/InstructorReview"; // Import your list

const defaultImage = "/images/instructor_default_img.png";

const Instructor = () => {
    const {nickname} = useParams();
    const [instructor, setInstructor] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("Authorization"); // 로컬 스토리지에서 토큰 가져오기

        // 강사 정보를 가져오기
        axios.get(`http://localhost:8080/members/instructor/${nickname}`, {
            headers: {
                Authorization: `Bearer ${token}` // Authorization 헤더에 토큰 추가
            },
            credentials: 'include',
        })
            .then((response) => {
                setInstructor(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError("강사 정보를 가져오는 데 오류가 발생했습니다.");
                setLoading(false);
            });

        // 강사 리뷰 목록 가져오기
        axios.get(`http://localhost:8080/members/instructor/${nickname}/reviews/list`, {
            headers: {
                Authorization: `Bearer ${token}` // 리뷰 목록 가져올 때도 토큰 추가
            },
            credentials: 'include',
        })
            .then((response) => {
                setReviews(response.data);
            })
            .catch((error) => {
                setError("리뷰 목록을 가져오는 데 오류가 발생했습니다.");
            });
    }, [nickname]);


    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const profileImageSrc = instructor?.profileImage
        ? `data:image/jpeg;base64,${instructor.profileImage}`
        : "http://localhost:8080/images/default_profile.jpg";

    return (
        <PageContainer>
            {instructor && (
                <InstructorInfo>
                    <InstructorImage
                        src={profileImageSrc} // Base64 이미지 소스 사용
                        alt="Instructor Image"
                    />
                    <InstructorDetails>
                        <InstructorName>{instructor.nickname}</InstructorName>
                        <InstructorBio>{instructor.introduction}</InstructorBio>
                    </InstructorDetails>
                </InstructorInfo>
            )}
            {/* 리뷰 목록을 InstructorReviewList로 전달 */}
            <InstructorReview reviews={reviews}/>
        </PageContainer>
    );
};

export default Instructor;

// 스타일 컴포넌트들

const PageContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
`;

const InstructorInfo = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem; /* 추가된 마진으로 강사 정보와 리뷰 목록 분리 */
`;

const InstructorImage = styled.img`
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 50%;
`;

const InstructorDetails = styled.div`
    margin-left: 1rem;
`;

const InstructorName = styled.h2`
    font-size: 2rem;
    margin: 0; /* 제목의 기본 마진 제거 */
`;

const InstructorBio = styled.p`
    font-size: 1.2rem;
    color: #555;
    margin: 0; /* 본문의 기본 마진 제거 */
`;
