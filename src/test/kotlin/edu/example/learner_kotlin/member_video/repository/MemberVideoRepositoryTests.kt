package edu.example.learner_kotlin.member_video.repository

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNull

@SpringBootTest
@TestPropertySource(locations = ["classpath:application-test.properties"])
class MemberVideoRepositoryTests {
    @Autowired
    lateinit var memberVideoRepository : MemberVideoRepository

    @Test
    fun testFindByMemberIdAndVideoId() {
        val memberId = 1L
        val videoId = 1L

        memberVideoRepository.findByMemberIdAndVideoId(memberId, videoId)!!.run {
            assertEquals(20, this.studyTime)
            assertFalse(this.watched!!)
        }
    }

//    @Test
//    fun testFindByMemberIdAndVideoIdFailure() {
//        val memberId = 2L
//        val videoId = 1L
//
//        memberVideoRepository.findByMemberIdAndVideoId(memberId, videoId)?.let {
//            assertNull(this)
//        }
//    }

    @Test
    fun testAverageByVideoId() {
        val videoId = 1L

        memberVideoRepository.averageByVideoId(videoId)!!.run {
            assertEquals(30.0, this)
        }
    }

    @Test
    fun testAverageByVideoIdFailure() {
        val videoId = 3L

        memberVideoRepository.averageByVideoId(videoId)?.let {
            assertNull(this)
        }
    }
}