import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';

function Sidebar() {
    const location = useLocation();
    const [selectedMenu, setSelectedMenu] = useState(location.pathname); // 현재 경로를 초기값으로 설정

    const handleMenuClick = (path) => {
        setSelectedMenu(path);
    };

    const menuItems = [
        {path: "/admin/courses/create", label: "강좌 등록"},
        {path: "/admin/courses-management", label: "강좌 관리"},
        {path: "/admin/inquiries", label: "문의 관리"},
        {path: "/admin/members", label: "회원 관리"},
    ];

    return (
        <div style={sidebarStyle}>
            <h2 style={titleStyle}>관리자 메뉴</h2>
            <ul style={listStyle}>
                {menuItems.map((item) => (
                    <li key={item.path}>
                        <Link
                            to={item.path}
                            style={{...linkStyle, color: selectedMenu === item.path ? '#007bff' : 'black'}}
                            onClick={() => handleMenuClick(item.path)}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const sidebarStyle = {
    width: '200px',
    backgroundColor: '#f4f4f4',
    padding: '20px',
    height: '100%',
};

const titleStyle = {
    fontSize: '25px', // 글자 크기를 20px로 설정
    fontWeight: 'bold',
    marginBottom: '20px',
    paddingBottom: '10px', // 구분선과의 간격 추가
    borderBottom: '2px solid #ccc', // 구분선 추가
};

const listStyle = {
    listStyleType: 'none',
    paddingLeft: 0,
};

const linkStyle = {
    textDecoration: 'none',
    display: 'block',
    padding: '5px 0',
    fontSize: '20px', // 글자 크기를 16px로 설정
};

export default Sidebar;
