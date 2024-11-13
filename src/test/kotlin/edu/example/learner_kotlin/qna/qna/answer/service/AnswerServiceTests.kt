package edu.example.learner_kotlin.qna.answer.service

import edu.example.learner_kotlin.qna.answer.dto.AnswerDTO
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.test.context.TestPropertySource
import org.springframework.transaction.annotation.Transactional
import kotlin.test.assertEquals

@SpringBootTest
@TestPropertySource(locations = ["classpath:application-test.properties"])
class AnswerServiceTests {
    @Autowired
    lateinit var answerService: AnswerService

    @Test
    fun testReadByInquiryId() {
        val inquiryId = 1L

        answerService.readByInquiryId(inquiryId)?.run {
            assertEquals(inquiryId, this?.inquiryId)
        }
    }

    @Test
    fun testReadAll() {
        answerService.readAll().run {
            assertEquals(10, this.size)
        }
    }

    @Test
    @Transactional
    fun testRegister() {
        val answerDTO = AnswerDTO().apply {
            answerContent = "register test"
            inquiryId = 11L
        }

        answerService.register(answerDTO).run {
            assertEquals("register test", this.answerContent)
        }
    }

    @Test
    @Transactional
    fun testRegisterFailure() {
        val answerDTO = AnswerDTO().apply {
            answerContent = "register failure test"
            inquiryId = 1L
        }

        assertThrows<DataIntegrityViolationException> {
            answerService.register(answerDTO)
        }
    }

    @Test
    @Transactional
    fun testUpdate() {
        val answerDTO = AnswerDTO().apply {
            answerId = 1L
            answerContent = "update test"
        }

        answerService.update(answerDTO).run {
            assertEquals("update test", this.answerContent)
        }
    }

    @Test
    @Transactional
    fun testDelete() {
        val answerId = 1L

        answerService.delete(answerId).run {
            assertThrows<NoSuchElementException> {
                answerService.delete(answerId)
            }
        }
    }

//    @Test
//    @Transactional
//    fun testDeleteByInquiryId() {
//        val inquiryId = 1L
//
//        answerService.deleteByInquiryId(inquiryId).run {
//            assertThrows<NoSuchElementException> {
//                answerService.readByInquiryId(inquiryId)
//            }
//        }
//    }
}