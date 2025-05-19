package com.paf.socialmedia.repository.progress;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.paf.socialmedia.document.progress.ProgressComment;

import java.util.List;

@Repository
public interface ProgressCommentRepository extends MongoRepository<ProgressComment, String> {
    List<ProgressComment> findByProgressId(String progressId);

}