package com.crud.crudspring.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import com.crud.crudspring.repository.CourseRepository;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import com.crud.crudspring.dto.CourseDTO;
import com.crud.crudspring.dto.mapper.CourseMapper;
import com.crud.crudspring.exception.RecordNotFoundException;
import com.crud.crudspring.model.Course;

@Validated
@Service
public class CourseService {
    
    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;

    public CourseService(CourseRepository courseRepository, CourseMapper courseMapper) {
        this.courseRepository = courseRepository;
        this.courseMapper = courseMapper;
    }

    public List<CourseDTO> list() {
        return courseRepository.findAll()
            .stream()
            .map(courseMapper::toDTO).toList();
    }

    public CourseDTO findById(@NotNull @Positive Long id) {
        return courseRepository.findById(id).map(courseMapper::toDTO)
            .orElseThrow(() -> new RecordNotFoundException(id));
    }

    public CourseDTO create(@Valid @NotNull CourseDTO course) {
       return courseMapper.toDTO(courseRepository.save(courseMapper.toModel(course)));
    }

    public CourseDTO update(@NotNull @Positive Long id, @Valid @NotNull CourseDTO courseDto) {
        return courseRepository.findById(id)
            .map(recordFound -> {
                Course course = courseMapper.toModel(courseDto);
                recordFound.setName(courseDto.name());
                recordFound.setCategory(this.courseMapper.convertCategoryValue(courseDto.category()));
                recordFound.getLessons().clear();
                course.getLessons().forEach(recordFound.getLessons()::add);
                return courseMapper.toDTO(courseRepository.save(recordFound));
            }).orElseThrow(() -> new RecordNotFoundException(id));
    }

    public void delete(@NotNull @Positive Long id) {
        courseRepository.delete(courseRepository.findById(id)
        .orElseThrow(() -> new RecordNotFoundException(id)));
    }
}
