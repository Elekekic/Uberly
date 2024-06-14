package Elena.Uberly_backend.Service;

import Elena.Uberly_backend.DTO.FeedbackDTO;
import Elena.Uberly_backend.DTO.FeedbackUpdateDTO;
import Elena.Uberly_backend.Entity.Feedback;
import Elena.Uberly_backend.Entity.User;
import Elena.Uberly_backend.Exception.FeedbackNotFoundException;
import Elena.Uberly_backend.Exception.UserNotFoundException;
import Elena.Uberly_backend.Repository.FeedbackRepository;
import Elena.Uberly_backend.Repository.PostRepository;
import Elena.Uberly_backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;


    //GET ALL FEEDBACKS METHOD
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    //GET FEEDBACK BY ID METHOD
    public Optional<Feedback> getFeedbackById(int id) {
        Optional<Feedback> feedbackOptional = feedbackRepository.findById(id);
        if (feedbackOptional.isPresent()) {
            return feedbackRepository.findById(id);
        } else {
            throw new FeedbackNotFoundException("Feedback with ID: " + id + " not found");
        }
    }

    //SAVE FEEDBACK METHOD
    public String createFeedback(FeedbackDTO feedbackDTO) {
        User userAuthor = userRepository.findById(feedbackDTO.getAuthorId()).orElseThrow(() -> new UserNotFoundException("Author user not found"));
        User userRecipient = userRepository.findById(feedbackDTO.getRecipientId()).orElseThrow(() -> new UserNotFoundException("Author user not found"));

        Feedback feedback = new Feedback();
        feedback.setContent(feedbackDTO.getContent());
        feedback.setAuthor(userAuthor);
        feedback.setRecipient(userRecipient);
        feedbackRepository.save(feedback);
        return "Feedback created successfully";
    }

    //UPDATE FEEDBACK METHOD
    public String updateFeedback(int id, FeedbackUpdateDTO feedbackUpdateDTO) {
        Optional<Feedback> feedbackOptional = feedbackRepository.findById(id);
        if (feedbackOptional.isPresent()) {
            Feedback feedback = feedbackOptional.get();
            feedback.setContent(feedbackUpdateDTO.getContent());
            feedbackRepository.save(feedback);
            return "Feedback updated successfully";
        } else {
            throw new FeedbackNotFoundException("Feedback with ID: " + id + " not found");
        }
    }

    //QUERY - GET FEEDBACKS BY AUTHOR
    public List<Feedback> getFeedbacksByPostId(int authorId) {
        User author = userRepository.findById(authorId).orElseThrow(() -> new UserNotFoundException("Author user not found"));
        return feedbackRepository.findByAuthor(author);
    }

    //DELETE FEEDBACK METHOD
    public String deleteFeedback(int id) {
        Optional<Feedback> feedbackOptional = feedbackRepository.findById(id);
        if (feedbackOptional.isPresent()) {
            feedbackRepository.deleteById(id);
            return "Feedback deleted successfully";
        } else {
            throw new FeedbackNotFoundException("Feedback with ID: " + id + " not found");
        }
    }
}
