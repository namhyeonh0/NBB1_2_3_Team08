import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axiosInstance from './axiosInstance';

const UpdateNews = () => {
    const {courseId, newsId} = useParams();
    const [newsName, setNewsName] = useState("");
    const [newsDescription, setNewsDescription] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthorization();
    }, []);

    const checkAuthorization = async () => {
        try {
            const token = localStorage.getItem('accessToken');

            if (!token) {
                alert('로그인이 필요합니다.');
                navigate(`/courses/${courseId}`);
                return;
            }

            const response = await axiosInstance.get('/token/decode', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const userRole = response.data.role;

            if (userRole !== 'ROLE_INSTRUCTOR' && userRole !== 'ROLE_ADMIN') {
                alert('새소식 등록 권한이 없습니다.');
                navigate(`/courses/${courseId}`);
            }
        } catch (error) {
            console.error("권한 확인 중 오류 발생:", error);
            navigate(`/courses/${courseId}`);
        }
    };

    const handleUpdateNews = async (e) => {
        e.preventDefault();
        const newsRqDTO = {
            newsName,
            newsDescription,
        };

        try {
            await axiosInstance.put(`/course/${courseId}/news/${newsId}`, newsRqDTO);
            alert('새소식이 성공적으로 수정되었습니다.');
            navigate(`/courses/${courseId}`);
        } catch (error) {
            console.error("새소식 수정 실패:", error);
            alert(error.response?.data?.message || '새소식 수정에 실패했습니다. 다시 시도해주세요.');
        }
    }

    const handleCancel = () => {
        navigate(`/courses/${courseId}`);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>새소식 수정</h2>
            <form onSubmit={handleUpdateNews} style={styles.form}>
                <input
                    type="text"
                    placeholder="수정할 새소식 제목"
                    value={newsName}
                    onChange={(e) => setNewsName(e.target.value)}
                    required
                    style={styles.input}
                />
                <textarea
                    placeholder="수정할 새소식 내용"
                    value={newsDescription}
                    onChange={(e) => setNewsDescription(e.target.value)}
                    required
                    style={styles.textarea}
                />
                <div style={styles.buttonContainer}>
                    <button type="submit" style={styles.submitButton}>등록</button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={styles.cancelButton}
                    >
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    header: {
        fontSize: '24px',
        color: '#333',
        marginBottom: '20px',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        marginBottom: '10px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    },
    textarea: {
        marginBottom: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        minHeight: '150px',
        resize: 'vertical',
        fontSize: '16px',
    },
    buttonContainer: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end',
    },
    submitButton: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    cancelButton: {
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};


export default UpdateNews;