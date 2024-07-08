package Elena.Uberly_backend.Controller;

import Elena.Uberly_backend.DTO.ReplyDTO;
import Elena.Uberly_backend.Entity.Comment;
import Elena.Uberly_backend.Entity.Reply;
import Elena.Uberly_backend.Service.CommentService;
import Elena.Uberly_backend.Service.ReplyService;
import Elena.Uberly_backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "https://uberly-gamma.vercel.app")
public class ReplyController {

    @Autowired
    private ReplyService replyService;

    @Autowired
    private UserService userService;

    @Autowired
    private CommentService commentService;


    @GetMapping("/replies/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public Optional<Reply> getReplyById(@PathVariable int id) {
        return replyService.getReplyById(id);
    }

    @GetMapping("/comments/{id}/replies")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public List<Reply> getRepliesByCommentId(@PathVariable int id) {
        return replyService.getRepliesByCommentId(id);
    }

    @GetMapping("/replies")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public List<Reply> getAllReplies() {
        return replyService.getAllReplies();
    }

    @PostMapping("/replies")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public Reply createReply(@RequestBody ReplyDTO reply) {
       return replyService.createReply(reply);
    }

    @PutMapping("/replies/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public Reply updateReply(@PathVariable int id, @RequestBody ReplyDTO reply) {
        return replyService.updateReply(id, reply);
    }

    @DeleteMapping("/replies/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public void deleteReply(@PathVariable int id) {
        replyService.deleteReply(id);
    }
}
