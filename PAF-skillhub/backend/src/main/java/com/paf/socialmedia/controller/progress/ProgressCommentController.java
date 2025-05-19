package com.paf.socialmedia.controller.progress;

import com.paf.socialmedia.document.progress.ProgressComment;
import com.paf.socialmedia.service.progress.ProgressCommentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/progress/comments")
public class ProgressCommentController {
    @Autowired
    private ProgressCommentService progressCommentService;

    //Get data from id
    @GetMapping("/{id}")
    public ResponseEntity<?> getProgressCommentById(@PathVariable String id){
        return progressCommentService.getProgressCommentById(id);
    }
    
    //Get data from id
    @GetMapping
    public ResponseEntity<?> getProgressComments(){
        return progressCommentService.getProgressComments();
    }

    //Get data from id
    @GetMapping("/progress/{id}")
    public ResponseEntity<?> getProgressCommentsByProgress(@PathVariable String id){
        return progressCommentService.getProgressCommentsByProgress(id);
    }

    //Get data from id
    @PostMapping
    public ResponseEntity<?> saveProgressComment(@RequestBody ProgressComment progressComment){
        return progressCommentService.saveProgressComment(progressComment);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProgressCommentById(@PathVariable String id, @RequestBody ProgressComment progressComment){
        return  progressCommentService.updateProgressCommentById(id,progressComment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProgressCommentById(@PathVariable String id){
        return progressCommentService.deleteProgressCommentById(id);
    }
}
