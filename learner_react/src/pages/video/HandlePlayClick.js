import axios from "../axiosInstance";

const extractVideoId = (url) => {
    const regex = /[?&]v=([^&#]*)/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

const navigateToVideoPlayer = (navigate, video, courseId) => {
    const youtubeId = extractVideoId(video.url);
    navigate(`/video/${video.videoId}/play`, {
        state: {
            videoEntityId: video.videoId,
            youtubeId: youtubeId,
            courseId: courseId // courseId를 state에 추가
        }
    });
};

export const handlePlayClick = async (courseId, video, navigate, setError) => {
    try {
        // 토큰에서 role과 memberId 추출
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("로그인 후 이용해주세요");
            return;
        }

        // 토큰 디코딩하여 role과 memberId 가져오기
        const response = await axios.get('/token/decode');
        const {role, mid, username} = response.data;

        // USER 역할일 경우 구매 여부 확인
        if (role === "ROLE_USER") {
            try {
                const purchaseResponse = await axios.get(`/course/${courseId}/purchase?memberId=${mid}`);

                console.log(purchaseResponse.status)
                // 상태 코드가 200일 때 (구매 완료 시) 비디오 재생 페이지로 이동
                if (purchaseResponse.status === 200) {
                    const purchased = purchaseResponse.data;

                    if (typeof purchased === 'boolean' && purchased) {
                        navigateToVideoPlayer(navigate, video, courseId); // 구매 후 비디오 재생 페이지로 이동
                    } else {
                        alert("비디오 구매 여부 확인에 실패했습니다.");
                    }
                }
            } catch (error) {
                // 404 오류가 발생하면 비디오 구매 필요 알림
                if (error.response && error.response.status === 404) {
                    alert("비디오 구매가 필요합니다.");
                } else {
                    // 기타 오류 처리
                    alert("구매 여부 확인 중 오류가 발생했습니다.");
                }
            }
        }

        // INSTRUCTOR 역할일 경우
        else if (role === "ROLE_INSTRUCTOR") {
            if (!video.courseId) {
                console.error("비디오 객체에서 course_Id를 찾을 수 없습니다:", video);
                alert("비디오 정보를 확인할 수 없습니다.");
                return;
            }

            const courseResponse = await axios.get(`http://localhost:8080/course/${video.courseId}`);
            const courseData = courseResponse.data;

            console.log("courseData.memberNickname : " + courseData.memberNickname + " memberNickname :" + username)

            if (courseData.memberNickname === username) {
                navigateToVideoPlayer(navigate, video, courseId); // 본인의 비디오일 경우 비디오 재생 페이지로 이동
            } else {
                alert("본인의 비디오가 아닙니다."); // 본인의 비디오가 아닐 경우 알림
            }
        }
        // ADMIN 역할일 경우
        else if (role === "ROLE_ADMIN") {
            navigateToVideoPlayer(navigate, video, courseId); // ADMIN일 경우 비디오 재생 페이지로 이동
        } else {
            alert("권한이 없습니다.");
        }
    } catch (error) {
        console.error("구매 확인 중 오류 발생:", error);
        setError("구매 확인에 실패했습니다.");
    }
};
