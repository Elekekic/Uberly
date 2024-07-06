package Elena.Uberly_backend.Repository;

import Elena.Uberly_backend.Entity.Feedback;
import Elena.Uberly_backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {

     List<Feedback> findByAuthor(User author);

     List<Feedback> findByRecipient(User recipient);


}
