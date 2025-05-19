package com.paf.socialmedia.dto.progress;

import lombok.Data;

import java.util.Date;
@Data
public class ProgressShareDTO {
    private String id;
    private String caption;
    private String userId;
    private String username;
    private String profileImage;
    private ProgressDTO progress;
    private Date createdAt;
    private Date updatedAt;
}
