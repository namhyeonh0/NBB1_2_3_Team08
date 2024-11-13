import React, {useState} from 'react';
import styled from 'styled-components';

const PasswordSendEmail = ({closeModal}) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/members/find/send-reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email}),
            });

            if (response.ok) {
                setIsSuccess(true);
                setMessage('비밀번호 재설정 이메일이 전송되었습니다. 이메일을 확인해주세요.');
            } else {
                setIsSuccess(false);
                setMessage('비밀번호 재설정 이메일 전송에 실패했습니다.');
            }
        } catch (error) {
            setIsSuccess(false);
            setMessage('비밀번호 재설정 이메일 전송 중 오류가 발생했습니다.');
        }
    };

    return (
        <ModalBackground>
            <ModalContainer>
                <CloseButton onClick={closeModal}>X</CloseButton>
                <Logo>비밀번호 재설정</Logo>

                <Form onSubmit={handleResetPassword}>
                    <Label>가입하신 이메일을 입력해 주세요. <br/> 한번만 클릭!! 몇초 걸려요!!</Label>
                    <Input
                        type="email"
                        placeholder="이메일을 입력하세요"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <SubmitButton type="submit">비밀번호 재설정 메일 받기</SubmitButton>

                    {message && (
                        <MessageContainer isSuccess={isSuccess}>
                            {message}
                        </MessageContainer>
                    )}
                </Form>
            </ModalContainer>
        </ModalBackground>
    );
};

export default PasswordSendEmail;

// Styled Components (두 컴포넌트에서 공통으로 사용)
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
    z-index: 1000;
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
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
`;

const Logo = styled.h1`
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
`;

const Label = styled.p`
    color: #666;
    margin-bottom: 1rem;
    font-size: 0.9rem;
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

const MessageContainer = styled.div`
    margin-top: 1rem;
    padding: 0.75rem;
    border-radius: 5px;
    background-color: ${props => props.isSuccess ? '#d4edda' : '#f8d7da'};
    color: ${props => props.isSuccess ? '#155724' : '#721c24'};
`;