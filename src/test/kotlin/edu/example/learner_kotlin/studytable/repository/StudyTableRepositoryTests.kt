package edu.example.learner_kotlin.studytable.repository

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource
import java.time.LocalDate
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

@SpringBootTest
@TestPropertySource(locations = ["classpath:application-test.properties"])
class StudyTableRepositoryTests {
    @Autowired
    lateinit var studyTableRepository: StudyTableRepository

    @Test
    fun testGetWeeklyStudyTime() {
        val memberId = 1L
        val startDate = LocalDate.of(2024, 10, 27)
        val endDate = LocalDate.now()

        studyTableRepository.getWeeklyStudyTime(memberId, startDate, endDate).run {
            assertThat(this).isGreaterThan(0)
        }
    }

    @Test
    fun testGetYearlyStudyTime() {
        val memberId = 1L
        val year = 2024

        studyTableRepository.getYearlyStudyTime(memberId, year).run {
            assertThat(this).isGreaterThan(0)
        }
    }

    @Test
    fun testGetWeeklyCompleted() {
        val memberId = 1L
        val startDate = LocalDate.of(2024, 10, 27)
        val endDate = LocalDate.now()

        studyTableRepository.getWeeklyCompleted(memberId, startDate, endDate).run {
            assertThat(this).isGreaterThan(0)
        }
    }

//    @Test
//    fun testGetMonthlyCompleted() {
//        val memberId = 1L
//        val month = 10
//
//        studyTableRepository.getMonthlyCompleted(memberId, month).run {
//            assertThat(this).isGreaterThan(0)
//        }
//    }

    @Test
    fun testGetYearlyCompleted() {
        val memberId = 1L
        val year = 2024

        studyTableRepository.getYearlyCompleted(memberId, year).run {
            assertThat(this).isGreaterThan(0)
        }
    }

    @Test
    fun testGetWeeklySummary() {
        val memberId = 1L
        val startDate = LocalDate.of(2024, 10, 27)
        val endDate = LocalDate.now()

        studyTableRepository.getWeeklySummary(memberId, startDate, endDate).run {
            assertEquals(1, this.size)
        }
    }

    @Test
    fun testGetYearlySummary() {
        val memberId = 1L
        val year = 2024

        studyTableRepository.getYearlySummary(memberId, year).run {
            assertNotNull(this)
        }
    }

    @Test
    fun testFindByDate() {
        val memberId = 1L
        val date = LocalDate.now()

        studyTableRepository.findByDate(date, memberId).run {
            assertEquals(date, this?.studyDate)
        }
    }
}