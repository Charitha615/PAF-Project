package com.paf.socialmedia.document.progress;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "progress_comments")
public class ProgressComment {
    @Id
    private String id;
    private String text;
    private String userId;
    private String progressId;
    private Date createdAt;
    private Date updatedAt;
}
