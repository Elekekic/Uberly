package Elena.Uberly_backend.Service;

import Elena.Uberly_backend.DTO.CommentDTO;
import Elena.Uberly_backend.DTO.ReplyDTO;
import Elena.Uberly_backend.Entity.Comment;
import Elena.Uberly_backend.Entity.Reply;
import Elena.Uberly_backend.Entity.User;
import Elena.Uberly_backend.Exception.BadRequestException;
import Elena.Uberly_backend.Exception.ReplyNotFoundException;
import Elena.Uberly_backend.Repository.CommentRepository;
import Elena.Uberly_backend.Repository.ReplyRepository;
import Elena.Uberly_backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReplyService {

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    //GET REPLY BY ID METHOD
    public Optional<Reply> getReplyById(int id) {
        return replyRepository.findById(id);
    }

    // GET ALL REPLIES METHOD
    public List<Reply> getAllReplies() {
        return replyRepository.findAll();
    }

    // QUERY - GET ALL REPLIES BY COMMENT ID
    public List<Reply> getRepliesByCommentId(int commentId) {
        return replyRepository.findByCommentId(commentId);
    }

    // QUERY - GET ALL REPLIES BY USER ID
    public List<Reply> getRepliesByUserId(int userId) {
        return replyRepository.findByUserId(userId);
    }

    // SAVE REPLY METHOD
    public Reply createReply(ReplyDTO replyDTO) {
        Optional<Comment> commentOptional = commentRepository.findById(replyDTO.getCommentId());
        Optional<User> userOptional = userRepository.findById(replyDTO.getUserId());

        if (commentOptional.isPresent() && userOptional.isPresent()) {
            Reply reply = new Reply();
            reply.setContent(replyDTO.getContent());
            reply.setComment(commentOptional.get());
            reply.setUser(userOptional.get());
            return replyRepository.save(reply);
        } else {
            throw new BadRequestException("Invalid comment or user ID");
        }
    }

    // UPDATE REPLY METHOD
    public Reply updateReply(int id, ReplyDTO replyUpdate) {
        return replyRepository.findById(id).map(reply -> {
            reply.setContent(replyUpdate.getContent());
            return replyRepository.save(reply);
        }).orElseThrow(() -> new ReplyNotFoundException("Reply not found"));
    }

    // DELETE REPLY METHOD
    public void deleteReply(int Id) {
        Optional<Reply> replyOptional = replyRepository.findById(Id);
        if (replyOptional.isPresent()) {
            replyRepository.delete(replyOptional.get());
        } else {
            throw new ReplyNotFoundException("Reply with id: " + Id + " not found");
        }
    }
}
