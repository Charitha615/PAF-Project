package com.example.skillsharingplatform.payload.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;

public class CreatePostRequest {
    @NotBlank
    @Size(max = 100)
    private String title;

    @Size(max = 1000)
    private String description;

    private List<String> mediaBase64; // Changed from mediaUrls to mediaBase64

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getMediaBase64() {
        return mediaBase64;
    }

    public void setMediaBase64(List<String> mediaBase64) {
        this.mediaBase64 = mediaBase64;
    }
}