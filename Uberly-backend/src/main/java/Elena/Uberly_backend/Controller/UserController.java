package Elena.Uberly_backend.Controller;

import Elena.Uberly_backend.DTO.UserDTO;
import Elena.Uberly_backend.Entity.Post;
import Elena.Uberly_backend.Entity.User;
import Elena.Uberly_backend.Exception.BadRequestException;
import Elena.Uberly_backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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

    //QUERY 1 - SEARCHING BY PARTIAL USERNAME
    @GetMapping("/users/search")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public List<User> getUsersByUsernameContaining (@RequestParam String username) {
        return userService.getUserByUsernameContaining(username);
    }


    @GetMapping("/{userId}/saved-posts")
    public List<Post> getSavedPostsByUserId(@PathVariable int userId) {
        return userService.getFavoritesByUserId(userId);
    }


    @PostMapping("/{userId}/saved-posts/{postId}")
    public void addSavedPost(@PathVariable int userId, @PathVariable int postId) {
        userService.addSavedPost(userId, postId);
    }
}
