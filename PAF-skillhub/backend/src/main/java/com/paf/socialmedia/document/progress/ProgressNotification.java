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
@Document(collection = "progress_notifications")
public class ProgressNotification {
    @Id
    private String id;
    private String message;
    private Boolean isRead;
    private String userId;
    private Date createdAt;
    private Date updatedAt;
}
