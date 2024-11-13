import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "../axiosInstance";
import styled from "styled-components";

const OrderDelete = () => {
    const {orderId} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const deleteOrder = async () => {
            try {
                await axios.delete(`http://localhost:8080/order/${orderId}`, {withCredentials: true});
                alert("주문이 삭제되었습니다.");
                navigate("/orders"); // 주문 목록 페이지로 리디렉션
            } catch (error) {
                console.error("주문 삭제 중 오류 발생:", error);
                setError("주문 삭제에 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        deleteOrder();
    }, [orderId, navigate]);

    if (loading) return <p>삭제 중...</p>;
    if (error) return <ErrorMessage>{error}</ErrorMessage>;

    return null; // 컴포넌트가 렌더링될 필요가 없음
};

export default OrderDelete;

const ErrorMessage = styled.p`
    color: red;
    font-weight: bold;
`;
