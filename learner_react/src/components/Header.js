import styled from "styled-components";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosInstance from "../pages/axiosInstance";

const Header = ({openModal}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchId, setSearchId] = useState("");
    const [role, setRole] = useState("");

    const checkLoginStatus = async () => {
        const token = localStorage.getItem("accessToken"); // 로컬 저장소에서 액세스 토큰 가져오기

        if (token) {
            setIsLoggedIn(true);
            try {
                const response = await axiosInstance.get('/token/decode');
                const {role} = response.data; // 응답에서 역할 가져오기
                setRole(role);
            } catch (error) {
                console.error("토큰 디코딩 요청 실패:", error);
                handleLogout(); // 로그아웃 처리
            }
        } else {
            setIsLoggedIn(false);
            setRole(""); // 역할 초기화
        }
    };

    useEffect(() => {
        checkLoginStatus(); // 처음 렌더링 시 상태 체크
        const intervalId = setInterval(checkLoginStatus, 60000); // 1분마다 로그인 상태 체크

        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 interval 정리
    }, []);

    const handleLogout = () => {
        try {
            // 서버에 로그아웃 요청 보내기 (쿠키 포함)
            axiosInstance.post("/join/logout", null, {withCredentials: true})
                .then(() => {
                    // 로컬 저장소에서 액세스 토큰 및 회원 ID 제거
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("memberId");

                    // 메인 페이지로 이동
                    window.location.href = "/";
                })
                .catch(error => {
                    console.error("Logout failed:", error);
                    alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
                });
        } catch (error) {
            console.error("Logout failed:", error);
            alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
        }
    };


    const handleSearch = () => {
        if (searchId.trim()) {
            navigate(`/courses?searchId=${encodeURIComponent(searchId)}`);
        }
    };

    const isCoursesPage = location.pathname === "/courses";
    const isCourseDetailPage = location.pathname.startsWith("/courses/");

    return (
        <NavBar>
            <LeftSection>
                {isCourseDetailPage && (
                    <SearchBar>
                        <input
                            type="text"
                            placeholder="검색해보세요"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                        />
                        <button onClick={handleSearch}>🔍</button>
                    </SearchBar>
                )}
            </LeftSection>
            <LogoWrapper onClick={() => navigate("/courses")}>
                <Logo>Learner</Logo>
            </LogoWrapper>

            <RightSection>
                {isLoggedIn ? (
                    <>
                        <NavItem onClick={() => navigate('/alarm/list')}>알림</NavItem>
                        <NavItem onClick={() => navigate('/inquiries')}>문의</NavItem>
                        <NavItem onClick={() => setIsMenuOpen(!isMenuOpen)}>마이페이지</NavItem>
                        {isMenuOpen && (
                            <SubMenu>
                                <SubMenuItem onClick={() => navigate('/내정보')}>내정보</SubMenuItem>
                                {role === 'ROLE_INSTRUCTOR' && (
                                    <SubMenuItem onClick={() => navigate('/courses/list')}>내 강의</SubMenuItem>
                                )}
                                <SubMenuItem onClick={() => navigate('/orders')}>장바구니</SubMenuItem>
                                <SubMenuItem onClick={() => navigate('/edit-profile')}>회원정보 수정</SubMenuItem>
                                <SubMenuItem onClick={() => navigate('/my-courses')}>내 수강 정보</SubMenuItem>
                                <SubMenuItem onClick={handleLogout}>로그아웃</SubMenuItem>
                            </SubMenu>
                        )}
                        {role === "ROLE_ADMIN" && (
                            <NavItem onClick={() => navigate('/admin/courses-management')}>
                                관리자 페이지
                            </NavItem>
                        )}
                    </>
                ) : (
                    <Menu>
                        <StyledButton onClick={openModal}>로그인</StyledButton>
                        <Link to="/signup">
                            <StyledButton>회원가입</StyledButton>
                        </Link>
                    </Menu>
                )}
            </RightSection>
        </NavBar>
    );
};

export default Header;

// 스타일 컴포넌트들 (기존과 동일)

const NavBar = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 0.5rem 1rem;
    height: 60px;
    border-bottom: 1px solid #ddd;
    margin: 0 auto;
    position: relative;
    overflow: visible;
`;

const LeftSection = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-right: auto; /* LeftSection을 왼쪽으로 정렬 */
`;

const LogoWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-left: auto;
    position: relative;
`;

const Logo = styled.h1`
    font-size: 1.5rem;
    color: #3cb371;
    cursor: pointer;
`;

const Menu = styled.div`
    display: flex;
    gap: 1rem;
`;

const StyledButton = styled.button`
    background-color: #3cb371;
    color: white;
    border: 2px solid #3cb371;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    cursor: pointer;

    &:hover {
        background-color: white;
        color: #3cb371;
    }
`;

const NavItem = styled.span`
    cursor: pointer;
    padding: 0.5rem 1rem;
    position: relative;
    border-radius: 5px;

    &:hover {
        background-color: #3cb371;
        color: white;
    }
`;

const SubMenu = styled.div`
    position: absolute;
    top: 100%; /* NavItem 바로 아래에 위치하도록 설정 */
    left: 0;
    display: flex;
    flex-direction: column;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 0.5rem;
    z-index: 1000; /* 메뉴가 다른 요소 위에 나타나도록 설정 */
    width: 150px;
    overflow: visible; /* 메뉴가 페이지 밖으로 나가지 않도록 설정 */
`;

const SubMenuItem = styled(NavItem)`
    padding: 0.5rem 1rem;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const SearchBar = styled.div`
    display: flex;
    align-items: center;
    margin-left: 1rem;

    input {
        padding: 0.5rem;
        border-radius: 20px;
        border: 1px solid #ddd;
        width: 250px; /* 검색창을 더 키움 */
        margin-right: 0.5rem;
    }

    button {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
    }
`;
