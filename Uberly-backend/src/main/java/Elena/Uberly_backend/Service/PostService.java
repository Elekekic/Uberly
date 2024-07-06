package Elena.Uberly_backend.Service;

import Elena.Uberly_backend.DTO.PostDTO;
import Elena.Uberly_backend.DTO.UserDTO;
import Elena.Uberly_backend.Entity.Meme;
import Elena.Uberly_backend.Entity.Post;
import Elena.Uberly_backend.Entity.User;
import Elena.Uberly_backend.Enum.Tags;
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

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // QUERY - FIND POSTS BY USER
    public List<Post> getPostsByUser(User user) {
        return postRepository.findByUser(user);
    }

    // QUERY - FIND POSTS BY STARTING POINT
    public List<Post> getPostsByStartingPoint(String startingPoint) {
        return postRepository.findByStartingPoint(startingPoint);
    }

    // QUERY - FIND POSTS BY END POINT
    public List<Post> getPostsByEndPoint(String endPoint) {
        return postRepository.findByEndPoint(endPoint);
    }

    // QUERY - FIND POSTS BY TAG
    public List<Post> getPostsByTag(Tags tags) {
        return postRepository.findByTags(tags);
    }

    // FIND ALL POSTS W/ PAGINATION METHOD
    public Page<Post> getPosts(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return postRepository.findAll(pageable);
    }

    // FIND ALL POSTS W/O PAGINATION METHOD
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Post> getRecentPostsForFollowedUsers(int userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }

        User user = userOptional.get();

        List<User> followingUsers = user.getFollowing();

        List<Post> recentPosts = new ArrayList<>();


        for (User followingUser : followingUsers) {
            List<Post> posts = postRepository.findByUser(followingUser);

            recentPosts.addAll(posts);
        }
        return recentPosts;
    }

    // FIND POST BY ID METHOD
    public Optional<Post> getPostById(int id) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isPresent()) {
            return postRepository.findById(id);
        } else {
            throw new UserNotFoundException("Post with id: " + id + " not found");
        }
    }





    // CREATE POST METHOD
    public String savePost(PostDTO postDTO) {
        Optional<User> user = userRepository.findById(postDTO.getUserId());

        if (user.isPresent()) {
            Post post = new Post();
            post.setTitle(postDTO.getTitle());
            post.setDescription(postDTO.getDescription());
            post.setStartingPoint(postDTO.getStartingPoint());
            post.setEndPoint(postDTO.getEndPoint());
            post.setSpacesRiders(postDTO.getSpacesRiders());
            post.setTags(postDTO.getTags());
            post.setVehicle(postDTO.getVehicle());
            post.setUser(user.get());
            postRepository.save(post);
            return "Post with ID: " + post.getId() + " saved successfully.";
        } else {
            throw new UserNotFoundException("User with ID: " + postDTO.getUserId() + " not found.");
        }
    }

    // UPDATE POST METHOD
    public Post updatePost(int id, PostDTO postDTO) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            post.setTitle(postDTO.getTitle());
            post.setDescription(postDTO.getDescription());
            post.setStartingPoint(postDTO.getStartingPoint());
            post.setEndPoint(postDTO.getEndPoint());
            post.setSpacesRiders(postDTO.getSpacesRiders());
            post.setTags(postDTO.getTags());
            post.setVehicle(postDTO.getVehicle());
            postRepository.save(post);
            return post;
        } else {
            throw new PostNotFoundException("Post with ID: " + id + " not found.");
        }
    }

    // DELETE POST METHOD
    public String deletePost(int postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post non trovato"));

        for (User user : post.getUsersWhoSaved()) {
            user.getFavorites().remove(post);
        }

        userRepository.saveAll(post.getUsersWhoSaved());
        postRepository.delete(post);

        return "Meme eliminato con successo";
}
}
