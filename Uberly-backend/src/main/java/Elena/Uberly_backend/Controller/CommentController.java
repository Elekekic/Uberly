package Elena.Uberly_backend.Controller;

import Elena.Uberly_backend.DTO.CommentDTO;
import Elena.Uberly_backend.DTO.CommentUpdateDTO;
import Elena.Uberly_backend.Entity.Comment;
import Elena.Uberly_backend.Exception.BadRequestException;
import Elena.Uberly_backend.Service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/comments/posts/{postId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public List<Comment> getCommentsByPostId(@PathVariable int postId) {
        return commentService.getCommentsByPostId(postId);
    }

    @GetMapping("/comments/memes/{memesId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public List<Comment> getCommentsByMemeId(@PathVariable int memesId) {
        return commentService.getCommentsByMemeId(memesId);
    }

    @GetMapping("/comments/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public Optional<Comment> getCommentById(@PathVariable int id) {
        return commentService.getCommentById(id);
    }

    @PostMapping("/comments")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public String createComment(@Validated @RequestBody CommentDTO commentDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream()
                    .map(objectError -> objectError.getDefaultMessage()).reduce("", (s, s2) -> s + s2));
        }
        return commentService.createComment(commentDTO);
    }

    @GetMapping("/comments")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public List<Comment> getAllComments() {
        return commentService.getAllComments();
    }


    @PutMapping("/comments/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public Comment updateComment(@PathVariable int id, @RequestBody @Validated CommentUpdateDTO comment, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream()
                    .map(objectError -> objectError.getDefaultMessage()).reduce("", (s, s2) -> s + s2));
        }
        return commentService.updateComment(id, comment);
    }

    @DeleteMapping("/comments/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public String deleteComment(@PathVariable int id) {
        return commentService.deleteComment(id);
    }
}
