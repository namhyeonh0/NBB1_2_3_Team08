import React from "react";
import styled from "styled-components";
import {useLocation} from "react-router-dom";

const MemberDetail = () => {
    const location = useLocation();
    const {memberData} = location.state || {};

    if (!memberData) {
        return <ErrorMessage>사용자 정보를 불러오는 중 오류가 발생했습니다.</ErrorMessage>;
    }

    const profileImageSrc = memberData.profileImage
        ? `data:image/jpeg;base64,${memberData.profileImage}`
        : "http://localhost:8080/images/default_profile.jpg";

    return (
        <Container>
            <Title>{memberData.nickname}님의 프로필</Title>
            <ProfileSection>
                <ProfilePicture src={profileImageSrc} alt="Profile"/>
            </ProfileSection>
            <UserInfoSection>
                <UserInfo>
                    <InfoItem><strong>닉네임:</strong> {memberData.nickname}</InfoItem>
                    <InfoItem><strong>이메일:</strong> {memberData.email}</InfoItem>
                    <AboutSection>
                        <AboutTitle>자기소개</AboutTitle>
                        <AboutContent>{memberData.introduction || "자기소개가 없습니다."}</AboutContent>
                    </AboutSection>
                </UserInfo>
            </UserInfoSection>
        </Container>
    );
};

export default MemberDetail;

// 스타일 컴포넌트들
const Container = styled.div`
    padding: 4rem;
    max-width: 800px;
    margin: auto;
    text-align: center;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 3rem;
`;

const ProfileSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 3rem;
    position: relative;
`;

const ProfilePicture = styled.img`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    border: 5px solid #3cb371;
`;

const UserInfoSection = styled.div`
    text-align: left;
    margin-top: 2rem;
`;

const UserInfo = styled.div`
    font-size: 1.2rem;
`;

const InfoItem = styled.p`
    margin: 0.5rem 0;
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 1.5rem;
`;


const AboutSection = styled.div`
    margin: 2rem 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 1.5rem;
    background-color: #f9f9f9;
    text-align: left;
`;

const AboutTitle = styled.h2`
    font-size: 1.8rem;
    margin-bottom: 1rem;
`;

const AboutContent = styled.p`
    font-size: 1.2rem;
`;
