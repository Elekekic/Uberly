package Elena.Uberly_backend.Repository;

import Elena.Uberly_backend.Entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

}
