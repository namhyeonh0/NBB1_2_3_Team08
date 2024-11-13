import React, {useEffect, useState} from "react";
import axiosInstance from "../axiosInstance";
import styled from "styled-components";

const AlarmList = () => {
    const [alarms, setAlarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [memberId, setMemberId] = useState(null);

    // 사용자 역할 및 memberId 확인 (서버로 요청)
    const checkUserRole = async () => {
        try {
            const token = localStorage.getItem('accessToken');

            if (token) {
                // Authorization 헤더에 JWT 토큰 추가
                const response = await axiosInstance.get('/token/decode', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // 서버 응답에서 memberId 설정
                setMemberId(response.data.mid); // memberId 설정
            }
        } catch (error) {
            console.error("토큰 확인 중 오류 발생:", error);
            setError("사용자 정보를 가져오는 데 실패했습니다.");
        }
    };

    // 알람 목록 가져오기
    const fetchAlarms = async () => {
        if (!memberId) {
            setError("로그인이 필요합니다.");
            return;
        }
        setLoading(true); // 로딩 시작
        try {
            const response = await axiosInstance.get(`/alarm/member/${memberId}`, {withCredentials: true});
            if (Array.isArray(response.data)) {
                setAlarms(response.data);
            } else {
                console.error('알람 응답이 배열이 아닙니다:', response.data);
                setError("알람 목록을 가져오는 데 실패했습니다.");
                setAlarms([]);
            }
        } catch (error) {
            console.error("알람 가져오는 중 오류 발생:", error);
            setError("알람 목록을 가져오는 데 실패했습니다.");
            setAlarms([]);
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    useEffect(() => {
        checkUserRole(); // 사용자 역할 및 memberId 확인
    }, []); // 컴포넌트가 마운트될 때 한 번만 호출

    useEffect(() => {
        if (memberId) {
            fetchAlarms(); // memberId가 설정되면 알람 목록 가져오기
        }
    }, [memberId]); // memberId가 변경될 때마다 호출

    if (loading) return <LoadingMessage>로딩 중...</LoadingMessage>;
    if (error) return <ErrorMessage>{error}</ErrorMessage>;

    return (
        <AlarmListContainer>
            <Header>알람 목록</Header>
            {alarms.length > 0 ? (
                alarms.map(alarm => (
                    <AlarmItem key={alarm.alarmId}>
                        <p>알람 ID: <strong>{alarm.alarmId}</strong></p>
                        <p>제목: <strong>{alarm.alarmTitle}</strong></p>
                        <p>내용: <strong>{alarm.alarmContent}</strong></p>
                        <p>생성일: <strong>{new Date(alarm.createdAt).toLocaleString()}</strong></p>
                        <p>상태: <strong>{alarm.alarmStatus ? "읽음" : "안 읽음"}</strong></p>
                    </AlarmItem>
                ))
            ) : (
                <p>알람이 없습니다.</p>
            )}
        </AlarmListContainer>
    );
};

// 스타일 컴포넌트들
const AlarmListContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h2`
    text-align: center;
    color: #333;
    margin-bottom: 1.5rem;
`;

const LoadingMessage = styled.p`
    text-align: center;
    color: #007bff;
`;

const ErrorMessage = styled.p`
    text-align: center;
    color: red;
    font-weight: bold;
`;

const AlarmItem = styled.div`
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 1rem;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export default AlarmList;
