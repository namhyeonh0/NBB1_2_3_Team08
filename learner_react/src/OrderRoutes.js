import React from 'react';
import {Route, Routes} from 'react-router-dom';
import OrderDetail from './pages/order/OrderDetail'; // 주문 상세 페이지
import OrderCreate from './pages/order/OrderCreate'; // 주문 생성 페이지
import OrderUpdate from './pages/order/OrderUpdate';
import OrderDelete from "./pages/order/OrderDelete";
import Orders from "./pages/order/Orders";

const OrderRoutes = () => (
    <Routes>
        <Route path="/" element={<Orders/>}/> {/* 주문 목록 */}
        <Route path="/create" element={<OrderCreate/>}/> {/* 주문 생성 */}
        <Route path="/:orderId" element={<OrderDetail/>}/> {/* 주문 상세 */}
        <Route path="/delete/:orderId" element={<OrderDelete/>}/> {/* 주문 삭제 */}
        <Route path="/update/:orderId" element={<OrderUpdate/>}/> {/* 주문 수정 */}
    </Routes>
);

export default OrderRoutes;
