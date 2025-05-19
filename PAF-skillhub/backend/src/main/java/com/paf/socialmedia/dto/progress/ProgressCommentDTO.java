package com.paf.socialmedia.dto.progress;

import lombok.Data;

import java.util.Date;

@Data
public class ProgressCommentDTO {
    private String id;
    private String text;
    private String userId;
    private String username;
    private String profileImage;
    private String progressId;
    private Date createdAt;
    private Date updatedAt;
}
