package edu.example.learner_kotlin.attendance.repository

import edu.example.learner_kotlin.log
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource
import java.time.LocalDate
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue

@SpringBootTest
@TestPropertySource(locations = ["classpath:application-test.properties"])
class AttendanceRepositoryTests {
    @Autowired
    lateinit var attendanceRepository: AttendanceRepository

    @Test
    fun testFindByMemberIdAndDate() {
        val memberId1 = 1L
        val memberId2 = 2L
        val date1 = LocalDate.now()
        val date2 = LocalDate.of(2024, 10, 30)

        attendanceRepository.findByMemberIdAndDate(memberId1, date1).run {
            log.info(this.toString())
            assertNotNull(this)
        }
        attendanceRepository.findByMemberIdAndDate(memberId1, date2).run {
            assertNull(this)
        }
        attendanceRepository.findByMemberIdAndDate(memberId2, date1).run {
            assertNull(this)
        }
        attendanceRepository.findByMemberIdAndDate(memberId2, date2).run {
            assertNull(this)
        }
    }

    @Test
    fun testFindByMemberId() {
        val memberId1 = 1L
        val memberId2 = 2L

        attendanceRepository.findByMemberId(memberId1).run {
            assertEquals(1, this.size)
        }
        attendanceRepository.findByMemberId(memberId2).run {
            assertTrue(this.isEmpty())
        }
    }

    @Test
    fun testFindByMemberIdAndWeek() {
        val memberId = 1L
        val startDate = LocalDate.now()
        val endDate = LocalDate.now()

        attendanceRepository.findByMemberIdAndWeek(memberId, startDate, endDate).run {
            assertEquals(1, this.size)
        }
    }

    @Test
    fun testFindContinuousByMemberIdAndDate() {
        val memberId = 1L
        val date = LocalDate.now()

        attendanceRepository.findContinuousByMemberIdAndDate(memberId, date).run {
            assertEquals(1, this)
        }
    }

    @Test
    fun testCountAttendanceDaysOfYearByMemberIdAndYear() {
        val memberId = 1L
        val year = 2024

        attendanceRepository.countAttendanceDaysOfYearByMemberIdAndYear(memberId, year).run {
            assertEquals(1, this)
        }
    }
}