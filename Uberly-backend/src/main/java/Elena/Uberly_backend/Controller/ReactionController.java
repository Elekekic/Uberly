package Elena.Uberly_backend.Controller;

import Elena.Uberly_backend.DTO.ReactionDTO;
import Elena.Uberly_backend.Entity.Post;
import Elena.Uberly_backend.Entity.Reaction;
import Elena.Uberly_backend.Service.ReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "https://outer-lane-kekice-635da50d.koyeb.app")
public class ReactionController {

    @Autowired
    private ReactionService reactionService;

    @GetMapping("/reactions")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public List<Reaction> getAllReactions() {
        return reactionService.getAllReactions();
    }

    @GetMapping("/reactions/post/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public Optional<Post> getReactionsByPostId(@PathVariable int id) {
        return reactionService.getReactionByPostId(id);
    }

    @GetMapping("/reactions/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public Optional<Reaction> getReactionById(@PathVariable int id) {
        return reactionService.getReactionById(id);
    }

    @PostMapping("/reactions")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public String createReaction(@RequestBody ReactionDTO reaction) {
        return reactionService.createReaction(reaction);
    }

    @DeleteMapping("/reactions/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public String deleteReaction(@PathVariable int id) {
        return reactionService.deleteReaction(id);
    }

}
