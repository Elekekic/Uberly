package Elena.Uberly_backend.Controller;

import Elena.Uberly_backend.DTO.PostDTO;
import Elena.Uberly_backend.Entity.Post;
import Elena.Uberly_backend.Entity.User;
import Elena.Uberly_backend.Exception.UserNotFoundException;
import Elena.Uberly_backend.Service.PostService;
import Elena.Uberly_backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;


    @GetMapping("/posts")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public Page<Post> getPosts(@RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "10") int size,
                               @RequestParam(defaultValue = "id") String sortBy){
        return postService.getPosts(page, size, sortBy);
    }

    @GetMapping("/posts/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public Optional<Post> getPost(@PathVariable int id) {
        return postService.getPostById(id);
    }

    @GetMapping("/posts/users/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public List<Post> getPostsByUser(@PathVariable int id) {
        Optional<User> userOptional = userService.getUserById(id);
        if (userOptional.isPresent()) {
            return postService.getPostsByUser(userOptional.get());
        } else {
            throw new UserNotFoundException("User with id: " + id + " not found");
        }
    }

    @GetMapping("/posts/{city}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public List<Post> getPostsByCity(@PathVariable String city) {
        return postService.getPostsByCity(city);
    }


    @PostMapping("/posts")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER')")
    public String savePost(@RequestBody PostDTO postDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new IllegalArgumentException(bindingResult.getAllErrors().stream()
                    .map(objectError -> objectError.getDefaultMessage()).reduce("", (s, s2) -> s + s2));
        }
        return postService.savePost(postDTO);
    }

    @PutMapping("/posts/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER')")
    public Post updatePost(@PathVariable int id, @RequestBody PostDTO postDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new IllegalArgumentException(bindingResult.getAllErrors().stream()
                    .map(objectError -> objectError.getDefaultMessage()).reduce("", (s, s2) -> s + s2));
        }
        return postService.updatePost(id, postDTO);
    }


    @DeleteMapping("/posts/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER')")
    public String deletePost(@PathVariable int id) {
        return postService.deletePost(id);
    }
}
