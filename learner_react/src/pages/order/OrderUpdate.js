import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "../axiosInstance";
import styled from "styled-components";

const OrderUpdate = () => {
    const {orderId} = useParams();
    const [order, setOrder] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(""); // 선택된 강의 ID 상태
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/order/${orderId}`, {withCredentials: true});
                setOrder(response.data);
            } catch (error) {
                console.error("주문 정보를 가져오는 중 오류 발생:", error);
                setError("주문 정보를 가져오는 데 실패했습니다.");
            }
        };

        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/course/list', {withCredentials: true});
                setCourses(response.data);
            } catch (error) {
                console.error("강의 목록을 가져오는 중 오류 발생:", error);
                setError("강의 목록을 가져오는 데 실패했습니다.");
            }
        };

        fetchOrder();
        fetchCourses();
    }, [orderId]);

    const handleCourseChange = (e) => {
        console.log("선택된 강의 ID:", e.target.value); // 로그 추가
        setSelectedCourseId(e.target.value); // 선택된 강의 ID 업데이트
    };

    const handleAddCourse = () => {
        console.log("추가 버튼 클릭됨"); // 로그 추가
        console.log("selectedCourseId", selectedCourseId);
        if (!selectedCourseId) {
            console.log("강의를 선택하지 않았습니다."); // 선택되지 않았을 경우
            return;
        }

        const course = courses.find(c => c.courseId === Number(selectedCourseId));
        console.log("선택된 강의:", course); // 선택된 강의 로그 추가
        if (course) {
            // 현재 아이템 목록에서 중복 추가 방지
            const exists = order.orderItemDTOList.some(item => item.courseId === course.courseId);
            if (exists) {
                console.log("이미 존재하는 강의입니다."); // 중복 추가 방지 로그
                return; // 이미 존재하는 경우 추가하지 않음
            }

            const updatedOrderItems = [...order.orderItemDTOList, {
                courseId: course.courseId,
                price: course.coursePrice
            }];
            const newTotalPrice = updatedOrderItems.reduce((total, item) => total + item.price, 0);

            console.log("업데이트된 아이템 목록:", updatedOrderItems); // 업데이트된 목록 로그

            setOrder((prev) => ({
                ...prev,
                orderItemDTOList: updatedOrderItems,
                totalPrice: newTotalPrice
            }));
            setSelectedCourseId(""); // 선택된 강의 초기화
        } else {
            console.log("유효하지 않은 강의 ID:", selectedCourseId); // 유효하지 않은 ID 로그
        }
    };


    const handleRemoveCourse = (courseId) => {
        const updatedOrderItems = order.orderItemDTOList.filter(item => item.courseId !== courseId);
        const newTotalPrice = updatedOrderItems.reduce((total, item) => total + item.price, 0);
        setOrder((prev) => ({...prev, orderItemDTOList: updatedOrderItems, totalPrice: newTotalPrice}));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/order/${orderId}`, order, {withCredentials: true});
            console.log("주문 업데이트 완료:", response.data);
            navigate(`/orders/${orderId}`);
        } catch (error) {
            console.error("주문 업데이트 중 오류 발생:", error);
            setError("주문 업데이트에 실패했습니다.");
        }
    };

    if (!order) return <p>로딩 중...</p>;
    if (error) return <p style={{color: "red"}}>{error}</p>;

    return (
        <OrderUpdateContainer>
            <h2>주문 업데이트</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>강의 추가:</label>
                    <select onChange={handleCourseChange} value={selectedCourseId}>
                        <option value="" disabled>강의를 선택하세요</option>
                        {courses.map(course => (
                            <option key={course.courseId} value={course.courseId}>
                                {course.courseName}
                            </option>
                        ))}
                    </select>
                    <button type="button" onClick={handleAddCourse}>추가</button>
                </div>
                <OrderItems>
                    <h3>현재 강의:</h3>
                    {order.orderItemDTOList.map(item => (
                        <OrderItem key={item.courseId}>
                            <span>강의 ID: {item.courseId}</span>
                            <RemoveButton onClick={() => handleRemoveCourse(item.courseId)}>제거</RemoveButton>
                        </OrderItem>
                    ))}
                </OrderItems>
                <div>총 금액: {order.totalPrice} 원</div>
                <button type="submit">주문 업데이트</button>
            </form>
        </OrderUpdateContainer>
    );
};

export default OrderUpdate; // 컴포넌트 내보내기

const OrderUpdateContainer = styled.div`
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
`;

const OrderItems = styled.div`
    margin-top: 1rem;
    border-top: 1px solid #ddd;
    padding-top: 1rem;
`;

const OrderItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0.5rem 0;
`;

const RemoveButton = styled.button`
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    cursor: pointer;

    &:hover {
        background-color: #c82333;
    }
`;
