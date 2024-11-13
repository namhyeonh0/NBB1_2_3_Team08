import React, {useEffect, useState} from "react";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom"; // 추가: useLocation import
import styled from "styled-components";

const defaultImage = "/images/course_default_img.png";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [filteredCourses, setFilteredCourses] = useState([]); // 필터링된 강의 목록 상태 추가
    const [role, setRole] = useState(""); // role을 상태로 저장
    const navigate = useNavigate();

    // memberId를 로컬 저장소에 저장하는 useEffect
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const memberId = query.get('memberId');
        const accessToken = query.get('accessToken');
        const searchQuery = query.get('searchId'); // URL에서 searchId 가져오기

        // sessionExpired 쿼리 매개변수 확인
        const sessionExpired = query.get('sessionExpired');
        console.log(sessionExpired)
        if (sessionExpired) {
            alert('로그인 시간이 만료되었습니다. 재로그인 해주세요.'); // 알림 표시

        }

        // memberId와 accessToken이 존재하면 로컬 스토리지에 저장
        if (memberId) {
            localStorage.setItem('memberId', memberId);
            console.log('Member ID stored in local storage:', memberId);
        }

        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
            console.log('Access Token stored in local storage:', accessToken);
            window.location.href = "http://localhost:3000/courses";
        }

        // role을 로컬 스토리지에서 가져와서 상태로 설정
        const storedRole = localStorage.getItem('role');
        setRole(storedRole);

        // 강의 목록 가져오기
        axios.get("http://localhost:8080/course/list")
            .then((response) => {
                setCourses(response.data);
                setFilteredCourses(response.data); // 초기에는 필터링된 목록에 전체 강의를 저장

                // URL에 searchId가 있을 경우 필터링
                if (searchQuery) {
                    setSearchId(searchQuery);
                    handleSearch(searchQuery);
                }
            })
            .catch((error) => {
                console.error("Error fetching the courses:", error);
            });
    }, []); // 컴포넌트가 마운트될 때 실행

    const handleSearch = (searchTerm) => {
        // searchId에 대한 검색을 수행하여 필터링된 강의 목록 업데이트
        const filtered = courses.filter(course =>
            course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) // 대소문자 구분 없이 검색
        );
        setFilteredCourses(filtered);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(searchId); // Enter 키를 누르면 검색
        }
    };

    const checkUser = () => {
        const token = localStorage.getItem('accessToken');
        return !!token;

    }

    const handleChatClick = () => {
        if (checkUser()) {
            navigate('/chat');
        } else {
            alert('로그인 후 이용해주세요.');
        }

    };

    return (
        <CoursePage>
            <SearchContainer>
                <h2>Learner에서 강의를 찾아보세요</h2>
                <SearchInputContainer>
                    <SearchInput
                        type="text"
                        placeholder="배우고 싶은 지식을 입력해보세요."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        onKeyPress={handleKeyPress} // Enter 키 감지 추가
                    />
                    <SearchButton onClick={() => handleSearch(searchId)}>
                        🔍
                    </SearchButton>
                </SearchInputContainer>
            </SearchContainer>

            {/* 관리자일 때만 강의 생성 버튼 표시 */}
            {(role === "admin" || role === "INSTRUCTOR") && (
                <CreateCourseButton onClick={() => navigate("/post-course")}>
                    강의 생성
                </CreateCourseButton>
            )}

            {checkUser() && (
                <ChatButton onClick={handleChatClick}>
                    채팅💬
                </ChatButton>)}

            <CourseList>
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <CourseItem key={course.courseId} course={course} navigate={navigate}/>
                    ))
                ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
            </CourseList>
        </CoursePage>
    );
};

const CourseItem = ({course, navigate}) => {
    const handleClick = () => {
        navigate(`/courses/${course.courseId}`);
    };

    return (
        <StyledCourseItem onClick={handleClick}>
            <CourseImage src={defaultImage} alt="Course Banner"/>
            <h3>{course.courseName}</h3>
            <p>{course.instructorName}</p>
            <p>{course.coursePrice}원</p>
        </StyledCourseItem>
    );
};

export default Courses;


// 스타일 코드
const CoursePage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 50px;
`;

const CourseList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
    align-items: center;
`;

const StyledCourseItem = styled.div`
    border: 1px solid #ddd;
    padding: 1.5rem;
    width: 300px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;

    &:hover {
        background-color: #f9f9f9;
    }
`;

const SearchContainer = styled.div`
    text-align: center;
    margin-bottom: 2rem;
`;

const SearchInputContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
`;

const SearchInput = styled.input`
    width: 500px;
    padding: 1rem;
    border-radius: 50px;
    border: 1px solid #ddd;
    font-size: 1rem;
    text-align: center;
    background-color: #f5f5f5;
`;

const SearchButton = styled.button`
    background-color: #3cb371; /* 버튼 기본 색상 */
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px; /* 버튼과 입력창 사이의 간격 추가 */

    &:hover {
        background-color: #2a9d63; /* 버튼 호버 색상 */
    }
`;

const CourseImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 1rem;
`;

const CreateCourseButton = styled.button`
    margin-bottom: 20px;
    background-color: #3cb371;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #2a9d63;
    }
`;

const ChatButton = styled.button`
    position: fixed; /* 화면에 고정 */
    bottom: 30px; /* 화면 하단에서 30px 위 */
    right: 30px; /* 화면 오른쪽에서 30px 왼쪽 */
    padding: 15px 20px; /* 버튼 내부 여백 (텍스트와 아이콘 사이의 공간 확보) */
    background-color: #3cb371; /* 버튼 배경 색상 */
    color: white;
    border: none;
    border-radius: 30px; /* 둥근 사각형 모양 */
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px; /* 텍스트 크기 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 그림자 효과 */
    cursor: pointer;
    z-index: 1000; /* 다른 요소들보다 위에 표시되도록 설정 */

    &:hover {
        background-color: #2a9d63; /* 호버 시 배경 색상 변경 */
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* 호버 시 그림자 강화 */
    }
`;
