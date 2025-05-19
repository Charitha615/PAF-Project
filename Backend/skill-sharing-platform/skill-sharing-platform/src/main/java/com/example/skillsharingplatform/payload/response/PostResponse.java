package com.example.skillsharingplatform.payload.response;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.example.skillsharingplatform.model.Post;

public class PostResponse {
    private String id;
    private String userId;
    private String title;
    private String description;
    private List<String> mediaUrls;
    private Date createdAt;
    private Date updatedAt;
    private String authorName;

    public PostResponse(Post post, String baseUrl) {
        this.id = post.getId();
        this.userId = post.getUserId();
        this.title = post.getTitle();
        this.description = post.getDescription();
        this.mediaUrls = post.getMediaUrls().stream()
                .map(url -> baseUrl + "/uploads/" + url)
                .collect(Collectors.toList());
        this.createdAt = post.getCreatedAt();
        this.updatedAt = post.getUpdatedAt();
    }

    // Getters (no setters needed as we use constructor)
    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public List<String> getMediaUrls() { return mediaUrls; }
    public Date getCreatedAt() { return createdAt; }
    public Date getUpdatedAt() { return updatedAt; }
    public String getAuthorName() { return authorName; }
}