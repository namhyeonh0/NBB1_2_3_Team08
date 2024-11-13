import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import axiosInstance from "../axiosInstance";

const OrderCreate = () => {
    const [orderItems, setOrderItems] = useState([{courseId: "", price: ""}]);
    const [courses, setCourses] = useState([]);
    const [purchasedCourses, setPurchasedCourses] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [memberId, setMemberId] = useState(null);

    // 사용자 역할 및 memberId 확인 (서버로 요청)
    const checkUserRole = async () => {
        try {
            const token = localStorage.getItem('accessToken');

            if (token) {
                const response = await axiosInstance.get('/token/decode', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserRole(response.data.role);
                setMemberId(response.data.mid);
            }
        } catch (error) {
            console.error("토큰 확인 중 오류 발생:", error);
            if (error.response && error.response.status === 401) {
                // 401 에러 처리: 로그인 페이지로 리디렉션
                navigate('/login'); // 로그인 페이지로 리디렉션
            }
        }
    };


    useEffect(() => {
        checkUserRole(); // 사용자 역할 및 memberId 확인
    }, []); // 컴포넌트가 마운트될 때 한 번만 호출

    useEffect(() => {
        const fetchCourses = async () => {
            if (!memberId) return; // memberId가 없을 경우 호출하지 않음
            try {
                const response = await axiosInstance.get('http://localhost:8080/course/list', {withCredentials: true});
                setCourses(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error("강의 목록을 가져오는 중 401 에러 발생. 로그인 페이지로 리디렉션합니다.");
                    navigate("/login");
                } else {
                    console.error("Error fetching courses:", error);
                    setError("강의 목록을 가져오는 데 실패했습니다.");
                }
            }
        };

        fetchCourses();
    }, [memberId]); // memberId가 변경될 때만 호출

    // useEffect(() => {
    //     const checkPurchasedCourses = async () => {
    //         // 구매 상태가 이미 체크되었거나 memberId가 없으면 조기 반환
    //         if (courses.length === 0 || !memberId) return;
    //
    //         const purchasedStatus = {};
    //         await Promise.all(courses.map(async (course) => {
    //             try {
    //                 const response = await axiosInstance.get(`http://localhost:8080/course/${course.courseId}/purchase?memberId=${memberId}`, { withCredentials: true });
    //                 purchasedStatus[course.courseId] = response.data; // boolean 값 저장
    //             } catch (error) {
    //                 console.error(`Error checking purchase for course ${course.courseId}:`, error);
    //             }
    //         }));
    //
    //         // purchasedCourses가 빈 객체일 때만 업데이트
    //         if (Object.keys(purchasedCourses).length === 0) {
    //             setPurchasedCourses(purchasedStatus);
    //         }
    //     };
    //
    //     checkPurchasedCourses();
    // }, [courses, memberId]); // purchasedCourses 삭제


    const handleChange = (index, event) => {
        const values = [...orderItems];
        values[index][event.target.name] = event.target.value;
        const selectedCourse = courses.find(course => course.courseId === event.target.value);
        if (selectedCourse) {
            values[index].price = selectedCourse.coursePrice; // 가격 설정
        }
        setOrderItems(values);
    };

    const handleAddItem = () => {
        setOrderItems([...orderItems, {courseId: "", price: ""}]);
    };

    const handleRemoveItem = (index) => {
        const values = [...orderItems];
        values.splice(index, 1);
        setOrderItems(values);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axiosInstance.post(`http://localhost:8080/order/${memberId}`, {
                orderItemDTOList: orderItems,
                memberId: memberId,
            }, {withCredentials: true});

            setError("주문이 성공적으로 생성되었습니다!");

            setTimeout(() => {
                navigate("/orders");
            }, 2000);
        } catch (error) {
            console.error("Error creating order:", error);
            setError("주문 생성에 실패했습니다.");
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <OrderCreateContainer>
            <h2>주문 생성</h2>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <BackButton onClick={handleBack}>뒤로가기</BackButton>
            <form onSubmit={handleSubmit}>
                {orderItems.map((item, index) => (
                    <ItemContainer key={index}>
                        <Select
                            name="courseId"
                            value={item.courseId}
                            onChange={(event) => handleChange(index, event)}
                            required
                        >
                            <option value="">강의 선택</option>
                            {courses
                                .filter(course => !purchasedCourses[course.courseId]) // 구매한 강의 제외
                                .map((course) => (
                                    <option key={course.courseId} value={course.courseId}>
                                        {course.courseName} - {course.coursePrice} 원
                                    </option>
                                ))}
                        </Select>
                        <PriceDisplay>{item.price} 원</PriceDisplay>
                        <RemoveButton type="button" onClick={() => handleRemoveItem(index)}>
                            삭제
                        </RemoveButton>
                    </ItemContainer>
                ))}
                <AddButton type="button" onClick={handleAddItem}>
                    항목 추가
                </AddButton>
                <SubmitButton type="submit">주문 생성</SubmitButton>
            </form>
        </OrderCreateContainer>
    );
};

export default OrderCreate;

// 스타일 컴포넌트는 그대로 유지
const OrderCreateContainer = styled.div`
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ItemContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
`;

const Select = styled.select`
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    transition: border 0.3s;

    &:focus {
        border-color: #007bff;
        outline: none;
    }
`;

const PriceDisplay = styled.span`
    font-size: 16px;
    margin-left: 10px;
`;

const RemoveButton = styled.button`
    padding: 8px 12px;
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #ff1a1a;
    }
`;

const AddButton = styled.button`
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #218838;
    }
`;

const SubmitButton = styled.button`
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0056b3;
    }
`;

const BackButton = styled.button`
    margin-bottom: 15px;
    padding: 10px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #5a6268;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-weight: bold;
    margin-bottom: 15px;
`;
