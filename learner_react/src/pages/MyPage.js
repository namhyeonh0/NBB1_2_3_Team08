import React, {useEffect, useState} from "react";
import styled from "styled-components";
import WeeklyStudyTable from "../components/study-table/WeeklyStudyTable";
import YearlyStudyTable from "../components/study-table/YearlyStudyTable";
import axiosInstance from './axiosInstance'; // axiosInstance import

const MyPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isHover, setIsHover] = useState(false);
    const [attendanceDays, setAttendanceDays] = useState(0);
    const [mid, setMid] = useState(null);

    useEffect(() => {
        // /token/decode API 호출로 mid와 role 가져오기
        axiosInstance.get('/token/decode')
            .then(response => {
                const {mid} = response.data;
                setMid(mid)

                // 첫 번째 메서드 실행
                fetchUserInfo(mid);

                // 0.3초 후에 두 번째 메서드 실행
                const timer = setTimeout(() => {
                    fetchAttendanceDays(mid);
                }, 300);

                // 컴포넌트가 언마운트될 때 타이머 정리
                return () => clearTimeout(timer);
            })
            .catch(error => {
                console.error("Failed to decode token:", error);
            });
    }, []);

    const fetchUserInfo = async (memberId) => {
        try {
            const response = await axiosInstance.get(`/members/${memberId}`);

            if (response.status === 200) {
                const data = await response.data; // 응답 데이터는 이미 axiosInstance에서 처리됨
                setUserInfo(data);
            } else {
                handleFetchError("사용자 정보 로드 실패", response.status);
            }
        } catch (error) {
            handleFetchError("API 호출 중 오류 발생", error);
            console.error("API 호출 중 오류 발생:", error.response ? error.response.data : error.message);
        }
    };

    const fetchAttendanceDays = async (memberId) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axiosInstance.get(`http://localhost:8080/attendances/${memberId}/continuous`);
            if (response.status === 200) {
                setAttendanceDays(response.data.continuous);
            } else {
                handleFetchError("연속 출석 일수 로드 실패", response.status);
            }
        } catch (error) {
            handleFetchError("연속 출석 일수 API 호출 중 오류 발생", error);
        }
    };

    const handleFetchError = (message, error) => {
        console.error(message, error);
        setErrorMessage(message);
    };

    const handleLogout = () => {
        try {
            // 서버에 로그아웃 요청 보내기 (쿠키 포함)
            axiosInstance.post("/join/logout", null, {withCredentials: true})
                .then(() => {
                    // 로컬 저장소에서 액세스 토큰 및 회원 ID 제거
                    localStorage.removeItem("accessToken");

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

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            await uploadProfileImage(file);
        }
    };

    const uploadProfileImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axiosInstance.put(`/members/${mid}/image`, formData);
            if (response.status === 201) { // 수정
                setUserInfo((prev) => ({...prev, profileImage: response.data.profileImage})); // 수정
                alert(response.data.message || "이미지 업로드 성공!");
                window.location.reload();
            } else {
                handleFetchError("이미지 업로드 실패", response.status);
            }
        } catch (error) {
            handleFetchError("이미지 업로드 중 오류 발생", error);
        }
    };

    const handleUploadClick = () => {
        document.getElementById("fileInput").click();
    };

    const handleDeleteImage = async () => {
        try {
            const response = await axiosInstance.delete(`/members/${mid}/image`);

            if (response.status === 201) {
                setUserInfo((prev) => ({...prev, profileImage: null}));
                alert("이미지가 성공적으로 삭제되었습니다.");
                window.location.reload();
            } else {
                handleFetchError("이미지 삭제 실패", response.status);
            }
        } catch (error) {
            handleFetchError("이미지 삭제 중 오류 발생", error);
        }
    };

    const handleWithdraw = async () => {
        try {
            const response = await axiosInstance.delete(`/members/${mid}`);

            // 응답 상태가 200인 경우에만 처리
            if (response.status === 200) {
                alert("회원탈퇴가 완료되었습니다.");
                handleLogout();
            } else {
                handleFetchError("회원탈퇴 실패", response.status);
            }
        } catch (error) {
            handleFetchError("회원탈퇴 중 오류 발생", error);
        }
    };


    if (!userInfo) {
        return <LoadingMessage>로딩 중...</LoadingMessage>;
    }

    const profileImageSrc = userInfo.profileImage
        ? `data:image/jpeg;base64,${userInfo.profileImage}`
        : "http://localhost:8080/images/default_profile.jpg";

    return (
        <Container>
            <Title>마이페이지</Title>
            <ProfileSection
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                <ProfilePicture src={profileImageSrc} alt="Profile"/>
                {isHover && (
                    <UploadButton onClick={handleUploadClick}>+</UploadButton>
                )}
                {userInfo.profileImage && (
                    <DeleteButton onClick={handleDeleteImage}>이미지 삭제</DeleteButton>
                )}
                <input
                    type="file"
                    id="fileInput"
                    style={{display: "none"}}
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </ProfileSection>
            <UserInfoSection>
                <UserInfo>
                    <InfoItem><strong>닉네임:</strong> {userInfo.nickname}</InfoItem>
                    <InfoItem><strong>이메일:</strong> {userInfo.email}</InfoItem>
                    <InfoItem><strong>전화번호:</strong> {userInfo.phoneNumber}</InfoItem>
                </UserInfo>
                <AboutSection>
                    <AboutTitle>자기소개</AboutTitle>
                    <AboutContent>{userInfo.introduction || "자기소개가 없습니다."}</AboutContent>
                </AboutSection>
                <TableContainer>
                    <WeeklyStudyTable/>
                    <AttendanceDaysContainer>
                        <DaysTitle>연속 출석 일수</DaysTitle>
                        <DaysCount>{attendanceDays}일</DaysCount>
                    </AttendanceDaysContainer>
                </TableContainer>
                <TableContainer>
                    <YearlyStudyTable/>
                </TableContainer>
            </UserInfoSection>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <ButtonContainer>
                <StyledButton onClick={() => window.location.href = "/edit-profile"}>회원정보 수정</StyledButton>
                <StyledButton onClick={handleLogout}>로그아웃</StyledButton>
                <StyledButton onClick={handleWithdraw}>회원탈퇴하기</StyledButton>
            </ButtonContainer>
        </Container>
    );
};

export default MyPage;

// 스타일 컴포넌트들 (생략)

const Container = styled.div`
    padding: 4rem;
    max-width: 870px;
    margin: auto;
    text-align: center;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 3rem;
`;

const ProfileSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 3rem;
    position: relative;
`;

const UploadButton = styled.button`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #3cb371;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;

    &:hover {
        background-color: #218838;
    }
`;

const DeleteButton = styled.button`
    position: absolute;
    top: 10%;
    right: 10%;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;

    &:hover {
        background-color: #c82333;
    }
`;

const ProfilePicture = styled.img`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin-right: 2rem;
    object-fit: cover;
    border: 5px solid #3cb371;
`;

const UserInfoSection = styled.div`
    text-align: left;
`;

const UserInfo = styled.div`
    font-size: 1.2rem;
`;

const InfoItem = styled.p`
    margin: 0.5rem 0;
`;

const AboutSection = styled.div`
    margin: 2rem 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 1.5rem;
    background-color: #f9f9f9;
`;

const AboutTitle = styled.h2`
    margin: 0;
    font-size: 1.5rem;
`;

const AboutContent = styled.p`
    font-size: 1.1rem;
`;

const TableContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
`;

const LoadingMessage = styled.p`
    font-size: 1.5rem;
    color: #888;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-around;
    margin-top: 2rem;
`;

const StyledButton = styled.button`
    padding: 0.7rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const ErrorMessage = styled.div`
    color: red;
    font-weight: bold;
    margin-top: 1rem;
`;

const AttendanceDaysContainer = styled.div`
    background-color: #f0f8ff;
    border: 1px solid #3cb371;
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
    width: 200px;
    height: 80px;
    margin-left: 1rem;
`;

const DaysTitle = styled.h3`
    font-size: 1.2rem;
    margin: 0;
    color: #3cb371;
`;

const DaysCount = styled.p`
    font-size: 1.8rem;
    font-weight: bold;
    margin: 0.5rem 0 0;
`;