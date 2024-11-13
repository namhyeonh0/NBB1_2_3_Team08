import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom'; // useNavigate 추가

const ResetPassword = () => {
    const {uuid} = useParams();
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/members/find/reset-password/${uuid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({newPassword}),
            });

            if (response.ok) {
                setIsSuccess(true);
                setMessage('비밀번호가 성공적으로 재설정되었습니다.');
                // 비밀번호 재설정 성공 후 /courses로 이동
                setTimeout(() => {
                    navigate('/courses');
                }, 500); // 2초 후에 이동
            } else {
                setIsSuccess(false);
                const errorData = await response.json();
                setMessage(errorData.message || '비밀번호 재설정에 실패했습니다.');
            }
        } catch (error) {
            setIsSuccess(false);
            setMessage('오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div>
            <h1>비밀번호 재설정</h1>
            <form onSubmit={handleResetPassword}>
                <input
                    type="password"
                    placeholder="새 비밀번호 입력"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit">비밀번호 재설정</button>
            </form>
            {message && <p style={{color: isSuccess ? 'green' : 'red'}}>{message}</p>}
        </div>
    );
};

export default ResetPassword;
