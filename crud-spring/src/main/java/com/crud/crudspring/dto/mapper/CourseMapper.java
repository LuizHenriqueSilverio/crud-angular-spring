package com.crud.crudspring.dto.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.crud.crudspring.dto.CourseDTO;
import com.crud.crudspring.dto.LessonDTO;
import com.crud.crudspring.enums.Category;
import com.crud.crudspring.model.Course;
import com.crud.crudspring.model.Lesson;

@Component
public class CourseMapper {
    
    public CourseDTO toDTO(Course course) {
        if (course == null) {
            return null;
        }
        List<LessonDTO> lessons = course.getLessons()
            .stream()
            .map(lesson -> new LessonDTO(lesson.getId(), lesson.getName(), lesson.getYoutubeUrl()))
            .toList();
        return new CourseDTO(course.getId(), course.getName(), course.getCategory().getValue(), lessons);
    }

    public Course toModel(CourseDTO courseDTO) {
        if (courseDTO == null) {
            return null;
        }

        Course course = new Course();
        if(courseDTO.id() != null) {
            course.setId(courseDTO.id());
        }
        course.setName(courseDTO.name());
        course.setCategory(convertCategoryValue(courseDTO.category()));
        List<Lesson> lessons = courseDTO.lessons().stream()
            .map(lessonDTO -> {
                var lesson = new Lesson();
                lesson.setId(lessonDTO.id());
                lesson.setName(lessonDTO.name());
                lesson.setYoutubeUrl(lessonDTO.youtubeUrl());
                lesson.setCourse(course);
                return lesson;
            }).toList();
        course.setLessons(lessons);
        return course;
        //Builder pattern(@Builder from Lombok) can be used to simplify the code above
    }

    public Category convertCategoryValue(String value) {
        if(value == null) {
            return null;
        }
        return switch(value){
            case "Backend" -> Category.BACK_END;
            case "Frontend" -> Category.FRONT_END;
            case "FullStack" -> Category.FULL_STACK;
            default -> throw new IllegalArgumentException("Invalid category value: " + value);
        };
    }
}
