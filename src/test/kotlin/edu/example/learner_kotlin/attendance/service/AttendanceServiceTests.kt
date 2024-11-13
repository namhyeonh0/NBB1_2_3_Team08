package edu.example.learner_kotlin.attendance.service

import edu.example.learner_kotlin.attendance.dto.AttendanceDTO
import edu.example.learner_kotlin.log
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import kotlin.test.assertEquals
import kotlin.test.assertTrue

@SpringBootTest
@TestPropertySource(locations = ["classpath:application-test.properties"])
class AttendanceServiceTests {
    @Autowired
    lateinit var attendanceService: AttendanceService

    @Test
    fun testRead() {
        val attendanceId = 1L

        attendanceService.read(attendanceId).run {
            assertEquals(attendanceId, this.attendanceId)
        }
    }

    @Test
    fun testReadByMemberIdAndDate() {
        val memberId = 1L
        val date = LocalDate.now()

        attendanceService.readByMemberIdAndDate(memberId, date).run {
            assertEquals(memberId, this.memberId)
        }
    }

    @Test
    fun testReadByMemberId() {
        val memberId = 1L

        attendanceService.readByMemberId(memberId).run {
            log.info(this.toString())
            assertEquals(1, this.size)
        }
    }

    @Test
    fun testIsAttended() {
        val memberId = 1L
        val date = LocalDate.now()

        attendanceService.isAttended(memberId, date).run {
            assertTrue(this)
        }
    }

    @Test
    @Transactional
    fun testCreate() {
        val attendanceDTO1 = AttendanceDTO().apply {
            attendanceDate = LocalDate.now()
            memberId = 1L
        }
        val attendanceDTO2 = AttendanceDTO().apply {
            attendanceDate = LocalDate.now()
            memberId = 2L
        }

        assertThrows<Exception> {
            attendanceService.create(attendanceDTO1)
        }
        attendanceService.create(attendanceDTO2).run {
            assertEquals(2L, this?.attendanceId)
        }
    }

    @Test
    @Transactional
    fun testUpdate() {
        val attendanceDTO = AttendanceDTO().apply {
            attendanceId = 1L
            continuous = 2
        }

        attendanceService.update(attendanceDTO).run {
            assertEquals(continuous, this.continuous)
        }
    }

    @Test
    @Transactional
    fun testDelete() {
        val attendanceId = 1L

        attendanceService.delete(attendanceId).run {
            assertThrows<NoSuchElementException> {
                attendanceService.delete(attendanceId)
            }
        }
    }

    @Test
    fun testGetWeeklySummary() {
        val memberId = 1L
        val date = LocalDate.now()

        attendanceService.getWeeklySummary(memberId, date).run {
            assertEquals(1, this.size)
        }
    }

//    @Test
//    fun testGetYearlySummary() {
//        val memberId = 1L
//        val year = LocalDate.now().year
//
//        attendanceService.getYearlySummary(memberId, year).run {
//            assertEquals(1, this.size)
//        }
//    }

    @Test
    fun testGetContinuous() {
        val memberId = 1L
        val date = LocalDate.now()

        attendanceService.getContinuous(memberId, date).run {
            assertEquals(1, this)
        }
    }

    @Test
    fun testGetYearlyAttendanceDays() {
        val memberId = 1L
        val year = 2024

        attendanceService.getYearlyAttendanceDays(memberId, year).run {
            assertEquals(1, this)
        }
    }
}