import React, {useState} from 'react';
import styled from 'styled-components';

const FindEmail = ({closeModal}) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [foundEmails, setFoundEmails] = useState([]);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleFindEmail = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/members/find/emails?phoneNumber=${phoneNumber}`, {
                method: 'GET',
            });

            if (response.ok) {
                const emails = await response.json();
                setFoundEmails(emails);
                setIsSuccess(true);
                setMessage('');
            } else if (response.status === 404) {
                setFoundEmails([]);
                setIsSuccess(false);
                setMessage('해당 전화번호로 등록된 이메일을 찾을 수 없습니다.');
            }
        } catch (error) {
            setIsSuccess(false);
            setMessage('이메일 찾기 중 오류가 발생했습니다.');
        }
    };

    return (
        <ModalBackground>
            <ModalContainer>
                <CloseButton onClick={closeModal}>X</CloseButton>
                <Logo>이메일 찾기</Logo>

                <Form onSubmit={handleFindEmail}>
                    <Label>전화번호를 입력하시면 이메일을 찾아드립니다.</Label>
                    <Input
                        type="tel"
                        placeholder="전화번호를 입력하세요"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <SubmitButton type="submit">이메일 찾기</SubmitButton>

                    {foundEmails.length > 0 && (
                        <ResultContainer>
                            <ResultTitle>찾은 이메일:</ResultTitle>
                            {foundEmails.map((email, index) => (
                                <ResultText key={index}>{email}</ResultText>
                            ))}
                        </ResultContainer>
                    )}

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

export default FindEmail;

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

const ResultContainer = styled.div`
    margin-top: 1rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 5px;
`;

const ResultTitle = styled.h3`
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: #333;
`;

const ResultText = styled.p`
    font-size: 1rem;
    color: #28a745;
    margin: 0.25rem 0;
`;