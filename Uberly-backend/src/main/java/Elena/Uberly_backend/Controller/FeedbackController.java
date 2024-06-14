package Elena.Uberly_backend.Controller;

import Elena.Uberly_backend.DTO.FeedbackDTO;
import Elena.Uberly_backend.DTO.FeedbackUpdateDTO;
import Elena.Uberly_backend.Entity.Feedback;
import Elena.Uberly_backend.Exception.BadRequestException;
import Elena.Uberly_backend.Service.FeedbackService;
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
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping("/feedbacks")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public List<Feedback> getAllFeedbacks() {
        return feedbackService.getAllFeedbacks();
    }

    @GetMapping("/feedbacks/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public Optional<Feedback> getFeedbackById(@PathVariable int id) {
        return feedbackService.getFeedbackById(id);
    }

    @PostMapping("/feedbacks")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public String createFeedback(@Validated @RequestBody FeedbackDTO feedbackDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream()
                    .map(objectError -> objectError.getDefaultMessage()).reduce("", (s, s2) -> s + s2));
        }
        return feedbackService.createFeedback(feedbackDTO);
    }

    @PutMapping("/feedbacks/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public String updateFeedback(@PathVariable int id, @RequestBody @Validated FeedbackUpdateDTO feedback, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream()
                    .map(objectError -> objectError.getDefaultMessage()).reduce("", (s, s2) -> s + s2));
        }
        return feedbackService.updateFeedback(id, feedback);
    }

    @DeleteMapping("/feedbacks/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public String deleteFeedback(@PathVariable int id) {
        return feedbackService.deleteFeedback(id);
    }
}
