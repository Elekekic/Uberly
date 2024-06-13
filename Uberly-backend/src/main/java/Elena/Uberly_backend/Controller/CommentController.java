package Elena.Uberly_backend.Controller;

import Elena.Uberly_backend.DTO.CommentDTO;
import Elena.Uberly_backend.Entity.Comment;
import Elena.Uberly_backend.Exception.BadRequestException;
import Elena.Uberly_backend.Service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.SequencedCollection;

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

    @GetMapping("comments/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public Optional<Comment> getCommentById(@PathVariable int id) {
        return commentService.getCommentById(id);
    }

    @PostMapping("/posts/{postId}/user/{userId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public Comment createComment(@Validated @RequestBody CommentDTO commentDTO, @PathVariable int postId,
                                 @PathVariable int userId, @RequestParam(required = false) Integer parentCommentId,
                                 BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
             bindingResult.getAllErrors().stream()
                    .map(objectError -> objectError.getDefaultMessage())
                    .reduce("", (s, s2) -> s + s2);
        }
        return commentService.createComment(commentDTO, postId, userId, parentCommentId);
    }

    @PutMapping("comments/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public Comment updateComment(@PathVariable int id, @RequestBody Comment comment, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream()
                    .map(objectError -> objectError.getDefaultMessage()).reduce("", (s, s2) -> s + s2));
        }
         return commentService.updateComment(id, comment);

    }

    @DeleteMapping("comments/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public String deleteComment(@PathVariable int id) {
        return commentService.deleteComment(id);
    }
}
