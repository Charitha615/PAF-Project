package com.paf.socialmedia.service.progress;

import com.paf.socialmedia.document.progress.ProgressNotification;
import com.paf.socialmedia.repository.progress.ProgressNotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ProgressNotificationService {
    @Autowired
    private ProgressNotificationRepository progressNotificationRepository;

    public ResponseEntity<?> getProgressNotificationById(String id){
        Optional<ProgressNotification> progressNotification =  progressNotificationRepository.findById(id);
        if(progressNotification.isPresent()){
            return new ResponseEntity<>(progressNotification.get(), HttpStatus.OK);
        }else{
            return new ResponseEntity<>("No Notification Found",HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<?> getProgressNotifications(){
        List<ProgressNotification> progressNotification = progressNotificationRepository.findAll();
        return new ResponseEntity<List<ProgressNotification>>(progressNotification, HttpStatus.OK);
    }

    public ResponseEntity<?> getUnreadProgressNotificationsByUserId(String userId) {
        List<ProgressNotification> progressNotification = progressNotificationRepository.findByUserIdAndIsReadFalse(userId);
        return new ResponseEntity<List<ProgressNotification>>(progressNotification, HttpStatus.OK);
    }

    public ResponseEntity<?> saveProgressNotification(ProgressNotification progressNotification){
        try{
            progressNotification.setCreatedAt(new Date(System.currentTimeMillis()));
            progressNotification.setIsRead(false);
            progressNotification.setUpdatedAt(new Date(System.currentTimeMillis()));
            progressNotificationRepository.save(progressNotification);
            return new ResponseEntity<ProgressNotification>(progressNotification, HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<?> updateProgressNotificationById(String id, ProgressNotification progressNotification){
        Optional<ProgressNotification> existingNotification =  progressNotificationRepository.findById(id);
        if(existingNotification.isPresent()){
            ProgressNotification updateNotification = existingNotification.get();
            if(!progressNotification.getMessage().isEmpty()) {
                updateNotification.setMessage(progressNotification.getMessage());
            }

            if(progressNotification.getIsRead()) {
                updateNotification.setIsRead(progressNotification.getIsRead());
            }

            updateNotification.setUpdatedAt(new Date(System.currentTimeMillis()));
            return new ResponseEntity<>(progressNotificationRepository.save(updateNotification), HttpStatus.OK);
        }else{
            return new ResponseEntity<>("Comment Update Error",HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<?> deleteProgressNotificationById(String id){
        try{
            progressNotificationRepository.deleteById(id);
            return new ResponseEntity<>("Success deleted with " + id,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
    }
}
