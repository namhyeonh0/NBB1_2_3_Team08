package edu.leranermig.courseabout.repository

import edu.example.learner_kotlin.LearnerKotlinApplication
import edu.example.learner_kotlin.courseabout.course.dto.CourseDTO
import edu.example.learner_kotlin.courseabout.course.entity.Course
import edu.example.learner_kotlin.courseabout.course.entity.CourseAttribute
import edu.example.learner_kotlin.courseabout.course.repository.CourseRepository
import edu.example.learner_kotlin.member.repository.MemberRepository
import jakarta.transaction.Transactional
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.MethodOrderer
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestMethodOrder
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.repository.findByIdOrNull
import org.springframework.test.context.TestPropertySource

@SpringBootTest(classes = [LearnerKotlinApplication::class])
@TestMethodOrder(MethodOrderer.OrderAnnotation::class)
@TestPropertySource(locations = ["classpath:application-test.properties"])
class CourseRepositoryTests
{
    @Autowired
    lateinit var courseRepository: CourseRepository

    @Autowired
    lateinit var memberRepository: MemberRepository

    @Autowired
    lateinit var modelMapper: ModelMapper

    @BeforeEach
    fun setUp() {
        courseRepository.deleteAll()
        memberRepository.deleteAll()

        courseRepository.saveAll(listOf(
            Course().apply {
                courseName = "JAVA TEST"
                coursePrice = 10000
                courseDescription = "Java 강의"
                courseLevel = 1
                sale = false
                courseAttribute = CourseAttribute.JAVA
            },
            Course().apply {
                courseName = "JAVA TEST 2"
                coursePrice = 20000
                courseDescription = "Java 강의 2"
                courseLevel = 2
                sale = true
                courseAttribute = CourseAttribute.JAVA
            }
        ))
    }

//    @Test
//    @DisplayName("강의 속성으로 강의 목록을 읽는다.")
//    fun readByCourseAttribute() {
//        val courseList = courseRepository.readByCourseAttribute(CourseAttribute.JAVA)
//        Assertions.assertThat(courseList).isNotNull()
//        Assertions.assertThat(courseList.size).isEqualTo(2)
//    }

//    @Test
//    @Transactional
//    @DisplayName("강의를 업데이트 한다.")
//    fun updateCourse() {
//        val courseDTO = CourseDTO().apply {
//            courseId = 1
//            courseName = "MOD TEST"
//            coursePrice = 10000
//            courseDescription = "MOD"
//            sale = false
//        }
//
//        var course = courseRepository.findByIdOrNull(courseDTO.courseId!!)
//        course!!.apply {
//            courseName = courseDTO.courseName
//            coursePrice = courseDTO.coursePrice
//            courseDescription = courseDTO.courseDescription
//            sale = true
//        }
//        var updatedCourse = courseRepository.save(course)
//
//        Assertions.assertThat(updatedCourse.courseDescription).isEqualTo("MOD")
//    }

//    @Test
//    @DisplayName("강의를 삭제한다.")
//    fun deleteCourse() {
//        courseRepository.deleteById(2L)
//        val deletedCourse = courseRepository.findById(2L)
//        Assertions.assertThat(deletedCourse).isEmpty()
//    }

//    @Test
//    @DisplayName("모든 강의를 읽는다.")
//    fun readAll() {
//        val courseList = courseRepository.findAll()
//        Assertions.assertThat(courseList).isNotNull()
//        Assertions.assertThat(courseList.size).isGreaterThan(1)
//    }
}
