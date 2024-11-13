import React, {useState} from "react";
import styled from "styled-components";
import FindEmail from "./FindEmail";
import PasswordSendEmail from "./PasswordSendEmail";

const LoginModal = ({closeModal}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showFindEmail, setShowFindEmail] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();

        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData.toString(), // URL 인코딩된 데이터
                credentials: "include",
            });

            if (response.ok) {
                const {memberId, accessToken} = await response.json();
                console.log("로그인 성공, memberId:", memberId);
                localStorage.setItem("memberId", memberId);
                localStorage.setItem("accessToken", accessToken);
                alert("로그인에 성공하셨습니다.");
                closeModal();
                window.location.href = "http://localhost:3000/courses";
            } else {
                const errorMessage = await response.text();
                console.error(`오류 발생: ${response.status} - ${errorMessage}`);
                alert(`로그인 실패: ${errorMessage.split("\"")[3]}`);
            }
        } catch (error) {
            console.error("로그인 요청 실패:", error);
            alert("로그인 요청 중 오류가 발생했습니다.");
        }
    };

    const handleNaverClick = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/naver";
    };

    const handleGoogleClick = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    const handleSignupClick = () => {
        window.location.href = "http://localhost:3000/signup";
    };

    return (
        <>
            <ModalBackground>
                <ModalContainer>
                    <CloseButton onClick={closeModal}>X</CloseButton>
                    <Logo>Learner</Logo>
                    <Form onSubmit={handleLogin}>
                        <Input
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.toLowerCase())}  // 입력값을 소문자로 변환
                        />
                        <Input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <LoginButton type="submit">로그인</LoginButton>
                    </Form>
                    <PasswordOptions>
                        <ButtonLink onClick={() => setShowFindEmail(true)}>
                            아이디(이메일) 찾기
                        </ButtonLink> |
                        <ButtonLink onClick={() => setShowResetPassword(true)}>
                            비밀번호 찾기
                        </ButtonLink> |
                        <ButtonLink onClick={handleSignupClick}>회원가입</ButtonLink>
                    </PasswordOptions>

                    <SocialLoginContainer>
                        <SocialLoginButton onClick={handleGoogleClick}>
                            <Icon src="http://localhost:8080/images/google_login.png" alt="Google Logo"/>
                        </SocialLoginButton>
                        <SocialLoginButton onClick={handleNaverClick}>
                            <Icon src="http://localhost:8080/images/naver_login.png" alt="Naver Logo"/>
                        </SocialLoginButton>
                    </SocialLoginContainer>
                </ModalContainer>
            </ModalBackground>

            {showFindEmail && (
                <FindEmail closeModal={() => setShowFindEmail(false)}/>
            )}

            {showResetPassword && (
                <PasswordSendEmail closeModal={() => setShowResetPassword(false)}/>
            )}
        </>
    );
};

export default LoginModal;


// 스타일 코드
const ModalBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContainer = styled.div`
    background-color: white;
    padding: 2rem;
    border-radius: 10px;
    width: 400px;
    text-align: center;
    position: relative;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 5px;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;
    transition: background-color 0.3s;

    &:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }
`;

const Logo = styled.h1`
    font-size: 1.8rem;
    margin-bottom: 1rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const Input = styled.input`
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
`;

const LoginButton = styled.button`
    padding: 0.75rem;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;

    &:hover {
        background-color: #218838;
    }
`;

const PasswordOptions = styled.div`
    margin-top: 1rem;
    font-size: 0.875rem;
`;

const ButtonLink = styled.button`
    background: none;
    border: none;
    color: #555;
    font-size: 0.875rem;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
        color: #28a745;
    }
`;

const SocialLoginContainer = styled.div`
    margin-top: 1rem;
    display: flex;
    justify-content: space-around;
`;

const SocialLoginButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: none;
`;

const Icon = styled.img`
    width: 120px;
    height: 40px;
    object-fit: contain;
`;