import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import styled from "styled-components";

const OtherUserPage = () => {
    const {nickname} = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem("Authorization"); // 저장된 키에 따라 변경

                const response = await fetch(`http://localhost:8080/members/other/${nickname}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, // Authorization 헤더에 토큰 추가
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data);
                } else {
                    console.error("사용자 정보 로드 실패:", response.status);
                    setErrorMessage("사용자 정보를 불러오는 데 실패했습니다.");
                }
            } catch (error) {
                console.error("API 호출 중 오류 발생:", error);
                setErrorMessage("API 호출 중 오류가 발생했습니다.");
            }
        };

        fetchUserInfo();
    }, [nickname]);

    if (!userInfo) {
        return <LoadingMessage>로딩 중...</LoadingMessage>;
    }

    return (
        <Container>
            <Title>{userInfo.nickname}의 프로필</Title>
            <AboutSection>
                <AboutTitle>자기소개</AboutTitle>
                <AboutContent>{userInfo.introduction || "자기소개가 없습니다."}</AboutContent>
            </AboutSection>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </Container>
    );
};

export default OtherUserPage;

// 스타일 컴포넌트들
const Container = styled.div`
    padding: 2rem;
`;

const Title = styled.h1`
    font-size: 2rem;
`;

const UserInfoSection = styled.div`
    margin: 1rem 0;
`;

const InfoItem = styled.p`
    margin: 0.5rem 0;
`;

const AboutSection = styled.div`
    margin: 1rem 0;
`;

const AboutTitle = styled.h2`
    font-size: 1.5rem;
`;

const AboutContent = styled.p`
    font-size: 1rem;
`;

const ErrorMessage = styled.div`
    color: red;
`;

const LoadingMessage = styled.div`
    font-size: 1.5rem;
    color: #3cb371;
`;
