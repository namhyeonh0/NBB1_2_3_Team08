import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axiosInstance from "../axiosInstance";
import './Style/InquiryDetail.css';

const InquiryDetail = () => {
    const {inquiryId} = useParams();
    const [inquiry, setInquiry] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [isInquiryEditing, setIsInquiryEditing] = useState(false); // 문의 수정 상태
    const [isAnswerCreating, setIsAnswerCreating] = useState(false); // 답변 작성 상태
    const [isAnswerEditing, setIsAnswerEditing] = useState(false); // 답변 수정 상태
    const [answerContent, setAnswerContent] = useState('');
    const [inquiryContent, setInquiryContent] = useState('');
    const [info, setInfo] = useState(null);
    const [inquiryAuthorId, setInquiryAuthorId] = useState(null); // 작성자 ID 추가
    const navigate = useNavigate();
    const [memberId, setMemberId] = useState(null);
    const [inquiryStatus] = useState('ANSWERED');

    // role 가져오는 함수
    const getInfoFromToken = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            try {
                const response = await axiosInstance.get('/token/decode');
                setInfo(response.data);
                setMemberId(response.data.mid)
            } catch (error) {
                console.error('Failed to get role:', error);
            }
        }
    };

    // 문의 및 답변 가져오기
    const fetchInquiry = async () => {
        try {
            const response = await axiosInstance.get(`/inquiries/${inquiryId}`);
            setInquiry(response.data);
            setInquiryContent(response.data.inquiryContent); // 문의 내용 상태에 저장
            setInquiryAuthorId(response.data.memberId); // 작성자 ID 저장
        } catch (error) {
            console.error('Failed to fetch inquiry:', error);
        }
    };

    const fetchAnswer = async () => {
        try {
            const response = await axiosInstance.get(`/answers/${inquiryId}`);
            if (response.data && response.data.answerContent) {
                setAnswer(response.data);
            }
        } catch (error) {
            setAnswer(null);
        }
    };

    useEffect(() => {
        getInfoFromToken();
    }, []);

    useEffect(() => {
        fetchInquiry();
        fetchAnswer();
    }, [memberId]);

    // 답변 등록 핸들러
    const handleAnswerSave = async () => {
        try {
            await axiosInstance.post('/answers', {
                inquiryId: inquiryId,
                answerContent: answerContent,
            });
            await axiosInstance.put(`/inquiries/${inquiryId}/status`, {
                inquiryStatus: inquiryStatus,
            });
            setAnswerContent('');
            setIsAnswerCreating(false);
            fetchAnswer(); // 답변을 새로고침
            fetchInquiry();
        } catch (error) {
            console.error('Failed to save answer:', error);
        }
    };

    // 답변 수정 핸들러
    const handleAnswerEdit = () => {
        if (answer) {
            setIsAnswerEditing(true);
            setAnswerContent(answer.answerContent);
        }
    };

    const handleAnswerUpdate = async () => {
        try {
            await axiosInstance.put(`/answers/${inquiryId}`, {
                answerContent: answerContent,
            });
            setAnswerContent('');
            setIsAnswerEditing(false);
            fetchAnswer(); // 답변 새로고침
        } catch (error) {
            console.error('Failed to update answer:', error);
        }
    };

    // 답변 삭제 핸들러
    const handleAnswerDelete = async () => {
        const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                await axiosInstance.delete(`/answers/${inquiryId}`);
                setAnswer(null);
                setAnswerContent('')
                await axiosInstance.put(`/inquiries/${inquiryId}/status`, {
                    inquiryStatus: 'CONFIRMING',
                })
                fetchAnswer(); // 답변 새로고침
                fetchInquiry();
            } catch (error) {
                console.error('Failed to delete answer:', error);
            }
        }
    };

    // 문의 수정 핸들러
    const handleInquiryEdit = () => {
        setIsInquiryEditing(true);
    };

    const handleInquiryUpdate = async () => {
        try {
            await axiosInstance.put(`/inquiries/${inquiryId}`, {
                inquiryTitle: inquiry.inquiryTitle,
                inquiryContent: inquiryContent,
            });
            setInquiryContent(inquiryContent);
            setIsInquiryEditing(false);
            fetchInquiry(); // 문의 새로고침
        } catch (error) {
            console.error('Failed to update inquiry:', error);
        }
    };

    // 문의 삭제 핸들러
    const handleInquiryDelete = async () => {
        const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                await axiosInstance.delete(`/inquiries/${inquiryId}`);
                navigate('/inquiries'); // 문의 삭제 후 목록으로 이동
            } catch (error) {
                console.error('Failed to delete inquiry:', error);
            }
        }
    };

    // 목록으로 돌아가기 핸들러
    const handleBackToList = () => {
        navigate('/inquiries');
    };

    const isButtonDisabled1 = answerContent.trim() === ''; // 공백 체크
    const isButtonDisabled2 = inquiryContent.trim() === ''; // 공백 체크


    if (!inquiry) return <p>로딩 중...</p>;

    return (
        <div className="inquiry-detail">
            <h1>문의 상세 페이지</h1>

            <div className="inquiry-area">
                <h2>{inquiry.inquiryTitle}</h2>
                <div className="divider"></div>
                <div className="inquiry-info">
                    <span><strong>작성자:</strong> {inquiry.memberNickname}</span>
                    <span><strong>작성일:</strong> {new Date(inquiry.inquiryCreateDate).toLocaleDateString()}</span>
                    <span><strong>수정일:</strong> {new Date(inquiry.inquiryUpdateDate).toLocaleDateString()}</span>
                    <span><strong>상태:</strong> {inquiry.inquiryStatus}</span>
                </div>
                <div className="divider"></div>
                <div className="inquiry-content">
                    <strong>내용:</strong>
                    {isInquiryEditing ? (
                        <div>
                            <textarea
                                typeof={"text"}
                                value={inquiryContent}
                                onChange={(e) => setInquiryContent(e.target.value)}
                                placeholder="문의 내용을 수정하세요"
                                required
                            />
                            <button onClick={handleInquiryUpdate} disabled={isButtonDisabled2}>완료</button>
                            <button onClick={() => setIsInquiryEditing(false)}>취소</button>
                        </div>
                    ) : (
                        <p>{inquiryContent}</p>
                    )}
                </div>
                {parseInt(inquiryAuthorId, 10) === parseInt(memberId, 10) && !isInquiryEditing && ( // 작성자 ID와 비교
                    <div className="inquiry-actions">
                        <button onClick={handleInquiryEdit}>수정</button>
                        <button onClick={handleInquiryDelete}>삭제</button>
                    </div>
                )}
            </div>

            <div className="answer-area">
                <h2>문의 답변</h2>
                <div className="divider"></div>
                {answer ? (
                    <div>
                        <strong>답변 내용:</strong>
                        {isAnswerEditing ? (
                            <div>
                                <textarea
                                    value={answerContent}
                                    onChange={(e) => setAnswerContent(e.target.value)}
                                    placeholder="답변을 수정하세요"
                                    required
                                />
                                <button onClick={handleAnswerUpdate} disabled={isButtonDisabled1}>완료</button>
                                <button onClick={() => setIsAnswerEditing(false)}>취소</button>
                            </div>
                        ) : (
                            <p>{answer.answerContent}</p>
                        )}
                        {info.role === 'ROLE_ADMIN' && !isAnswerEditing && (
                            <div className="answer-actions">
                                <button onClick={handleAnswerEdit}>수정</button>
                                <button onClick={handleAnswerDelete}>삭제</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        {info.role === 'ROLE_ADMIN' && !isAnswerCreating && (
                            <>
                                <p>답변이 없습니다.</p>
                                <button onClick={() => setIsAnswerCreating(true)}>답변 작성</button>
                            </>
                        )}
                    </div>
                )}
                {isAnswerCreating && (
                    <div>
                        <textarea
                            value={answerContent}
                            onChange={(e) => setAnswerContent(e.target.value)}
                            placeholder="답변을 작성하세요"
                            required={true}
                        />
                        <button onClick={handleAnswerSave} disabled={isButtonDisabled2}>등록</button>
                        <button onClick={() => setIsAnswerCreating(false)}>취소</button>
                    </div>
                )}
            </div>

            <button className="back-button" onClick={handleBackToList}>목록으로 돌아가기</button>
        </div>
    );
};

export default InquiryDetail;
