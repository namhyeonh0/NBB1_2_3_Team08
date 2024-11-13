// MemberListManagement.js

import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import styled from "styled-components";

const MemberListManagement = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null); // 사용자 역할 저장
    const [userId, setUserId] = useState(null); // 사용자 ID 저장
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://localhost:8080/members/list`
                , {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                })
            .then((response) => {
                setLoading(false);
                setMembers(response.data);
                console.log(response.data)
                return fetchUserRoleAndId();
            }).then((userData) => {
            setUserRole(userData.role);   // 사용자 역할 설정
            setUserId(userData.mid);      // 사용자 ID 설정
            console.log(userData.role);
            console.log(userData.mid);
        })
            .catch((error) => {
                console.error("Error fetching the member:", error);
                setLoading(false);
            });
    }, []);

    const fetchUserRoleAndId = async () => {
        console.log("fetchUserRoleAndId 함수 호출됨!");
        const token = localStorage.getItem('accessToken');

        if (!token) {
            throw new Error("Token not found");
        }

        try {
            const response = await axiosInstance.get('/token/decode', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data;
            return {
                mid: data.mid,
                role: data.role,
                username: data.username
            };

        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    };

    const handleMemberClick = (memberId) => {
        // 특정 회원 상세 페이지로 이동 (예시)
        navigate(`/members/${memberId}`);
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;

    return (
        <MemberPage>
            <table>
                <thead>
                <tr>
                    <th style={{textAlign: 'center'}}>회원 ID</th>
                    <th style={{textAlign: 'center'}}>이름</th>
                    <th style={{textAlign: 'center'}}>이메일</th>
                    <th style={{textAlign: 'center'}}>전화번호</th>
                    <th style={{textAlign: 'center'}}>가입일</th>
                </tr>
                </thead>
                <tbody>
                {members.map((member) => (
                    <tr key={member.memberId}>
                        <td style={{textAlign: 'center'}}> {member.memberId}</td>
                        <td style={{textAlign: 'center'}}>{member.nickname}</td>
                        <td style={{textAlign: 'center'}}>{member.email}</td>
                        <td style={{textAlign: 'center'}}>{member.phoneNumber}</td>
                        <td style={{textAlign: 'center'}}>{member.createDate}</td>
                        {/*<td>*/}
                        {/*    <button onClick={() => handleMemberClick(member.memberId)}>*/}
                        {/*        상세보기*/}
                        {/*    </button>*/}
                        {/*</td>*/}
                    </tr>
                ))}
                </tbody>
            </table>
        </MemberPage>
    );
};

export default MemberListManagement;

const MemberPage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    margin-left: 120px;
`;