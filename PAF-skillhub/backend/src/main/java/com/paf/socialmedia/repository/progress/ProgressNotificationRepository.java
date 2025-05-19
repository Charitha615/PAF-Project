package com.paf.socialmedia.repository.progress;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.paf.socialmedia.document.progress.ProgressNotification;

import java.util.List;

@Repository
public interface ProgressNotificationRepository extends MongoRepository<ProgressNotification, String> {
    List<ProgressNotification> findByUserIdAndIsReadFalse(String userId);
}
