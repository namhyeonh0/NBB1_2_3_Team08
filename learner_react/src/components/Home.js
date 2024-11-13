import React from "react";
import styled from "styled-components";

const Home = () => {
    return (
        <Container>
            <IntroSection>
                <h1>IT 왕초보부터 실무까지 인프런 로드맵 📘</h1>
                <p>코딩, 디자인, 게임, 마케팅... 모든 IT 실무지식!</p>
                <p>프로로 가는 최고의 길잡이가 되어드릴게요!</p>
            </IntroSection>
        </Container>
    );
};

export default Home;

const Container = styled.div`
    text-align: center;
`;

const IntroSection = styled.div`
    background-color: #d8f8ff;
    padding: 2rem;
`;
