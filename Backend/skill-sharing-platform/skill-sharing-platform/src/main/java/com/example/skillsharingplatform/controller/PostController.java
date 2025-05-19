package com.example.skillsharingplatform.controller;

import com.example.skillsharingplatform.model.Post;
import com.example.skillsharingplatform.payload.request.CreatePostRequest;
import com.example.skillsharingplatform.payload.response.PostResponse;
import com.example.skillsharingplatform.security.UserDetailsImpl;
import com.example.skillsharingplatform.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostService postService;

    @Value("${app.baseUrl}")
    private String baseUrl;

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts().stream()
                .map(post -> new PostResponse(post, baseUrl))
                .collect(Collectors.toList()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponse>> getPostsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(postService.getPostsByUser(userId).stream()
                .map(post -> new PostResponse(post, baseUrl))
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable String id) {
        Post post = postService.getPostById(id);
        return ResponseEntity.ok(new PostResponse(post, baseUrl));
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @Valid @RequestBody CreatePostRequest createPostRequest,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Post createdPost = postService.createPost(userDetails.getId(), createPostRequest);
        return ResponseEntity.ok(new PostResponse(createdPost, baseUrl));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable String id,
            @Valid @RequestBody CreatePostRequest updatePostRequest,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Post updatedPost = postService.updatePost(userDetails.getId(), id, updatePostRequest);
        return ResponseEntity.ok(new PostResponse(updatedPost, baseUrl));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @PathVariable String id,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        postService.deletePost(userDetails.getId(), id);
        return ResponseEntity.ok().build();
    }
}