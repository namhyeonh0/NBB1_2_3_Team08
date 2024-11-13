import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axiosInstance from '../axiosInstance'; // axiosInstance import

const CourseReview = ({courseId}) => {
    const navigate = useNavigate();
    const [reviewList, setReviewList] = useState([]);
    const [userNickname, setUserNickname] = useState('');
    const [userId] = useState('');
    const [writerId, setWriterId] = useState(null);

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
        const fetchMemberData = async () => {
            if (writerId && !userNickname && !userId) {
                try {
                    const res = await axiosInstance.get(`/members/${writerId}`);
                    console.log("사용자 정보:", res.data);
                    setUserNickname(res.data.nickname);
                    // setUserId(res.data.writerId);
                } catch (err) {
                    console.error("사용자 정보 가져오기 실패:", err);
                }
            }
        };
        fetchMemberData();
    }, [userNickname, userId]);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchReviews = async () => {
        await delay(300);
        axiosInstance
            .get(`/course/${courseId}/reviews/list`)
            .then(response => {
                console.log("Fetched reviews:", response.data);
                setReviewList(response.data);
            })
            .catch(err => {
                console.error("리뷰 가져오기 실패:", err);
            });
    };

    useEffect(() => {
        fetchReviews();
    }, [courseId]);

    const handleDelete = (reviewId) => {
        const token = localStorage.getItem("accessToken");
        if (window.confirm("정말 삭제하시겠습니까?")) {
            fetch(`http://localhost:8080/course/${courseId}/reviews/${reviewId}`, {
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

    const calculateAverageRating = () => {
        if (reviewList.length === 0) return 0;
        const totalRating = reviewList.reduce((acc, review) => acc + review.rating, 0);
        return (totalRating / reviewList.length).toFixed(1);
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

    const handleMemberClick = (writerId) => {
        console.log('writerId:', writerId);

        const token = localStorage.getItem("accessToken");

        axiosInstance.get(`/members/${writerId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            withCredentials: true,
        })
            .then((response) => {
                const memberData = response.data;
                console.log("Member data:", memberData);
                navigate(`/members/${writerId}`, {state: {memberData}});
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
        <div className="review-container">
            <h2 className="review-header">과정 리뷰</h2>
            <Link to={`/courses/${courseId}/reviews/create`} className="add-review-button">리뷰 작성</Link>

            <h3 className="average-rating">평균 평점: {calculateAverageRating()} / 5</h3>

            <ul className="review-list">
                {reviewList.map(review => (
                    <li key={review.reviewId} className="review-item">
                        <div className="review-content">
                            <h3 className="review-title">{review.reviewName}</h3>
                            <p className="review-detail">{review.reviewDetail}</p>
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
                                    <button onClick={() => handleDelete(review.reviewId)} className="delete-button">삭제
                                    </button>
                                    <Link to={`/courses/${courseId}/reviews/${review.reviewId}`}
                                          className="edit-button">수정</Link>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            <style jsx>{`
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
                    margin-bottom: 30px;
                    border-bottom: 2px solid #28a745;
                    padding-bottom: 15px;
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

                .average-rating {
                    font-size: 22px;
                    color: #28a745;
                    margin-top: 20px;
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
                    font-size: 20px;
                    margin: 0;
                }

                .review-detail {
                    margin: 8px 0;
                    font-size: 16px;
                    color: #555;
                }

                .review-rating {
                    font-size: 16px;
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
                    background-color: #28a745;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    text-decoration: none;
                }

                .edit-button:hover {
                    background-color: #218838;
                }
            `}</style>
        </div>
    );
};

export default CourseReview;
