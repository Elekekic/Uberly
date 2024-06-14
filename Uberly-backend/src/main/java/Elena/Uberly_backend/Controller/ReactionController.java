package Elena.Uberly_backend.Controller;

import Elena.Uberly_backend.DTO.ReactionDTO;
import Elena.Uberly_backend.Entity.Reaction;
import Elena.Uberly_backend.Service.ReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ReactionController {

    @Autowired
    private ReactionService reactionService;

    @GetMapping("/reactions")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public List<Reaction> getAllReactions() {
        return reactionService.getAllReactions();
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
