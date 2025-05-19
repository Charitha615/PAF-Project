package com.paf.socialmedia.controller.progress;

import com.paf.socialmedia.document.progress.Progress;
import com.paf.socialmedia.service.progress.ProgressService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*") // Allow requests from any origin (useful for frontend-backend interaction)
@RestController // Marks this class as a REST controller
@RequestMapping("/api/progress") // Base path for all endpoints in this controller
public class ProgressController {

    @Autowired
    private ProgressService progressService; // Injecting the ProgressService to handle business logic

    // Endpoint to save a new progress post
    @PostMapping
    public ResponseEntity<?> saveProgress(@RequestBody Progress progress){
        return progressService.saveProgress(progress); // Delegates to service to handle saving
    }

    // Endpoint to get all progress posts
    @GetMapping
    public ResponseEntity<?> getProgresses(){
        return progressService.getProgresses(); // Delegates to service to fetch all progresses
    }

    // Endpoint to get all progress posts of a specific user by user ID
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getProgressesByUserId(@PathVariable String id){
        return progressService.getProgressesByUserId(id); // Delegates to service to fetch progresses for a user
    }

    // Endpoint to get a specific progress post by its ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProgressById(@PathVariable String id){
        return progressService.getProgressById(id); // Delegates to service to fetch a progress post by ID
    }

    // Endpoint to update an existing progress post by ID
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProgressById(@PathVariable String id, @RequestBody Progress progress){
        return progressService.updateProgressById(id, progress); // Delegates to service to update a progress post
    }

    // Endpoint to like a specific progress post by ID
    @PutMapping("/like/{id}")
    public ResponseEntity<?> likeProgressById(@PathVariable String id, @RequestBody Progress progress){
        return progressService.likeProgressById(id, progress); // Delegates to service to like a progress post
    }

    // Endpoint to delete a specific progress post by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProgressById(@PathVariable String id){
        return progressService.deleteProgressById(id); // Delegates to service to delete a progress post
    }
}
