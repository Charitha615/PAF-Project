package com.paf.socialmedia.service.progress;

import com.paf.socialmedia.document.User;
import com.paf.socialmedia.document.progress.Progress;
import com.paf.socialmedia.document.progress.ProgressShare;
import com.paf.socialmedia.dto.progress.ProgressDTO;
import com.paf.socialmedia.dto.progress.ProgressShareDTO;
import com.paf.socialmedia.repository.UserRepository;
import com.paf.socialmedia.repository.progress.ProgressRepository;
import com.paf.socialmedia.repository.progress.ProgressShareRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ProgressShareService {

    @Autowired
    private ProgressShareRepository progressShareRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProgressRepository progressRepository;

    public ResponseEntity<?> getProgressById(String id){
        Optional<ProgressShare> progress =  progressShareRepository.findById(id);
        if(progress.isPresent()){
            return new ResponseEntity<>(progress.get(), HttpStatus.OK);
        }else{
            return new ResponseEntity<>("No Progress Found", HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<?> getProgresses(){
        List<ProgressShare> progressNotifications = progressShareRepository.findAll();
        return new ResponseEntity<List<ProgressShare>>(progressNotifications, HttpStatus.OK);
    }

    public ResponseEntity<?> getsharedProgressesByUserId(String userId) {
        List<ProgressShare> sharedProgresses = progressShareRepository.findByUserId(userId);
        List<ProgressShareDTO> sharedProgressDTOList = new ArrayList<>();

        for (ProgressShare progressShare: sharedProgresses) {
            ProgressShareDTO progressShareDTO = new ProgressShareDTO();
            progressShareDTO.setId(progressShare.getId());
            progressShareDTO.setCaption(progressShare.getCaption());
            progressShareDTO.setUpdatedAt(progressShare.getUpdatedAt());
            progressShareDTO.setCreatedAt(progressShare.getCreatedAt());
            progressShareDTO.setUserId(progressShare.getUserId());

            Optional<User> user =  userRepository.findById(progressShare.getUserId());
            if(user.isPresent()) {
                progressShareDTO.setUsername(user.get().getUsername());
                progressShareDTO.setProfileImage(user.get().getProfileImage());
            }

            ProgressDTO progressDTO = new ProgressDTO();
            Optional<Progress> progress =  progressRepository.findById(progressShare.getProgress().getId());
            System.out.println("progressShare.getProgress().getId()" + progressShare.getProgress().getId());
            if(progress.isPresent()) {
                System.out.println("progress.isPresent()" + progress.get().getId());
                progressDTO.setId(progress.get().getId());
                progressDTO.setCaption(progress.get().getCaption());
                progressDTO.setImgLink(progress.get().getImgLink());
                progressDTO.setUpdatedAt(progress.get().getUpdatedAt());
                progressDTO.setCreatedAt(progress.get().getCreatedAt());
                progressDTO.setUserId(progress.get().getUserId());

                Optional<User> progressUser =  userRepository.findById(progress.get().getUserId());
                if(progressUser.isPresent()) {
                    progressDTO.setUsername(progressUser.get().getUsername());
                    progressDTO.setProfileImage(progressUser.get().getProfileImage());
                }else{
                    progressDTO.setUsername("Unavailable");
                }
                progressShareDTO.setProgress(progressDTO);
            }

            sharedProgressDTOList.add(progressShareDTO);
        }

        return new ResponseEntity<>(sharedProgressDTOList, HttpStatus.OK);
    }

    public ResponseEntity<?> saveProgress(ProgressShare progressShare){
        try{
            progressShare.setCreatedAt(new Date(System.currentTimeMillis()));
            progressShare.setUpdatedAt(new Date(System.currentTimeMillis()));
            progressShareRepository.save(progressShare);
            return new ResponseEntity<ProgressShare>(progressShare, HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<?> updateProgressById(String id, ProgressShare progressShare){
        Optional<ProgressShare> existingProgress =  progressShareRepository.findById(id);
        if(existingProgress.isPresent()){
            ProgressShare updateProgress = existingProgress.get();
            if(progressShare.getCaption() != null) {
                updateProgress.setCaption(progressShare.getCaption());
            }
            updateProgress.setUpdatedAt(new Date(System.currentTimeMillis()));
            return new ResponseEntity<>(progressShareRepository.save(updateProgress), HttpStatus.OK);
        }else{
            return new ResponseEntity<>("Shared Progress Update Error", HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<?> deleteProgressById(String id){
        try{
            progressShareRepository.deleteById(id);
            return new ResponseEntity<>("Success deleted with " + id, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
