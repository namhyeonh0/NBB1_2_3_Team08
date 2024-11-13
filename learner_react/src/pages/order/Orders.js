import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axiosInstance from "../axiosInstance";
import styled from "styled-components";

const Order_Url = "http://localhost:8080/order";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [setUserRole] = useState(null);
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

                // 서버 응답에서 사용자 역할 및 이름 설정
                setUserRole(response.data.role);  // role 설정
                setMemberId(response.data.mid);    // memberId 설정
            }
        } catch (error) {
            console.error("토큰 확인 중 오류 발생:", error);
        }
    };

    // 주문 목록 가져오기
    const fetchOrders = async () => {
        if (!memberId) {
            setError("로그인이 필요합니다.");
            return;
        }
        setLoading(true); // 로딩 시작
        try {
            const response = await axiosInstance.get(`/order/list/${memberId}`, {withCredentials: true});
            if (Array.isArray(response.data)) {
                setOrders(response.data);
            } else {
                console.error('주문 응답이 배열이 아닙니다:', response.data);
                setError("주문 목록을 가져오는 데 실패했습니다.");
                setOrders([]);
            }
        } catch (error) {
            console.error("주문 가져오는 중 오류 발생:", error);
            setError("주문 목록을 가져오는 데 실패했습니다.");
            setOrders([]);
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    useEffect(() => {
        checkUserRole(); // 사용자 역할 및 memberId 확인
    }, []); // 컴포넌트가 마운트될 때 한 번만 호출

    useEffect(() => {
        if (memberId) {
            fetchOrders(); // memberId가 설정되면 주문 목록 가져오기
        }
    }, [memberId]); // memberId가 변경될 때마다 호출

    const handleUpdateClick = (orderId) => {
        navigate(`/orders/update/${orderId}`);
    };

    const handleDeleteClick = (orderId) => {
        if (window.confirm("정말로 이 주문을 삭제하시겠습니까?")) {
            navigate(`/orders/delete/${orderId}`);
        }
    };

    const handlePurchase = async (orderId) => {
        try {
            const response = await axiosInstance.post(`order/purchase/${orderId}`, {
                orderId,
                memberId
            }, {withCredentials: true});
            alert("결제가 완료되었습니다. 주문 ID: " + response.data.orderId);
            // 성공적으로 결제 후 해당 주문 제거
            await axiosInstance.delete(`order/${orderId}`, {withCredentials: true});
            window.location.reload();
        } catch (error) {
            console.error("결제 중 오류 발생:", error);
            alert("결제에 실패했습니다.");
        }
    };

    if (loading) return <LoadingMessage>로딩 중...</LoadingMessage>;
    if (error) return <ErrorMessage>{error}</ErrorMessage>;

    return (
        <OrderList>
            <Header>주문 목록</Header>
            <Link to="/orders/create">
                <StyledButton primary>주문 생성</StyledButton>
            </Link>
            {orders.length > 0 ? (
                orders.map(order => (
                    <OrderItem key={order.orderId}>
                        <p>주문 ID: <strong>{order.orderId}</strong></p>
                        <p>주문 날짜: <strong>{new Date(order.createdDate).toLocaleDateString()}</strong></p>
                        <p>강의: <strong>{order.orderItemDTOList.map(item => item.courseName).join(', ')}</strong></p>
                        <p>총 금액: <strong>{order.totalPrice} 원</strong></p>
                        <ButtonContainer>
                            <StyledButton onClick={() => handleUpdateClick(order.orderId)} update>수정</StyledButton>
                            <Link to={`/orders/${order.orderId}`}>
                                <StyledButton>상세보기</StyledButton>
                            </Link>
                            <StyledButton onClick={() => handlePurchase(order.orderId)} purchase>구매</StyledButton>
                            <StyledButton onClick={() => handleDeleteClick(order.orderId)} delete>삭제</StyledButton>
                        </ButtonContainer>
                    </OrderItem>
                ))
            ) : (
                <p>주문이 없습니다.</p>
            )}
        </OrderList>
    );
};

// 스타일 컴포넌트들
const OrderList = styled.div`
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

const OrderItem = styled.div`
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 1rem;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
`;

const StyledButton = styled.button`
    padding: 0.5rem 1rem;
    background-color: ${props =>
            props.primary ? "#007bff" :
                    props.delete ? "#dc3545" :
                            props.purchase ? "#28a745" :
                                    props.update ? "#ffc107" : "#6c757d"
    };
    color: ${props => props.purchase ? "white" : "white"};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: ${props =>
                props.primary ? "#0056b3" :
                        props.delete ? "#c82333" :
                                props.purchase ? "#218838" :
                                        props.update ? "#e0a800" : "#5a6268"
        };
    }
`;

export default Orders;
