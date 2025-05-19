package com.paf.socialmedia.service.progress;

import com.paf.socialmedia.document.progress.ProgressComment;
import com.paf.socialmedia.repository.progress.ProgressCommentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ProgressCommentService {
    @Autowired
    private ProgressCommentRepository progressCommentRepository;

    public ResponseEntity<?> getProgressCommentById(String id){
        Optional<ProgressComment> progressComment =  progressCommentRepository.findById(id);
        if(progressComment.isPresent()){
            return new ResponseEntity<>(progressComment.get(), HttpStatus.OK);
        }else{
            return new ResponseEntity<>("No Comment Found",HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<?> getProgressComments(){
        List<ProgressComment> progressComment = progressCommentRepository.findAll();
        if(progressComment.size() > 0){
            return new ResponseEntity<List<ProgressComment>>(progressComment, HttpStatus.OK);
        }else {
            return new ResponseEntity<List<ProgressComment>>(new ArrayList<>(),HttpStatus.OK);
        }
    }

    public ResponseEntity<?> getProgressCommentsByProgress(String postId){
        List<ProgressComment> progressComment = progressCommentRepository.findByProgressId(postId);
        if(progressComment.size() > 0){
            return new ResponseEntity<List<ProgressComment>>(progressComment, HttpStatus.OK);
        }else {
            return new ResponseEntity<List<ProgressComment>>(new ArrayList<>(),HttpStatus.OK);
        }
    }

    public ResponseEntity<?> saveProgressComment(ProgressComment progressComment){
        try{
            progressComment.setCreatedAt(new Date(System.currentTimeMillis()));
            progressComment.setUpdatedAt(new Date(System.currentTimeMillis()));
            progressCommentRepository.save(progressComment);
            return new ResponseEntity<ProgressComment>(progressComment, HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<?> updateProgressCommentById(String id, ProgressComment progressComment){
        Optional<ProgressComment> existingComment =  progressCommentRepository.findById(id);
        if(existingComment.isPresent()){
            ProgressComment updateComment = existingComment.get();
            updateComment.setText(progressComment.getText());
            updateComment.setUpdatedAt(new Date(System.currentTimeMillis()));
            return new ResponseEntity<>(progressCommentRepository.save(updateComment), HttpStatus.OK);
        }else{
            return new ResponseEntity<>("Comment Update Error",HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<?> deleteProgressCommentById(String id){
        try{
            progressCommentRepository.deleteById(id);
            return new ResponseEntity<>("Success deleted with " + id,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
    }
}
