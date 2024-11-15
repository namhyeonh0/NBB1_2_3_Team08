package edu.example.learner_kotlin.courseabout.video.service



import edu.example.learner_kotlin.courseabout.course.entity.Course
import edu.example.learner_kotlin.courseabout.course.repository.CourseRepository
import edu.example.learner_kotlin.courseabout.exception.CourseException
import edu.example.learner_kotlin.courseabout.video.dto.VideoCreateDTO
import edu.example.learner_kotlin.log
import edu.example.learner_kotlin.courseabout.video.dto.VideoDTO
import edu.example.learner_kotlin.courseabout.video.dto.VideoUpdateDTO
import edu.example.learner_kotlin.courseabout.video.entity.Video
import edu.example.learner_kotlin.courseabout.video.repository.VideoRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class VideoService(
    private val videoRepository: VideoRepository,
    private val courseRepository: CourseRepository,
) {
    val allVideos: List<VideoDTO>
        // 모든 비디오를 가져옵니다.
        get() {
            val videos = videoRepository.findAll()
            return videos.map { VideoDTO(it!!) }
        }

    // 특정 ID의 비디오를 가져옵니다.
    fun getVideoById(id: Long) = videoRepository.findByIdOrNull(id)!!


    // 비디오를 추가합니다.
    fun addVideo(dto: VideoCreateDTO): VideoDTO {
        log.info("Adding video: ${dto.courseId}")
        val course = courseRepository.findByIdOrNull(dto.courseId)?:throw VideoException.VIDEO_NOT_FOUND.get()
        val video = VideoMapper.toEntity(dto,course)
        log.info("video: $video")
        val savedVideo = videoRepository.save(video)
        return VideoDTO(savedVideo)
    }

    // 비디오 정보를 업데이트합니다.
    fun updateVideo(id: Long, dto: VideoUpdateDTO): VideoDTO {
        //Given 비디오 확인
        val existingVideo = videoRepository.findByIdOrNull(id) ?: throw VideoException.VIDEO_NOT_FOUND.get()
        log.info("Current Video details: {$existingVideo}")
        val updateVideo = VideoMapper.toUpdateEntity(dto, existingVideo)
        //Then log검증
        val savedVideo = videoRepository.save(updateVideo)
        log.info("Video Update success: {$savedVideo}", )
        return VideoDTO(savedVideo)
    }

    // 비디오를 삭제합니다.
    fun deleteVideo(id: Long) {
        log.info("Deleting video with Id {}", id)
        if (videoRepository.existsById(id)) {
            videoRepository.deleteById(id)
        }else{
            throw VideoException.VIDEO_NOT_FOUND.get()
        }
    }

    // 특정 강좌에 속한 비디오를 가져옵니다.
    fun getVideosByCourseId(courseId: Long?): List<VideoDTO> {
        val videos = videoRepository.findByCourse_CourseId(courseId)!!
        return videos.map { VideoDTO(it!!) }
    }
}
