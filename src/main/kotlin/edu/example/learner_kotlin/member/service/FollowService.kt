package edu.example.learner_kotlin.member.service

import edu.example.learner_kotlin.log
import edu.example.learner_kotlin.member.dto.FollowDTO
import edu.example.learner_kotlin.member.entity.Follow
import edu.example.learner_kotlin.member.entity.FollowStatus
import edu.example.learner_kotlin.member.entity.Member
import edu.example.learner_kotlin.member.exception.MemberException
import edu.example.learner_kotlin.member.repository.FollowRepository
import edu.example.learner_kotlin.member.repository.MemberRepository
import jakarta.transaction.Transactional
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
@Transactional
class FollowService(
    private val memberRepository: MemberRepository,
    private val followRepository: FollowRepository
) {

    fun followUser(followerUsername: String?, followingUsername: String?): String {
        val user: Member? = memberRepository.findByNickname(followerUsername)?.orElseThrow {
            RuntimeException("Follower not found")
        }
        val want: Member? = memberRepository.findByNickname(followingUsername)?.orElseThrow {
            RuntimeException("Following not found")
        }
        if (user == want) {
            throw RuntimeException("동일인물입니다.")
        }
        if (followRepository!!.existsByFollowerAndFollowing(user, want)) {
            return "이미 팔로우 중입니다."
        }

        val follow = Follow()
        follow.follower = user
        follow.following = want
        followRepository.save(follow)

        return "팔로우 성공!"
    }

    fun unfollowUser(followerUsername: String?, followingUsername: String?) {
        val follower: Member? = memberRepository.findByNickname(followerUsername)?.orElseThrow {
            RuntimeException("Follower not found")
        }
        val following: Member? = memberRepository.findByNickname(followingUsername)?.orElseThrow {
            RuntimeException("Follower not found")
        }

        try {
            if (!followRepository!!.existsByFollowerAndFollowing(follower, following)) {
                return
            }
            log.info("delete follow")
            followRepository.deleteByFollowerAndFollowing(follower, following)
        } catch (e: Exception) {
            log.info(e.message)
            throw RuntimeException("")
        }
    }

    fun followerList(requestId: Long, memberName: String): List<FollowDTO> {
        val requestUser=memberRepository.findByIdOrNull(requestId)?:
        throw MemberException.MEMBER_NOT_FOUND.memberTaskException

        val user = memberRepository.findByNickname(memberName)?.orElseThrow {
            RuntimeException("User not found")
        } ?: throw RuntimeException("User not found")

        val findList = followRepository.findByFollowing(user) ?: emptyList()
        val followingList = mutableListOf<FollowDTO>()

        for (follow in findList) {
            val member = follow?.follower ?: continue // member가 null인 경우를 방어하기 위해 continue 사용
            log.info(member)
            followingList.add(FollowDTO(member, FollowStatus.FOLLOWING))
        }

        return followingList
    }

    fun followingList(requestId: Long, memberName: String): List<FollowDTO> {
        val requestUser=memberRepository.findByIdOrNull(requestId)?:
        throw MemberException.MEMBER_NOT_FOUND.memberTaskException

        val user = memberRepository.findByNickname(memberName)?.orElseThrow {
            RuntimeException("User not found")
        } ?: throw RuntimeException("User not found")

        val findList = followRepository.findByFollower(user) ?: emptyList()
        val followerList = mutableListOf<FollowDTO>()

        for (follow in findList) {
            val member = follow?.following ?: continue // follower 필드 참조
            val status = findStatus(requestUser, member)
            followerList.add(FollowDTO(member, status))
        }

        return followerList
    }

    private fun findStatus(following: Member?, follower: Member?): FollowStatus? {
        if (following === follower) {
            return null
        } else if (!followRepository!!.existsByFollowerAndFollowing(follower, following)) {
            return null
        }
        return FollowStatus.FOLLOWING
    }

    fun isFollowing(followerUsername: String, followingUsername: String): Boolean {
        val follower = memberRepository.findByNickname(followerUsername)?.orElseThrow {
            RuntimeException("User not found")
        }?: throw RuntimeException("Follower not found")
        val following = memberRepository.findByNickname(followingUsername)?.orElseThrow {
            RuntimeException("User not found")
        }?: throw RuntimeException("Following not found")

        return followRepository.existsByFollowerAndFollowing(follower, following)
    }

    // 팔로워 수 조회
    fun getFollowerCount(nickName: String): Long {
        val member = memberRepository.findByNickname(nickName)?.orElseThrow {
            RuntimeException("User not found")
        }?: throw RuntimeException("Follower not found")
        return followRepository.countByFollowing(member)
    }

    // 팔로잉 수 조회
    fun getFollowingCount(nickName: String): Long {
        val member = memberRepository.findByNickname(nickName)?.orElseThrow {
            RuntimeException("User not found")
        }?: throw RuntimeException("Following not found")
        return followRepository.countByFollower(member)
    }
}
