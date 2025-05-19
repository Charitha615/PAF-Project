package com.example.skillsharingplatform.service;

import com.example.skillsharingplatform.exception.ResourceNotFoundException;
import com.example.skillsharingplatform.model.Post;
import com.example.skillsharingplatform.payload.request.CreatePostRequest;
import com.example.skillsharingplatform.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Post> getPostsByUser(String userId) {
        return postRepository.findByUserId(userId);
    }

    public Post getPostById(String id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
    }

    public Post createPost(String userId, CreatePostRequest createPostRequest) throws IOException {
        Post post = new Post();
        post.setUserId(userId);
        post.setTitle(createPostRequest.getTitle());
        post.setDescription(createPostRequest.getDescription());

        if (createPostRequest.getMediaBase64() != null && !createPostRequest.getMediaBase64().isEmpty()) {
            List<String> filenames = fileStorageService.storeBase64Files(createPostRequest.getMediaBase64());
            post.setMediaUrls(filenames);
        }

        return postRepository.save(post);
    }

    public Post updatePost(String userId, String postId, CreatePostRequest updatePostRequest) throws IOException {
        Post post = getPostById(postId);

        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to update this post");
        }

        post.setTitle(updatePostRequest.getTitle());
        post.setDescription(updatePostRequest.getDescription());
        post.setUpdatedAt(new Date());

        // Handle media updates
        if (updatePostRequest.getMediaBase64() != null && !updatePostRequest.getMediaBase64().isEmpty()) {
            // Delete old files
            if (post.getMediaUrls() != null) {
                for (String filename : post.getMediaUrls()) {
                    fileStorageService.deleteFile(filename);
                }
            }
            // Store new files
            List<String> filenames = fileStorageService.storeBase64Files(updatePostRequest.getMediaBase64());
            post.setMediaUrls(filenames);
        }

        return postRepository.save(post);
    }

    public void deletePost(String userId, String postId) throws IOException {
        Post post = getPostById(postId);

        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this post");
        }

        // Delete associated files
        if (post.getMediaUrls() != null) {
            for (String filename : post.getMediaUrls()) {
                fileStorageService.deleteFile(filename);
            }
        }

        postRepository.delete(post);
    }
}