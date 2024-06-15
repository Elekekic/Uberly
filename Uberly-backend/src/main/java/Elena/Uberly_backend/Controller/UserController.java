package Elena.Uberly_backend.Controller;

import Elena.Uberly_backend.DTO.UserDTO;
import Elena.Uberly_backend.Entity.Post;
import Elena.Uberly_backend.Entity.User;
import Elena.Uberly_backend.Exception.BadRequestException;
import Elena.Uberly_backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;


    @GetMapping("/users")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public Page<User> getUsers(@RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "10") int size,
                               @RequestParam(defaultValue = "id") String sortBy){
        return userService.getUserConPaginazione(page, size, sortBy);
         }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public Optional<User> getUser(@PathVariable int id) {
        return userService.getUserById(id);
    }


    @PutMapping("/users/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public User updateUser(@PathVariable int id, @RequestBody @Validated UserDTO userDTO, BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream()
                    .map(objectError -> objectError.getDefaultMessage()).reduce("", (s, s2) -> s + s2));
        }
        return userService.updateUser(userDTO, id);
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public String deleteUser(@PathVariable int id){
        return userService.deleteUser(id);
    }

    @PatchMapping("/users/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public String patchPictureProfile(@PathVariable int id, @RequestBody MultipartFile pictureProfile) throws IOException {
        return userService.patchPictureProfileUser(id, pictureProfile);
    }

    @GetMapping("/users/search")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public List<User> getUsersByUsernameContaining (@RequestParam String username) {
        return userService.getUserByUsernameContaining(username);
    }

    @GetMapping("/users/{userId}/favorites")
    public List<Post> getSavedPostsByUserId(@PathVariable int userId) {
        return userService.getFavoritesByUserId(userId);
    }

    @PostMapping("/users/{userId}/favorites/{postId}")
    public void addSavedPost(@PathVariable int userId, @PathVariable int postId) {
        userService.addSavedPost(userId, postId);
    }

    @DeleteMapping("/users/{userId}/favorites/{postId}")
    public void deleteSavedPost(@PathVariable int userId, @PathVariable int postId) {
        userService.removeSavedPost(userId, postId);
    }

    @PostMapping("/users/{userId}/follow/{followUserId}")
    public ResponseEntity<String> followUser(@PathVariable int userId, @PathVariable int followUserId) {
        userService.followUser(userId, followUserId);
        return ResponseEntity.ok("User followed successfully");
    }

    @PostMapping("/users/{userId}/unfollow/{unfollowUserId}")
    public ResponseEntity<String> unfollowUser(@PathVariable int userId, @PathVariable int unfollowUserId) {
        userService.unfollowUser(userId, unfollowUserId);
        return ResponseEntity.ok("User unfollowed successfully");
    }


    @PostMapping("/users/{userId}/memes/{memeId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public ResponseEntity<String> saveMeme(@PathVariable int userId, @PathVariable int memeId) {
        userService.addSavedMeme(userId, memeId);
        return ResponseEntity.ok("Meme saved successfully");
    }

    @DeleteMapping("/users/{userId}/memes/{memeId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public ResponseEntity<String> unsaveMeme(@PathVariable int userId, @PathVariable int memeId) {
        userService.removeSavedMeme(userId, memeId);
        return ResponseEntity.ok("Meme removed from favorites successfully");
    }
}
