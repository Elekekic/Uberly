package Elena.Uberly_backend.Service;

import Elena.Uberly_backend.DTO.PostDTO;
import Elena.Uberly_backend.Entity.Post;
import Elena.Uberly_backend.Entity.User;
import Elena.Uberly_backend.Exception.PostNotFoundException;
import Elena.Uberly_backend.Exception.UserNotFoundException;
import Elena.Uberly_backend.Repository.PostRepository;
import Elena.Uberly_backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Post> getPostsByUser(User user) {
        return postRepository.findByUser(user);
    }

    public List<Post> getPostsByCity(String city) {
        return postRepository.findByCity(city);
    }

    public Page<Post> getPosts(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return postRepository.findAll(pageable);
    }

    public Optional<Post> getPostById(int id) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isPresent()) {
            return postRepository.findById(id);
        } else {
            throw new UserNotFoundException("Post with id: " + id + " not found");
        }
    }


    public String savePost(PostDTO postDTO) {
        Optional<User> user = userRepository.findById(postDTO.getUserId());
        if (user.isPresent()) {
            Post post = new Post();
            post.setTitle(postDTO.getTitle());
            post.setDescription(postDTO.getDescription());
            post.setCity(postDTO.getCity());
            post.setUser(user.get());
            postRepository.save(post);
            return "Post with ID: " + post.getId() + " saved successfully.";
        } else {
            throw new PostNotFoundException("User with ID: " + postDTO.getUserId() + " not found.");
        }
    }

    public Post updatePost(int id, PostDTO postDTO) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            post.setTitle(postDTO.getTitle());
            post.setDescription(postDTO.getDescription());
            post.setCity(postDTO.getCity());
            postRepository.save(post);
            return post;
        } else {
            throw new PostNotFoundException("Post with ID: " + id + " not found.");
        }
    }

    public String deletePost(int id) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isPresent()) {
            postRepository.delete(postOptional.get());
            return "Post with ID: " + id + " deleted successfully.";
        } else {
            throw new PostNotFoundException("Post with ID: " + id + " not found.");
        }
    }
}
