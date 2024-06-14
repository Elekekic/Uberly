package Elena.Uberly_backend.Service;

import Elena.Uberly_backend.DTO.ReactionDTO;
import Elena.Uberly_backend.Entity.*;
import Elena.Uberly_backend.Exception.ReactionNotFoundException;
import Elena.Uberly_backend.Exception.UserNotFoundException;
import Elena.Uberly_backend.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReactionService {

    @Autowired
    private ReactionRepository reactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ReplyRepository replyRepository;


    // GET ALL REACTIONS METHOD
    public List<Reaction> getAllReactions() {
        return reactionRepository.findAll();
    }


    // GET REACTION BY ID METHOD
    public Optional<Reaction> getReactionById(int id) {
        Optional<Reaction> reactionOptional = reactionRepository.findById(id);
        if (reactionOptional.isPresent()) {
            return reactionRepository.findById(id);
        } else {
            throw new ReactionNotFoundException("Reaction with ID: " + id + " not found");
        }
    }


    // SAVE REACTION METHOD
    public String createReaction(ReactionDTO reactionDTO) {
        User user = userRepository.findById(reactionDTO.getUserId()).orElseThrow(() -> new UserNotFoundException("Author user not found"));
        Optional<Post> postOptional = postRepository.findById(reactionDTO.getPostId());
        Optional<Comment> commentOptional = commentRepository.findById(reactionDTO.getCommentId());
        Optional<Feedback> feedbackOptional = feedbackRepository.findById(reactionDTO.getFeedbackId());
        Optional<Reply> replyOptional = replyRepository.findById(reactionDTO.getReplyId());

        if (reactionDTO.getType() == null) {
            throw new ReactionNotFoundException("Reaction type is not correct or cannot be null");
        }

        Reaction reaction = new Reaction();
        reaction.setType(reactionDTO.getType());

        reaction.setUser(user);
        if (postOptional.isPresent()) {
            reaction.setPost(postOptional.get());
        } else if (commentOptional.isPresent()) {
            reaction.setComment(commentOptional.get());
        } else if (feedbackOptional.isPresent()) {
            reaction.setFeedback(feedbackOptional.get());
        } else if (replyOptional.isPresent()) {
            reaction.setReply(replyOptional.get());
        } else {
            throw new IllegalArgumentException("Reaction cannot be created without a valid Post, Comment or Feedback");
        }
        reactionRepository.save(reaction);
        return "Reaction created successfully";
    }


    // DELETE REACTION METHOD
    public String deleteReaction(int id) {
        Optional<Reaction> reactionOptional = reactionRepository.findById(id);
        if (reactionOptional.isPresent()) {
            reactionRepository.delete(reactionOptional.get());
            return "Reaction with ID: " + id + " deleted successfully.";
        } else {
            throw new ReactionNotFoundException("Reaction with ID: " + id + " not found");
        }
    }
}
