package com.paf.socialmedia.controller.progress;

import com.paf.socialmedia.document.PostShare;
import com.paf.socialmedia.document.progress.ProgressShare;
import com.paf.socialmedia.service.PostShareService;
import com.paf.socialmedia.service.progress.ProgressShareService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/progressshare")
public class ProgressShareController {
    @Autowired
    private ProgressShareService progressShareService;

    @PostMapping
    public ResponseEntity<?> saveProgress(@RequestBody ProgressShare progressShare){
        return progressShareService.saveProgress(progressShare);
    }

    @GetMapping
    public ResponseEntity<?> getProgresses(){
        return progressShareService.getProgresses();
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getsharedProgressesByUserId(@PathVariable String id){
        return progressShareService.getsharedProgressesByUserId(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProgressById(@PathVariable String id){
        return progressShareService.getProgressById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProgressById(@PathVariable String id, @RequestBody ProgressShare progressShare){
        return  progressShareService.updateProgressById(id, progressShare);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProgressById(@PathVariable String id){
        return progressShareService.deleteProgressById(id);
    }
}
