import styled from "styled-components";
import { useState } from "react";

const SignUp = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        nickname: "",
        phoneNumber: "",
        profileImage: "",
        introduction: "",
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        try {
            const response = await fetch("http://52.79.149.176//join/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const errorData = await response.text();
                const errorObject = JSON.parse(errorData);
                const message = errorObject.error || "알 수 없는 오류가 발생했습니다.";
                setErrorMessage(message);
                return;
            }

            alert("회원가입에 성공하셨습니다.");
            window.location.href = "http://localhost:3000/courses";
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("로그인 요청 중 오류가 발생했습니다. " + (error.message || "알 수 없는 오류가 발생했습니다."));
        }
    };

    const handleNaverClick = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/naver";
    };

    const handleGoogleClick = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <SignUpContainer>
            <Title>회원가입</Title>
            <Form onSubmit={handleSubmit}>
                <Label>이메일</Label>
                <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="이메일을 입력하세요"
                    required
                />

                <Label>비밀번호</Label>
                <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="비밀번호를 입력하세요"
                    required
                />

                <Label>비밀번호 확인</Label>
                <Input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="비밀번호를 다시 입력하세요"
                    required
                />

                <Label>닉네임</Label>
                <Input
                    type="text"
                    name="nickname"
                    value={form.nickname}
                    onChange={handleChange}
                    placeholder="닉네임을 입력하세요"
                    required
                />

                <Label>전화번호</Label>
                <Input
                    type="text"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="전화번호를 입력하세요"
                    required
                />

                <SubmitButton type="submit">가입하기</SubmitButton>
            </Form>

            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

            <SimpleSignUp>
                <span>간편 회원가입</span>
                <SocialButtons>
                    <Icon
                        src="http://localhost:8080/images/google_login.png"
                        alt="Google Logo"
                        onClick={handleGoogleClick} // 클릭 이벤트 추가
                    />
                    <Icon
                        src="http://localhost:8080/images/naver_login.png"
                        alt="Naver Logo"
                        onClick={handleNaverClick} // 클릭 이벤트 추가
                    />
                </SocialButtons>
            </SimpleSignUp>
        </SignUpContainer>
    );
};

export default SignUp;

const SignUpContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
`;

const Title = styled.h2`
    font-size: 2rem;
    margin-bottom: 2rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 300px;
`;

const Label = styled.label`
    font-size: 1rem;
    margin-bottom: 0.5rem;
`;

const Input = styled.input`
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
`;

const SubmitButton = styled.button`
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

const SimpleSignUp = styled.div`
    margin-top: 2rem;
    text-align: center;
    span {
        margin-bottom: 1rem;
        display: block;
    }
`;

const SocialButtons = styled.div`
    display: flex;   // flex-direction을 row로 변경하여 가로 배치
    justify-content: center;
    align-items: center;
    gap: 2rem;  // 버튼 간 간격을 넓힘
`;

const Icon = styled.img`
    width: 100px;  // 더 큰 크기로 설정
    height: 100px; // 더 큰 크기로 설정
    cursor: pointer;  // 클릭 가능한 손모양 커서 추가
    object-fit: contain;
`;

const ErrorMessage = styled.div`
    color: red;
    margin-top: 1rem;
    font-size: 0.9rem;
`;
