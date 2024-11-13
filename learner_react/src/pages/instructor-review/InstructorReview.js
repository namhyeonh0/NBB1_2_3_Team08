import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Modal from "../../components/Modal";
import axiosInstance from "../axiosInstance";

const InstructorReview = () => {
    const {nickname} = useParams();
    const [reviewList, setReviewList] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [courseList, setCourseList] = useState([]);
    const navigate = useNavigate();
    const [writerId, setWriterId] = useState(null);

    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isFollowerModalOpen, setIsFollowerModalOpen] = useState(false);
    const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        // /token/decode API 호출로 mid 가져오기
        axiosInstance.get('/token/decode')
            .then(response => {
                const {mid} = response.data;
                setWriterId(mid);
            })
            .catch(error => {
                console.error("Error decoding token:", error);
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        fetch(`http://localhost:8080/members/instructor/${nickname}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                console.log("사용자 정보:", data);
            })
            .catch(err => console.error("사용자 정보 가져오기 실패:", err));
    }, []);

    useEffect(() => {
        const fetchFollowInfo = async () => {
            const token = localStorage.getItem("accessToken");

            if (token) {
                try {
                    const followerResponse = await axios.get(`http://localhost:8080/members/${nickname}/follower-count`, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    setFollowerCount(followerResponse.data);

                    const followingResponse = await axios.get(`http://localhost:8080/members/${nickname}/following-count`, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    setFollowingCount(followingResponse.data);

                    const followStatusResponse = await axios.get(`http://localhost:8080/members/follow/${nickname}/isFollowing`, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                        withCredentials: true
                    });
                    setIsFollowing(followStatusResponse.data.isFollowing);
                } catch (err) {
                    console.error("팔로우 정보 가져오기 실패:", err);
                }
            }
        };

        fetchFollowInfo();
    }, [nickname]);

    const fetchFollowers = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await axios.get(`http://localhost:8080/members/${nickname}/follower`, {
                headers: {"Authorization": `Bearer ${token}`},
                params: {writerId: writerId},
                withCredentials: true
            });
            setFollowers(response.data);
            setIsFollowerModalOpen(true);
        } catch (err) {
            console.error("팔로워 목록 가져오기 실패:", err);
        }
    };

    const fetchFollowing = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await axios.get(`http://localhost:8080/members/${nickname}/following`, {
                headers: {"Authorization": `Bearer ${token}`},
                params: {writerId: writerId},  // writerId를 쿼리 파라미터로 전달
                withCredentials: true
            });
            setFollowing(response.data);
            setIsFollowingModalOpen(true);
        } catch (err) {
            console.error("팔로잉 목록 가져오기 실패:", err);
        }
    };

    const toggleFollow = async () => {
        const token = localStorage.getItem("accessToken");

        try {
            if (isFollowing) {
                await axios.delete(`http://localhost:8080/members/follow/${nickname}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    withCredentials: true
                });
                setIsFollowing(false);
                setFollowerCount(prevCount => prevCount - 1);
            } else {
                await axios.post(`http://localhost:8080/members/follow/${nickname}`, {}, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    withCredentials: true
                });
                setIsFollowing(true);
                setFollowerCount(prevCount => prevCount + 1);
            }
        } catch (err) {
            console.error("팔로우 상태 변경 실패:", err);
        }
    };

    const fetchReviews = () => {
        fetch(`http://localhost:8080/members/instructor/${nickname}/reviews/list`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                console.log("Fetched instructor reviews:", data);
                setReviewList(data);
                calculateAverageRating(data);
            })
            .catch(err => console.error("리뷰 가져오기 실패:", err));
    };

    const fetchCourses = () => {
        fetch(`http://localhost:8080/course/instructor/list/${nickname}`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                console.log("Fetched courses:", data);
                setCourseList(data);
            })
            .catch(err => console.error("강의 목록 가져오기 실패:", err));
    };

    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) {
            setAverageRating(0);
            return;
        }
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating((totalRating / reviews.length).toFixed(1));
    };

    useEffect(() => {
        fetchReviews();
        fetchCourses();
    }, [nickname]);

    const handleDelete = (reviewId) => {
        const token = localStorage.getItem("accessToken");
        if (window.confirm("정말 삭제하시겠습니까?")) {
            fetch(`http://localhost:8080/members/instructor/${nickname}/reviews/${reviewId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({writerId})
            })
                .then(() => {
                    setReviewList(reviewList.filter(review => review.reviewId !== reviewId));
                    alert("리뷰가 삭제되었습니다.");
                })
                .catch(err => console.error("리뷰 삭제 실패:", err));
        }
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', options).replace(',', '');
    };

    const handleMemberClick = (memberId) => {
        console.log('memberId:', memberId);

        axios
            .get(`http://localhost:8080/members/${memberId}`, {withCredentials: true})
            .then((response) => {
                const memberData = response.data;
                console.log("Member data:", memberData);
                navigate(`/members/${memberId}`, {state: {memberData}});
            })
            .catch((error) => {
                console.error("Error fetching member details:", error);
            });
    };

    const calculateRatingColor = (rating) => {
        switch (rating) {
            case 1:
                return "#ff4d4f"; // 빨간색
            case 2:
                return "#ffa500"; // 주황색
            case 3:
                return "#ffd700"; // 노란색
            case 4:
                return "#28a745"; // 초록색
            case 5:
                return "#1890ff"; // 파란색
            default:
                return "#333";
        }
    };

    return (
        <div>
            <div className="follow-container">
                <button
                    onClick={toggleFollow}
                    className={`follow-button ${isFollowing ? 'following' : ''}`}
                >
                    {isFollowing ? "팔로잉" : "팔로우"}
                </button>
                <span className="follower-count" onClick={fetchFollowers}>
                    팔로워: {followerCount}
                </span>
                <span className="following-count" onClick={fetchFollowing}>
                    팔로잉: {followingCount}
                </span>
            </div>

            {isFollowerModalOpen && (
                <Modal title="팔로워 목록" onClose={() => setIsFollowerModalOpen(false)}>
                    <ul className="modal-content">
                        {followers.map(follower => (
                            <li key={follower.memberId} className="modal-item">
                                <div className="modal-item-info">
                                    <span className="nickname">{follower.nickname}</span>
                                    <span
                                        className={`follow-status ${follower.isFollowing ? "following" : "not-following"}`}>
                            {follower.isFollowing ? "팔로잉" : "팔로우"}
                        </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Modal>
            )}

            {isFollowingModalOpen && (
                <Modal title="팔로잉 목록" onClose={() => setIsFollowingModalOpen(false)}>
                    <ul>
                        {following.map(followed => (
                            <li key={followed.memberId}>{followed.nickname}</li>
                        ))}
                    </ul>
                </Modal>
            )}


            <div className="course-list">
                {Array.isArray(courseList) ? (
                    courseList.map(course => (
                        <li key={course.courseId} className="course-item">
                            <Link to={`/courses/${course.courseId}`}>{course.courseName}</Link>
                        </li>
                    ))
                ) : (
                    <p>강의 목록을 불러오는 데 실패했습니다.</p>
                )}
            </div>
            <div className="review-container">
                <h2 className="review-header">강사 리뷰</h2>
                <h3 className="average-rating">평균 평점: {averageRating} / 5</h3>
                <button
                    className="add-review-button"
                    onClick={() => navigate(`/members/instructor/${nickname}/reviews/create`)}
                >
                    리뷰 작성
                </button>
                <ul className="review-list">
                    {reviewList.map(review => (
                        <li key={review.reviewId} className="review-item">
                            <div className="review-content">
                                <h3 className="review-title">{review.reviewName}</h3>
                                <p className="review-detail">{review.reviewDetail}</p>
                                <p className="course-name"> 강의 제목 : {review.courseName}</p>
                                <span
                                    className="review-rating"
                                    style={{color: calculateRatingColor(review.rating)}}
                                >
                                    평점: {review.rating} / 5
                                </span>
                                <div>
                                    <span
                                        style={{
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                            color: "blue",
                                            marginRight: "10px"
                                        }}
                                        onClick={() => handleMemberClick(review.writerId)}
                                    >
                                        작성자: {review.writerName || '알 수 없음'}
                                    </span>
                                </div>
                                <p className="review-updatedDate"> 수정일 : {formatDate(review.reviewUpdatedDate)}</p>
                            </div>
                            <div className="button-group">
                                {String(writerId) === String(review.writerId) && (
                                    <>
                                        <button onClick={() => handleDelete(review.reviewId)}
                                                className="delete-button">삭제
                                        </button>
                                        <Link to={`/members/instructor/${nickname}/reviews/${review.reviewId}`}
                                              className="edit-button">수정</Link>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
                <style jsx>{`
                    .course-list {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 20px;
                        margin: 0 auto 30px;
                        padding: 0;
                        list-style-type: none;
                    }

                    .course-item {
                        padding: 10px 15px;
                        background-color: #ffffff;
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        transition: transform 0.2s;
                    }

                    .course-item:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                    }

                    .course-item a {
                        text-decoration: none;
                        color: #007bff;
                        font-size: 16px;
                        font-weight: bold;
                        display: block;
                    }

                    .course-item a:hover {
                        color: #0056b3;
                    }

                    .review-container {
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 30px;
                        background-color: #f8f9fa;
                        border-radius: 12px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        position: relative;
                    }

                    .review-header {
                        font-size: 28px;
                        color: #333;
                        margin-bottom: 10px;
                        border-bottom: 2px solid #28a745;
                        padding-bottom: 15px;
                    }

                    .average-rating {
                        font-size: 20px;
                        color: #28a745;
                        margin-bottom: 30px;
                    }

                    .add-review-button {
                        position: absolute;
                        top: 30px;
                        right: 30px;
                        padding: 12px 20px;
                        background-color: #28a745;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        text-decoration: none;
                        font-size: 16px;
                    }

                    .add-review-button:hover {
                        background-color: #218838;
                    }

                    .review-list {
                        list-style-type: none;
                        padding: 0;
                    }

                    .review-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        background-color: #fff;
                        border-radius: 10px;
                        padding: 20px;
                        margin-bottom: 20px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        transition: transform 0.2s;
                    }

                    .review-item:hover {
                        transform: translateY(-3px);
                    }

                    .review-content {
                        flex-grow: 1;
                        margin-right: 20px;
                    }

                    .review-title {
                        font-weight: bold;
                        font-size: 18px;
                        margin: 0 0 10px;
                    }

                    .review-detail {
                        margin: 0 0 10px;
                    }

                    .course-name {
                        font-size: 1rem;
                        color: #333;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .review-rating {
                        font-size: 16px;
                        font-weight: bold;
                    }

                    .review-updatedDate {
                        font-size: 12px;
                        color: #999;
                    }

                    .button-group {
                        display: flex;
                        align-items: center;
                        justify-content: flex-end; /* 오른쪽 정렬 유지 */
                    }

                    .delete-button {
                        padding: 8px 12px;
                        background-color: #dc3545;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-right: 10px;
                    }

                    .delete-button:hover {
                        background-color: #c82333;
                    }

                    .edit-button {
                        margin-top: 10px;
                        padding: 8px 12px;
                        background-color: #007bff;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        text-decoration: none;
                    }

                    .edit-button:hover {
                        background-color: #0069d9;
                    }

                    .follow-container {
                        display: flex;
                        align-items: center;
                        gap: 20px;
                        margin-bottom: 20px;
                    }

                    .follow-button {
                        padding: 10px 20px;
                        border: 1px solid transparent;
                        border-radius: 20px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        color: white;
                        outline: none;
                    }

                    .follow-button {
                        background-color: #28a745;
                        border: 1px solid #28a745;
                    }

                    .follow-button:hover {
                        background-color: #218838;
                        border-color: #218838;
                    }

                    .follow-button.following {
                        background-color: #6c757d;
                        color: white;
                        border: 1px solid #6c757d;
                    }

                    .follow-button.following:hover {
                        background-color: #5a6268;
                        border-color: #5a6268;
                    }

                    .modal-content {
                        padding: 20px;
                        background: #fff;
                        border-radius: 10px;
                        max-height: 400px; /* 모달 높이를 조정하여 크기 깨짐 방지 */
                        max-width: 500px; /* 모달 너비를 고정하여 깨짐 방지 */
                        margin: 0 auto;
                        overflow-y: auto;
                        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
                    }

                    .modal-item {
                        display: flex;
                        align-items: center;
                        justify-content: space-between; /* 양 끝 정렬 */
                        padding: 10px 0;
                        border-bottom: 1px solid #e0e0e0;
                    }

                    .modal-item:last-child {
                        border-bottom: none;
                    }

                    .modal-item-info {
                        display: flex;
                        width: 100%;
                        justify-content: space-between; /* 닉네임과 상태를 양쪽 끝에 배치 */
                        align-items: center;
                    }

                    .nickname {
                        font-size: 16px;
                        font-weight: 500;
                        color: #333;
                    }

                    .follow-status {
                        font-size: 14px;
                        font-weight: bold;
                    }

                    .follow-status.following {
                        color: #28a745;
                    }

                    .follow-status.not-following {
                        color: #007bff;
                        cursor: pointer;
                    }

                    .follower-count,
                    .following-count {
                        cursor: pointer;
                        color: #007bff;
                        font-size: 16px;
                    }

                    .follower-count:hover,
                    .following-count:hover {
                        text-decoration: underline;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default InstructorReview;
