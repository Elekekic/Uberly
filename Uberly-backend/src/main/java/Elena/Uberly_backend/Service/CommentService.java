package Elena.Uberly_backend.Service;

import Elena.Uberly_backend.DTO.CommentDTO;
import Elena.Uberly_backend.Entity.Comment;
import Elena.Uberly_backend.Entity.Post;
import Elena.Uberly_backend.Entity.User;
import Elena.Uberly_backend.Exception.BadRequestException;
import Elena.Uberly_backend.Exception.CommentNotFoundException;
import Elena.Uberly_backend.Exception.PostNotFoundException;
import Elena.Uberly_backend.Exception.UserNotFoundException;
import Elena.Uberly_backend.Repository.CommentRepository;
import Elena.Uberly_backend.Repository.PostRepository;
import Elena.Uberly_backend.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private static final Logger logger = LoggerFactory.getLogger(CommentService.class);

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Comment> getCommentsByPostId(int postId) {
        return commentRepository.findByPostId(postId);
    }

    public Optional<Comment> getCommentById(int id) {
        Optional<Comment> commentOptional = commentRepository.findById(id);
        if (commentOptional.isPresent()) {
            return commentRepository.findById(id);
        } else {
            throw new PostNotFoundException("Comment with ID: " + id + " not found");
        }
    }

    public Comment createComment(CommentDTO commentDTO, int postId, int userId, Integer parentCommentId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException("Post not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));

        if (parentCommentId != null) {
            Comment comment = new Comment();
            comment.setContent(commentDTO.getContent());
            comment.setPost(post);
            comment.setUser(user);

            Optional<Comment> parentCommentOptional = commentRepository.findById(parentCommentId);
            if (parentCommentOptional.isPresent()) {
                Comment parentComment = parentCommentOptional.get();
                comment.setParentComment(parentComment);
            } else {
                throw new CommentNotFoundException("The comment you want to reply to doesn't exist");
            }

            return commentRepository.save(comment);

        } else {
            Comment comment = new Comment();
            comment.setContent(commentDTO.getContent());
            comment.setPost(post);
            comment.setUser(user);
            return commentRepository.save(comment);
        }
    }


    public Comment updateComment(int id, Comment newComment) {
        return commentRepository.findById(id).map(comment -> {
            comment.setContent(newComment.getContent());
            return commentRepository.save(comment);
        }).orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    public String deleteComment(int id) {
        Optional<Comment> commentOptional = commentRepository.findById(id);
        if (commentOptional.isPresent()) {
            commentRepository.delete(commentOptional.get());
            return "Comment with ID: " + id + " deleted successfully.";
        } else {
            throw new PostNotFoundException("Comment with ID: " + id + " not found.");
        }
    }
}
