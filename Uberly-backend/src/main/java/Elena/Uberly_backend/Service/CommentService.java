package Elena.Uberly_backend.Service;

import Elena.Uberly_backend.DTO.CommentDTO;
import Elena.Uberly_backend.DTO.CommentUpdateDTO;
import Elena.Uberly_backend.Entity.Comment;
import Elena.Uberly_backend.Entity.Meme;
import Elena.Uberly_backend.Entity.Post;
import Elena.Uberly_backend.Entity.User;
import Elena.Uberly_backend.Exception.BadRequestException;
import Elena.Uberly_backend.Exception.CommentNotFoundException;
import Elena.Uberly_backend.Repository.CommentRepository;
import Elena.Uberly_backend.Repository.MemeRepository;
import Elena.Uberly_backend.Repository.PostRepository;
import Elena.Uberly_backend.Repository.UserRepository;
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

    @Autowired
    private MemeRepository memeRepository;

    // GET ALL COMMENTS METHOD
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    // QUERY - GET ALL COMMENTS BY POST ID
    public List<Comment> getCommentsByPostId(int postId) {
        return commentRepository.findByPostId(postId);
    }

    // QUERY - GET ALL COMMENTS BY MEME ID
    public List<Comment> getCommentsByMemeId(int memeId) {
        return commentRepository.findByMemeId(memeId);
    }

    // GET COMMENT BY ID METHOD
    public Optional<Comment> getCommentById(int id) {
        Optional<Comment> commentOptional = commentRepository.findById(id);
        if (commentOptional.isPresent()) {
            return commentRepository.findById(id);
        } else {
            throw new CommentNotFoundException("Comment with ID: " + id + " not found");
        }
    }

    // SAVE COMMENT METHOD
    public String createComment(CommentDTO commentDTO) {
        Optional<Post> post = postRepository.findById(commentDTO.getPostId());
        Optional<User> user = userRepository.findById(commentDTO.getUserId());
        Optional<Meme> meme = memeRepository.findById(commentDTO.getMemeId());

        if (post.isPresent() && user.isPresent()) {
            Comment comment = new Comment();
            comment.setContent(commentDTO.getContent());
            comment.setPost(post.get());
            comment.setUser(user.get());
            commentRepository.save(comment);
        } else if (meme.isPresent() && user.isPresent()) {
            Comment comment = new Comment();
            comment.setContent(commentDTO.getContent());
            comment.setMeme(meme.get());
            comment.setUser(user.get());
            commentRepository.save(comment);
        } else {
            throw new BadRequestException("Post meme or user not found");
        }
        return "Comment added successfully";
    }

    // UPDATE COMMENT METHOD
    public Comment updateComment(int id, CommentUpdateDTO commentUpdate) {
        return commentRepository.findById(id).map(comment -> {
            comment.setContent(commentUpdate.getContent());
            return commentRepository.save(comment);
        }).orElseThrow(() -> new CommentNotFoundException("Comment with ID: " + id + " not found"));
    }


    // DELETE COMMENT METHOD
    public String deleteComment(int id) {
        Optional<Comment> commentOptional = commentRepository.findById(id);
        if (commentOptional.isPresent()) {
            commentRepository.delete(commentOptional.get());
            return "Comment with ID: " + id + " deleted successfully.";
        } else {
            throw new CommentNotFoundException("Comment with ID: " + id + " not found.");
        }
    }
}
