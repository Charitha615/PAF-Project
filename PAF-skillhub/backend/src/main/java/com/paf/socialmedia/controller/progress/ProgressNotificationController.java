package com.paf.socialmedia.controller.progress;

import com.paf.socialmedia.document.progress.ProgressNotification;
import com.paf.socialmedia.service.progress.ProgressNotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/progress/notifications")
public class ProgressNotificationController {
    @Autowired
    private ProgressNotificationService progressNotificationService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getProgressNotificationById(@PathVariable String id){
        return progressNotificationService.getProgressNotificationById(id);
    }

    @GetMapping
    public ResponseEntity<?> getNotifications(){
        return progressNotificationService.getProgressNotifications();
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUnreadNotificationsByUserId(@PathVariable String id){
        return progressNotificationService.getUnreadProgressNotificationsByUserId(id);
    }

    @PostMapping
    public ResponseEntity<?> saveNotification(@RequestBody ProgressNotification progressNotification){
        return progressNotificationService.saveProgressNotification(progressNotification);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNotificationById(@PathVariable String id, @RequestBody ProgressNotification progressNotification){
        return  progressNotificationService.updateProgressNotificationById(id, progressNotification);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotificationById(@PathVariable String id){
        return progressNotificationService.deleteProgressNotificationById(id);
    }
}
