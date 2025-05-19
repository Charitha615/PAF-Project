package com.paf.socialmedia.repository.progress;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.paf.socialmedia.document.progress.Progress;

import java.util.List;

@Repository
public interface ProgressRepository extends MongoRepository<Progress,String> {
    List<Progress> findByUserId(String userId);
}
