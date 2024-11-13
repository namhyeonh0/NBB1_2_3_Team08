package edu.example.learner_kotlin.studytable.service

import edu.example.learner_kotlin.studytable.dto.StudyTableDTO
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

@SpringBootTest
@TestPropertySource(locations = ["classpath:application-test.properties"])
class StudyTableServiceTests {
    @Autowired
    private lateinit var studyTableService: StudyTableService

    @Test
    fun testRead() {
        val studyTableId = 1L

        studyTableService.read(studyTableId).run {
            assertEquals(studyTableId, this.studyTableId)
        }
    }

    @Test
    fun testReadByDate() {
        val memberId = 1L

        studyTableService.readByDate(memberId).run {
            assertTrue(this)
        }
    }

    @Test
    fun testReadDTOByDate() {
        val memberId = 1L

        studyTableService.readDTOByDate(memberId).run {
            assertEquals(memberId, this.memberId)
        }
    }

    @Test
    @Transactional
    fun register() {
        val studyTableDTO = StudyTableDTO().apply {
            studyTime = 20
            completed = 1
            memberId = 1L
        }

        studyTableService.register(studyTableDTO).run {
            assertEquals(memberId, this.memberId)
        }
    }

    @Test
    @Transactional
    fun testUpdate() {
        val studyTableDTO = StudyTableDTO().apply {
            studyTableId = 1L
            studyTime = 60
            completed = 2
        }

        studyTableService.update(studyTableDTO).run {
            assertEquals(studyTime, this.studyTime)
        }
    }

    @Test
    @Transactional
    fun testDelete() {
        val studyTableDTO = StudyTableDTO().apply {
            studyTableId = 1L
        }

        studyTableService.delete(studyTableDTO).run {
            assertThrows<NoSuchElementException> {
                studyTableService.delete(studyTableDTO)
            }
        }
    }

    @Test
    fun testGetWeeklyStudyTime() {
        val memberId = 1L
        val localDate = LocalDate.now()

        studyTableService.getWeeklyStudyTime(memberId, localDate).run {
            assertEquals(30, this)
        }
    }

    @Test
    fun testGetYearlyStudyTime() {
        val memberId = 1L
        val year = 2024

        studyTableService.getYearlyStudyTime(memberId, year).run {
            assertEquals(30, this)
        }
    }

    @Test
    fun testGetWeeklyCompleted() {
        val memberId = 1L
        val localDate = LocalDate.now()

        studyTableService.getWeeklyCompleted(memberId, localDate).run {
            assertEquals(1, this)
        }
    }

//    @Test
//    fun testGetMonthlyCompleted() {
//        val memberId = 1L
//        val month = 10
//
//        studyTableService.getMonthlyCompleted(memberId, month).run {
//            assertEquals(1, this)
//        }
//    }

    @Test
    fun testGetYearlyCompleted() {
        val memberId = 1L
        val year = 2024

        studyTableService.getYearlyCompleted(memberId, year).run {
            assertEquals(1, this)
        }
    }

    @Test
    fun testGetWeeklySummary() {
        val memberId = 1L
        val localDate = LocalDate.now()

        studyTableService.getWeeklySummary(memberId, localDate).run {
            assertNotNull(this)
        }
    }

    @Test
    fun testGetYearlySummary() {
        val memberId = 1L
        val year = 2024

        studyTableService.getYearlySummary(memberId, year).run {
            assertNotNull(this)
        }
    }
}